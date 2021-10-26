import BigNumber from "bignumber.js";
import { wasmStoreRequest, getPrice } from "@contco/terra-utilities";
import { contracts } from "../contracts";
import { getFarmConfig, getRewardInfos } from "../utils";
import { UUSD_DENOM } from "../../../constants";

export const getTwdPairStatsData = async (
  height: string,
  twdPoolResponse: any
) => {
  try {
    const rewardInfoPromise = getRewardInfos(
      height,
      contracts.terraworldFarm,
      contracts.terraworldStaking
    );
    const farmConfigPromise = getFarmConfig(contracts.terraworldFarm);
    const twdLpAprPromise = getTwdLpApr(height, twdPoolResponse);
    const twdGovApyPromise = getTwdGovApy(height);
    const [rewardInfo, farmConfig, twdLpApr, twdGovApr] = await Promise.all([
      rewardInfoPromise,
      farmConfigPromise,
      twdLpAprPromise,
      twdGovApyPromise,
    ]);
    return { rewardInfo, farmConfig, ...twdLpApr, ...twdGovApr };
  } catch (err) {
    return {
      rewardInfo: { bond_amount: "0" },
      farmConfig: { community_fee: "0" },
      apr: "0",
      apy: "0",
    };
  }
};

const getTwdLpApr = async (height: string, twdPoolResponse: any) => {
  try {
    const configTask = wasmStoreRequest(contracts.terraworldStaking, {
      config: {},
    });
    const stateTask = wasmStoreRequest(contracts.terraworldStaking, {
      state: { block_height: +height },
    });
    const [config, state] = await Promise.all([configTask, stateTask]);
    const twdPoolUSTAmount =
      twdPoolResponse.assets[1]?.info?.native_token?.["denom"] === UUSD_DENOM
        ? twdPoolResponse.assets[1].amount
        : twdPoolResponse.assets[0].amount;
    const twdPrice = getPrice(twdPoolResponse);
    const current_distribution_schedule = (
      config.distribution_schedule as []
    ).find((obj) => +height >= +obj[0] && +height <= +obj[1]);
    const totalMint = +current_distribution_schedule[2];
    const c = new BigNumber(twdPoolUSTAmount)
      .multipliedBy(2)
      .div(twdPoolResponse.total_share);
    const s = new BigNumber(state.total_bond_amount).multipliedBy(c);
    const apr = new BigNumber(totalMint).multipliedBy(twdPrice).div(s);
    return {
      apr,
    };
  } catch (err) {
    return { apr: "0" };
  }
};

const getTwdGovApy = async (height: string) => {
  try {
    const configTask = wasmStoreRequest(contracts.terraworldGov, {
      config: {},
    });
    const stateTask = wasmStoreRequest(contracts.terraworldGov, {
      state: { block_height: +height },
    });
    const [config, state] = await Promise.all([configTask, stateTask]);
    const current_distribution_schedule = (
      config.distribution_schedule as []
    ).find((obj) => +height >= +obj[0] && +height <= +obj[1]);
    const totalMint = +current_distribution_schedule[2];
    const apr = new BigNumber(totalMint).div(state.total_bond_amount);
    const apy = (+apr / 365 + 1) ** 365 - 1;
    return {
      apy,
    };
  } catch (err) {
    return {
      apy: "0",
    };
  }
};

const createTwdPairStats = (
  poolApr: number,
  token: string,
  poolInfos: any,
  apy: string,
  govWeight: any,
  totalWeight: any
) => {
  const poolInfo = poolInfos[token];
  const stat = {
    poolApr,
    poolApy: (poolApr / 8760 + 1) ** 8760 - 1,
    farmApr: +(apy || 0),
    tvl: "0",
    multiplier: poolInfo ? (govWeight * poolInfo.weight) / totalWeight : 0,
    vaultFee: 0,
  };
  return stat;
};

export const calculateTwdPairStats = (
  twdStatsData,
  poolInfos,
  govVaults,
  govConfig,
  terraSwapPoolResponses
) => {
  const { rewardInfo, farmConfig, apr, apy } = twdStatsData;
  const terraSwapPool = terraSwapPoolResponses[contracts.terraworldToken];
  const poolApr = +(apr || 0);

  const totalWeight = Object.values(poolInfos).reduce(
    (a, b: any) => a + b.weight,
    0
  );
  const govWeight =
    govVaults.vaults.find((vault) => vault.address === contracts.terraworldFarm)
      ?.weight || 0;
  const pairs = {};
  pairs[contracts.terraworldToken] = createTwdPairStats(
    poolApr,
    contracts.terraworldToken,
    poolInfos,
    apy,
    govWeight,
    totalWeight
  );

  const communityFeeRate = +farmConfig.community_fee;
  const uusd = terraSwapPool?.assets.find(
    (a) => a.info.native_token?.["denom"] === "uusd"
  );
  if (!uusd) {
    return;
  }

  const pair = pairs[contracts.terraworldToken];
  const value = new BigNumber(uusd.amount)
    .times(rewardInfo?.bond_amount)
    .times(2)
    .div(terraSwapPool.total_share)
    .toString();
  pair.tvl = value;
  pair.vaultFee = +pair.tvl * pair.poolApr * communityFeeRate;
  pairs[contracts.terraworldToken] = pair;
  return pairs;
};
