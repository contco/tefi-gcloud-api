import {
  wasmStoreRequest,
  calculateLpBonding,
  math,
  MICRO,
} from "@contco/terra-utilities";
import { VKR_CONTRACTS } from "./contracts";

const SYMBOL1 = "UST";
const SYMBOL2 = "VKR";
const LP_NAME = "VKR-UST";

export const fetchAvailableLp = (address: string) => {
  const query_msg = { balance: { address } };
  const result = wasmStoreRequest(VKR_CONTRACTS.liquidity, query_msg);
  return result;
};

export const fetchStakedLp = async (address: string) => {
  try {
    const query_msg = {
      staker_info: { staker: address },
    };
    const result = await wasmStoreRequest(VKR_CONTRACTS.staking, query_msg);
    return result;
  } catch (err) {
    return { bond_amount: "0", pending_reward: "0" };
  }
};

export const getVkrPool = (
  availableLpInfo: any,
  stakedLpInfo: any,
  poolInfo: any,
  vkrPrice: string,
  apr: string
) => {
  if (availableLpInfo?.balance !== "0" || stakedLpInfo?.bond_amount !== "0") {
    const {
      token1: token1UnStaked,
      token2: token2UnStaked,
      lpAmount: stakeableLp,
      lpUstValue: stakeableLpUstValue,
    } = calculateLpBonding(availableLpInfo?.balance, poolInfo);
    const {
      token1: token1Staked,
      token2: token2Staked,
      lpAmount: stakedLp,
      lpUstValue: stakedLpUstValue,
    } = calculateLpBonding(stakedLpInfo?.bond_amount, poolInfo);
    const rewards = (stakedLpInfo?.pending_reward / MICRO).toString();
    const rewardsValue = math.times(rewards, vkrPrice);
    const rewardsSymbol = SYMBOL2;
    const totalLpUstValue = stakedLpUstValue + stakeableLpUstValue;
    return {
      symbol1: SYMBOL1,
      symbol2: SYMBOL2,
      lpName: LP_NAME,
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
      rewardsSymbol,
      apr,
      price: vkrPrice,
    };
  }
  return null;
};
