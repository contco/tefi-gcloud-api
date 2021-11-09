import BigNumber from "bignumber.js";
import { getPrice } from "@contco/terra-utilities";
import { contracts } from "../contracts";
import { getFarmConfig, getRewardInfos } from "../utils";
import { calculateApr } from "../../../nexus/lib/calculateApr";
import { fetchStakingState, fetchStakingConfig } from "../../../nexus/lib/lp";

export const getNexusPairStatsData = async (
  height: string,
  poolResponse: any
) => {
  try {
    const rewardInfoPromise = getRewardInfos(
      height,
      contracts.nexusFarm,
      contracts.nexusStaking
    );
    const farmConfigPromise = getFarmConfig(contracts.nexusFarm);
    const [rewardInfo, farmConfig, stakingState, stakingConfig] =
      await Promise.all([
        rewardInfoPromise,
        farmConfigPromise,
        fetchStakingState(),
        fetchStakingConfig(),
      ]);
    const nexusPrice = getPrice(poolResponse);
    const apr = calculateApr(
      poolResponse,
      stakingState,
      stakingConfig,
      nexusPrice
    );
    return { rewardInfo, farmConfig, apr };
  } catch (err) {
    return {
      rewardInfo: { bond_amount: "0" },
      farmConfig: { community_fee: "0" },
      apr: "0",
    };
  }
};

const createNexusPairStats = (
  poolApr: number,
  token: string,
  poolInfos: any,
  govWeight: any,
  totalWeight: any
) => {
  const poolInfo = poolInfos[token];
  const stat = {
    poolApr,
    poolApy: (poolApr / 8760 + 1) ** 8760 - 1,
    farmApr: 0,
    tvl: "0",
    multiplier: poolInfo ? (govWeight * poolInfo.weight) / totalWeight : 0,
    vaultFee: 0,
  };
  return stat;
};

export const calculateNexusPairStats = (
  nexusStatsData,
  poolInfos,
  govVaults,
  govConfig,
  terraSwapPoolResponses
) => {
  const { rewardInfo, farmConfig, apr } = nexusStatsData;
  const terraSwapPool = terraSwapPoolResponses[contracts.nexusToken];
  const poolApr = +(apr || 0);

  const totalWeight = Object.values(poolInfos).reduce(
    (a, b: any) => a + b.weight,
    0
  );
  const govWeight =
    govVaults.vaults.find((vault) => vault.address === contracts.terraworldFarm)
      ?.weight || 0;

  const pairs = {};
  pairs[contracts.nexusToken] = createNexusPairStats(
    poolApr,
    contracts.nexusToken,
    poolInfos,
    govWeight,
    totalWeight
  );

  const communityFeeRate =
    +farmConfig.community_fee * (1 - +govConfig.warchest_ratio);
  const uusd = terraSwapPool?.assets.find(
    (a) => a.info.native_token?.["denom"] === "uusd"
  );
  if (!uusd) {
    return;
  }

  const pair = pairs[contracts.nexusToken];
  const value = new BigNumber(uusd.amount)
    .times(rewardInfo?.bond_amount)
    .times(2)
    .div(terraSwapPool.total_share)
    .toString();
  pair.tvl = value;
  pair.vaultFee = +pair.tvl * pair.poolApr * communityFeeRate;
  pairs[contracts.nexusToken] = pair;
  return pairs;
};
