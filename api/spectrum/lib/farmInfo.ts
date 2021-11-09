import axios from "axios";
import {
  getPrice,
  getLatestBlockHeight,
  LCD_URL,
} from "@contco/terra-utilities";
import { contracts } from "./contracts";
import { calculateAllFarmPairStats } from "./pairStats";
import { getRewardInfos } from "./rewardInfos";
import { getPairStatsData } from "./pairStats/getPairStats";
import { getGovConfig, getGovState, getGovVaults } from "./gov";
import { calculateFarmInfos } from "./calculateFarmInfo";
import { pairInfoList } from "./pairInfoList";
import { fetchSpecFarmInfo } from "./fetchFarmInfo";

export const getPoolInfos = async () => {
  const poolInfo = {};

  const [
    mirrorPool,
    specPool,
    pylonPool,
    anchorPool,
    twdPool,
    vkrPool,
    nexusPool,
  ] = await Promise.all([
    fetchSpecFarmInfo(contracts.mirrorFarm),
    fetchSpecFarmInfo(contracts.specFarm),
    fetchSpecFarmInfo(contracts.pylonFarm),
    fetchSpecFarmInfo(contracts.anchorFarm),
    fetchSpecFarmInfo(contracts.terraworldFarm),
    fetchSpecFarmInfo(contracts.valkyrieFarm),
    fetchSpecFarmInfo(contracts.nexusFarm),
  ]);

  const specPoolInfo = specPool?.pools.reduce((poolInfoList, pool) => {
    poolInfo[pool?.asset_token] = Object.assign(pool, { farm: "Spectrum" });
    poolInfoList[pool?.asset_token] = Object.assign(pool, { farm: "Spectrum" });
    return poolInfoList;
  }, {});

  const mirrorPoolInfo = mirrorPool.pools.reduce((poolInfoList, pool) => {
    poolInfo[pool?.asset_token] = Object.assign(pool, { farm: "Mirror" });
    poolInfoList[pool?.asset_token] = Object.assign(pool, { farm: "Mirror" });
    return poolInfoList;
  }, {});

  const pylonPoolInfo = pylonPool.pools.reduce((poolInfoList, pool) => {
    poolInfo[pool?.asset_token] = Object.assign(pool, { farm: "Pylon" });
    poolInfoList[pool?.asset_token] = Object.assign(pool, { farm: "Pylon" });
    return poolInfoList;
  }, {});

  const anchorPoolInfo = anchorPool.pools.reduce((poolInfoList, pool) => {
    poolInfo[pool?.asset_token] = Object.assign(pool, { farm: "Anchor" });
    poolInfoList[pool?.asset_token] = Object.assign(pool, { farm: "Anchor" });
    return poolInfoList;
  }, {});

  const twdPoolInfo = twdPool.pools.reduce((poolInfoList, pool) => {
    poolInfo[pool?.asset_token] = Object.assign(pool, { farm: "Terraworld" });
    poolInfoList[pool?.asset_token] = Object.assign(pool, {
      farm: "Terraworld",
    });
    return poolInfoList;
  }, {});

  const vkrPoolInfo = vkrPool.pools.reduce((poolInfoList, pool) => {
    poolInfo[pool?.asset_token] = Object.assign(pool, { farm: "Valkyrie" });
    poolInfoList[pool?.asset_token] = Object.assign(pool, {
      farm: "Valkyrie",
    });
    return poolInfoList;
  }, {});

  const nexusPoolInfo = nexusPool.pools.reduce((poolInfoList, pool) => {
    poolInfo[pool?.asset_token] = Object.assign(pool, { farm: "Nexus" });
    poolInfoList[pool?.asset_token] = Object.assign(pool, {
      farm: "Nexus",
    });
    return poolInfoList;
  }, {});

  return {
    poolInfo,
    mirrorPoolInfo,
    specPoolInfo,
    pylonPoolInfo,
    anchorPoolInfo,
    twdPoolInfo,
    vkrPoolInfo,
    nexusPoolInfo,
  };
};

export const getPairsInfo = async (poolInfo: any) => {
  const list = Object.keys(poolInfo);
  const pairsInfo = {};
  const tasks = list.map(async (key) => {
    const pairInfo: any = await axios.get(
      LCD_URL + `wasm/contracts/${contracts.terraSwapFactory}/store`,
      {
        params: {
          query_msg: JSON.stringify({
            pair: {
              asset_infos: [
                { token: { contract_addr: key } },
                { native_token: { denom: "uusd" } },
              ],
            },
          }),
        },
      }
    );
    pairsInfo[key] = pairInfo?.data?.result;
    return pairInfo;
  });
  await Promise.all(tasks);
  return pairsInfo;
};

const fetchPoolResponseData = async (address: string) => {
  const { data }: any = await axios.get(
    LCD_URL + `wasm/contracts/${address}/store`,
    {
      params: {
        query_msg: JSON.stringify({
          pool: {},
        }),
      },
    }
  );
  return data?.result;
};

const getPoolResponses = async () => {
  const poolResponses = {};
  const tasks = Object.keys(pairInfoList).map(async (key) => {
    const data = await fetchPoolResponseData(pairInfoList[key].contract_addr);
    poolResponses[key] = data;
  });
  await Promise.all(tasks);
  return poolResponses;
};

const fetchFarmData = async (
  height: string,
  address: string,
  poolResponses: any
) => {
  const govState = getGovState(height);
  const pairRewardInfos = getRewardInfos(address);
  const pairStatsData = getPairStatsData(height, poolResponses);
  const result = await Promise.all([govState, pairRewardInfos, pairStatsData]);
  return result;
};

export const getFarmInfos = async (address: string) => {
  try {
    const [poolData, height, terraSwapPoolResponses, govConfig, govVaults] =
      await Promise.all([
        getPoolInfos(),
        getLatestBlockHeight(),
        getPoolResponses(),
        getGovConfig(),
        getGovVaults(),
      ]);
    const {
      poolInfo,
      mirrorPoolInfo,
      specPoolInfo,
      pylonPoolInfo,
      anchorPoolInfo,
      twdPoolInfo,
      vkrPoolInfo,
      nexusPoolInfo,
    } = poolData;
    const [govState, pairRewardInfos, pairStatsData] = await fetchFarmData(
      height,
      address,
      terraSwapPoolResponses
    );
    const specPrice = getPrice(terraSwapPoolResponses[contracts.specToken]);
    const pairStats = calculateAllFarmPairStats(
      height,
      pairStatsData,
      specPrice,
      mirrorPoolInfo,
      specPoolInfo,
      govConfig,
      govVaults,
      govState,
      pylonPoolInfo,
      anchorPoolInfo,
      terraSwapPoolResponses,
      twdPoolInfo,
      vkrPoolInfo,
      nexusPoolInfo
    );

    const { farmInfos, farmsTotal, rewardsTotal } = calculateFarmInfos(
      poolInfo,
      pairStats,
      pairRewardInfos,
      terraSwapPoolResponses
    );
    return {
      farms: farmInfos,
      farmsTotal,
      rewardsTotal,
      govApr: pairStats.govApr,
    };
  } catch (err) {
    return { farms: [], farmsTotal: "0", rewardsTotal: "0", govApr: 0 };
  }
};
