import BigNumber from "bignumber.js";
import { math } from "@contco/terra-utilities";
import { contracts } from "../contracts";
import { getFarmConfig, getRewardInfos } from "../utils";
import { fetchPoolApr, fetchGovApr } from "../../../valkyrie/lib/calculateApr";

export const getVkrPairStatsData = async (height: string) => {
  try {
    const rewardInfoPromise = getRewardInfos(
      height,
      contracts.valkyrieFarm,
      contracts.valkyrieStaking
    );
    const farmConfigPromise = getFarmConfig(contracts.valkyrieFarm);
    const [rewardInfo, farmConfig, vkrLpApr, vkrGovApr] = await Promise.all([
      rewardInfoPromise,
      farmConfigPromise,
      fetchPoolApr(),
      fetchGovApr(),
    ]);
    return { rewardInfo, farmConfig, vkrLpApr, vkrGovApr };
  } catch (err) {
    return {
      rewardInfo: { bond_amount: "0" },
      farmConfig: { community_fee: "0" },
      vkrLpApr: "0",
      vkrGovApr: "0",
    };
  }
};

const createVkrPairStats = (
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
    farmApr: +(math.div(apy, 100) || 0),
    tvl: "0",
    multiplier: poolInfo ? (govWeight * poolInfo.weight) / totalWeight : 0,
    vaultFee: 0,
  };
  return stat;
};

export const calculateVkrPairStats = (
  vkrStatsData,
  poolInfos,
  govVaults,
  terraSwapPoolResponses
) => {
  const { rewardInfo, farmConfig, vkrLpApr, vkrGovApr } = vkrStatsData;
  const terraSwapPool = terraSwapPoolResponses[contracts.valkyrieToken];
  const poolApr = +(vkrLpApr || 0);

  const totalWeight = Object.values(poolInfos).reduce(
    (a, b: any) => a + b.weight,
    0
  );
  const govWeight =
    govVaults.vaults.find((vault) => vault.address === contracts.valkyrieFarm)
      ?.weight || 0;

  const pairs = {};
  pairs[contracts.valkyrieToken] = createVkrPairStats(
    poolApr,
    contracts.valkyrieToken,
    poolInfos,
    vkrGovApr,
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

  const pair = pairs[contracts.valkyrieToken];
  const value = new BigNumber(uusd.amount)
    .times(rewardInfo?.bond_amount)
    .times(2)
    .div(terraSwapPool.total_share)
    .toString();
  pair.tvl = value;
  pair.vaultFee = +pair.tvl * pair.poolApr * communityFeeRate;
  pairs[contracts.valkyrieToken] = pair;
  return pairs;
};
