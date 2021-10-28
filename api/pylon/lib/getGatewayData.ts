import {
  wasmStoreRequest,
  getPoolInfo,
  getPrice,
  MICRO,
  math,
} from "@contco/terra-utilities";
import { fetchData } from "../../commons";
import { poolContracts, PYLON_API_ENDPOINT } from "./constants";
import { contracts as terraworldContracts } from "../../terraworld/lib/contracts";

const getTokenPrice = async (symbol) => {
  let price;
  const mineOverviewRequest = fetchData(
    PYLON_API_ENDPOINT + "mine/v1/overview"
  );
  const poolInfoTWDReuest = getPoolInfo(terraworldContracts.pool);
  const poolInfoLoopRequest = getPoolInfo(poolContracts.loop);
  const poolInfoVkrRequest = getPoolInfo(poolContracts.vkr);
  const [mineOverview, poolInfoTWD, poolInfoLoop, poolInfoVkr]: any =
    await Promise.all([
      mineOverviewRequest,
      poolInfoTWDReuest,
      poolInfoLoopRequest,
      poolInfoVkrRequest,
    ]);
  const minePrice = mineOverview.data.priceInUst;
  const twdPrice = getPrice(poolInfoTWD).toString();
  const loopPrice = getPrice(poolInfoLoop).toString();
  const vkrPrice = getPrice(poolInfoVkr).toString();
  if (symbol === "MINE") {
    price = minePrice;
  } else if (symbol === "LOOP") {
    price = loopPrice;
  } else if (symbol === "TWD") {
    price = twdPrice;
  } else if (symbol === "VKR") {
    price = vkrPrice;
  } else {
    console.log(
      `${symbol} symbol doest not match for price set in pylon gateway`
    );
  }
  return price;
};

const getLoopPoolData = async (projects, address) => {
  const gatewayPoolData = [];
  const timestamp = Math.floor(Date.now() / 1000);
  const query_blance = { balance_of: { owner: address } };
  const query_reward = { claimable_reward: { owner: address, timestamp } };
  let depositeSum = 0;
  let rewardsSum = 0;
  try {
    const task = projects.map(async (item, count) => {
      const poolTask = projects[count].pools.map(async (p) => {
        const balanceRequest = await wasmStoreRequest(p.contract, query_blance);
        const balance = balanceRequest?.amount / MICRO;
        const rewardsRequest = await wasmStoreRequest(p.contract, query_reward);
        const rewards = math.div(rewardsRequest.amount, MICRO);
        const price = await getTokenPrice(projects[count].symbol);
        const rewardsValue = math.times(rewards, price);
        depositeSum = depositeSum + balance;
        rewardsSum = rewardsSum + parseFloat(rewardsValue);
        const userProjectRequest: any = await fetchData(
          PYLON_API_ENDPOINT +
            `gateway/v1/projects/${projects[count].symbol}/status/${address}`
        );
        const depositLogs = [];
        userProjectRequest?.data.depositLogs?.map((a) =>
          depositLogs.push({
            deposit: a?.amountInUst.toString() ?? "0",
            depositDate: a.depositedAt,
            depositReleaseDate: "0",
            rewardReleaseDate: "0",
          })
        );
        if (balance !== 0) {
          gatewayPoolData.push({
            symbol: projects[count].symbol,
            apy: "0",
            poolName: `${projects[count].symbol} ` + p.name,
            depositLogs,
            totalDeposit: balance.toString(),
            rewards,
            rewardsValue,
          });
        }
        return p;
      });
      await Promise.all(poolTask);
      return item;
    });
    await Promise.all(task);
    return {
      gatewayPoolData,
      gatewayDepositsSum: depositeSum.toString(),
      gatewayRewardsSum: rewardsSum.toString(),
    };
  } catch (error) {
    return {
      gatewayPoolData: [],
      gatewayDepositsSum: "0",
      gatewayRewardsSum: "0",
    };
  }
};

export const getGatewayData = async (address: string) => {
  try {
    const loopPoolContracts: any = await fetchData(
      PYLON_API_ENDPOINT + `gateway/v1/projects/`
    );
    const loopPoolRequest = await getLoopPoolData(
      loopPoolContracts?.data?.projects,
      address
    );
    if (loopPoolRequest) {
      return { ...loopPoolRequest };
    }
    return {
      gatewayPoolData: [],
      gatewayDepositsSum: "0",
      gatewayRewardsSum: "0",
    };
  } catch (err) {
    return {
      gatewayPoolData: [],
      gatewayDepositsSum: "0",
      gatewayRewardsSum: "0",
    };
  }
};
