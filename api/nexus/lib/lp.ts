import { wasmStoreRequest, calculateLpBonding, math, MICRO } from "@contco/terra-utilities"
import { NEXUS_CONTRACTS } from "./contracts";

const SYMBOL1 = "UST";
const SYMBOL2 = 'PSI';
const LP_NAME = "PSI-UST";

export const fetchAvailableLp = async (address: string) => {
    const query_msg = {balance: {address}};
    const result = wasmStoreRequest(NEXUS_CONTRACTS.liquidity, query_msg);
    return result;
};

export const fetchStakedLp = (address: string) => {
    const time_seconds = Math.round(new Date().getTime() / 1000);
    const query_msg = {staker_info: {staker: address, time_seconds}};
    const result = wasmStoreRequest(NEXUS_CONTRACTS.staking, query_msg);
    return result;
}

export const getNexusPool = (availableLpInfo: any, stakedLpInfo: any, poolInfo: any, nexusPrice: string) => {

    if(availableLpInfo?.balance !== '0' || stakedLpInfo?.bond_amount !== '0') {
      const {token1: token1UnStaked, token2: token2UnStaked, lpAmount: stakeableLp, lpUstValue: stakeableLpUstValue} = calculateLpBonding(availableLpInfo?.balance, poolInfo);
      const {token1: token1Staked, token2: token2Staked, lpAmount: stakedLp, lpUstValue: stakedLpUstValue} = calculateLpBonding(stakedLpInfo?.bond_amount, poolInfo);
      const rewards = (stakedLpInfo?.pending_reward / MICRO).toString();
      const rewardsValue = math.times(rewards, nexusPrice);
      const rewardsSymbol = SYMBOL2;
      const totalLpUstValue = stakedLpUstValue + stakeableLpUstValue;
      const apr = '0';
      return {symbol1: SYMBOL1, symbol2: SYMBOL2, lpName: LP_NAME, token1Staked: token1Staked.toString(), token1UnStaked: token1UnStaked.toString(), token2Staked: token2Staked.toString(), token2UnStaked: token2UnStaked.toString(), stakeableLpUstValue: stakeableLpUstValue.toString(), stakeableLp: stakeableLp.toString(), stakedLpUstValue: stakedLpUstValue.toString(), stakedLp: stakedLp.toString(), totalLpUstValue: totalLpUstValue.toString(), rewards, rewardsValue, rewardsSymbol, apr, price: nexusPrice};
    }
    return null;
}