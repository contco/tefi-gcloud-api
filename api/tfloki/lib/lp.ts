import {
  wasmStoreRequest,
  calculateLpBonding,
  math,
  MICRO,
  getLatestBlockHeight,
} from "@contco/terra-utilities";
import { TFLOKI_CONTRACTS } from "./contracts";

const SYMBOL1 = "UST";
const SYMBOL2 = "TFLOKI";
const LP_NAME = "TFLOKI-UST";

export const fetchAvailableLp = (address: string) => {
  const query_msg = { balance: { address } };
  const result = wasmStoreRequest(TFLOKI_CONTRACTS.liquidity, query_msg);
  return result;
};

export const fetchStakedLp = async (address: string) => {
  try {
    const block_height = await getLatestBlockHeight();
    const query_msg = {
      staker_info: { staker: address, block_height: parseInt(block_height) },
    };
    const result = await wasmStoreRequest(TFLOKI_CONTRACTS.staking, query_msg);
    return result;
  } catch (err) {
    return { bond_amount: "0", pending_reward: "0" };
  }
};

export const fetchStakingState = () => {
  const stateLpStaking = wasmStoreRequest(TFLOKI_CONTRACTS.staking, {
    state: {},
  });
  return stateLpStaking;
};
export const getFlokiPool = (
  availableLpInfo: any,
  stakedLpInfo: any,
  poolInfo: any,
  tflokiPrice: string
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
    const rewardsValue = math.times(rewards, tflokiPrice);
    const rewardsSymbol = SYMBOL2;
    const totalLpUstValue = stakedLpUstValue + stakeableLpUstValue;
    const apr = "0";
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
      price: tflokiPrice,
    };
  }
  return null;
};
