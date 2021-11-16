import {
  wasmStoreRequest,
  calculateLpBonding,
  math,
  MICRO,
  getPoolInfo,
  getPrice,
} from "@contco/terra-utilities";
import { NEXUS_CONTRACTS, NEXUS_POOL_CONTRACTS } from "./constants";
import { calculateApr } from "./calculateApr";

export const fetchAvailableLp = async (
  address: string,
  liquidityContract: string
) => {
  const query_msg = { balance: { address } };
  const result = wasmStoreRequest(liquidityContract, query_msg);
  return result;
};

export const fetchStakedLp = (address: string, stakingContract: string) => {
  const time_seconds = Math.round(new Date().getTime() / 1000);
  const query_msg = { staker_info: { staker: address, time_seconds } };
  const result = wasmStoreRequest(stakingContract, query_msg);
  return result;
};

export const fetchStakingState = (stakingContract: string) => {
  const query_msg = { state: {} };
  const result = wasmStoreRequest(stakingContract, query_msg);
  return result;
};

export const fetchStakingConfig = (stakingContract: string) => {
  const query_msg = { config: {} };
  const result = wasmStoreRequest(stakingContract, query_msg);
  return result;
};

export const fetchNexusPools = async (address: string) => {
  let nexusPrice: string;
  const poolPromises = NEXUS_POOL_CONTRACTS.map(async (pair: any) => {
    const [
      availableLpInfo,
      stakedLpInfo,
      stakingState,
      stakingConfig,
      poolInfo,
    ] = await Promise.all([
      fetchAvailableLp(address, pair.liquidity),
      fetchStakedLp(address, pair.staking),
      fetchStakingState(pair.staking),
      fetchStakingConfig(pair.staking),
      getPoolInfo(pair.pool),
    ]);
    if (pair.pool === NEXUS_CONTRACTS.pool) {
      nexusPrice = getPrice(poolInfo);
    }
    return {
      availableLpInfo,
      stakedLpInfo,
      stakingState,
      stakingConfig,
      poolInfo,
    };
  });
  const poolWasmInfos = await Promise.all(poolPromises);
  return { poolWasmInfos, nexusPrice };
};

export const getNexusPoolDetails = async (address: string) => {
  const { poolWasmInfos, nexusPrice } = await fetchNexusPools(address);
  const nexusPools = NEXUS_POOL_CONTRACTS.reduce(
    (poolAcm: any, pair: any, index: number) => {
      const poolDetail = getNexusPool(poolWasmInfos[index], nexusPrice, pair);
      if (poolDetail) {
        poolAcm.push(poolDetail);
      }
      return poolAcm;
    },
    []
  );
  return nexusPools;
};

const getLpUstValues = (
  stakedLpValue: number,
  stakeableLpValue: number,
  isUstPair: boolean,
  nexusPrice: number
) => {
  if (isUstPair) {
    const totalLpUstValue = stakedLpValue + stakeableLpValue;
    return {
      stakeableLpUstValue: stakeableLpValue,
      stakedLpUstValue: stakedLpValue,
      totalLpUstValue,
    };
  } else {
    const stakedLpUstValue = stakedLpValue * nexusPrice;
    const stakeableLpUstValue = stakeableLpValue * nexusPrice;
    const totalLpUstValue = stakedLpUstValue + stakeableLpUstValue;
    return { stakeableLpUstValue, stakedLpUstValue, totalLpUstValue };
  }
};

const getNexusPool = (
  poolWasmInfo: any,
  nexusPrice: string,
  pairDetails: any
) => {
  if (
    poolWasmInfo.availableLpInfo?.balance !== "0" ||
    poolWasmInfo.stakedLpInfo?.bond_amount !== "0"
  ) {
    const {
      token1: token1UnStaked,
      token2: token2UnStaked,
      lpAmount: stakeableLp,
      lpUstValue: stakeableLpValue,
    } = calculateLpBonding(
      poolWasmInfo.availableLpInfo?.balance,
      poolWasmInfo.poolInfo
    );
    const {
      token1: token1Staked,
      token2: token2Staked,
      lpAmount: stakedLp,
      lpUstValue: stakedLpValue,
    } = calculateLpBonding(
      poolWasmInfo.stakedLpInfo?.bond_amount,
      poolWasmInfo.poolInfo
    );
    const rewards = (
      poolWasmInfo.stakedLpInfo?.pending_reward / MICRO
    ).toString();
    const rewardsValue = math.times(rewards, nexusPrice);
    const { totalLpUstValue, stakeableLpUstValue, stakedLpUstValue } =
      getLpUstValues(
        stakedLpValue,
        stakeableLpValue,
        pairDetails.isUstPair,
        parseFloat(nexusPrice)
      );
    const apr = calculateApr(
      poolWasmInfo.poolInfo,
      poolWasmInfo.stakingState,
      poolWasmInfo.stakingConfig,
      nexusPrice,
      pairDetails.isUstPair
    );
    return {
      symbol1: pairDetails.symbol1,
      symbol2: pairDetails.symbol2,
      lpName: `${pairDetails.symbol2}-${pairDetails.symbol1}`,
      token1Staked: token1Staked.toString(),
      token1UnStaked: token1UnStaked.toString(),
      token2Staked: token2Staked.toString(),
      token2UnStaked: token2UnStaked.toString(),
      stakeableLpUstValue: stakeableLpUstValue.toString(),
      stakeableLp: stakeableLp.toString(),
      stakedLpUstValue: stakedLpUstValue.toString(),
      stakedLp: stakedLp.toString(),
      totalLpUstValue: totalLpUstValue.toString(),
      rewards,
      rewardsValue,
      rewardsSymbol: pairDetails.rewardsSymbol,
      apr,
      price: nexusPrice,
    };
  }
  return null;
};
