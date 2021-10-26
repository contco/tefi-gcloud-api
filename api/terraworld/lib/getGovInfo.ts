import { getPrice, MICRO, math } from "@contco/terra-utilities";
import { calculateTwdGovApy } from "./calculateApr";

const SYMBOL = "TWD";
const NAME = "TWD Gov";

export const getGovInfo = (
  poolInfo: any,
  govStakingInfo: any,
  govState: any,
  govConfig: any,
  blockHeight: number
) => {
  if (govStakingInfo?.bond_amount === "0") {
    return null;
  }
  const price = getPrice(poolInfo);

  const staked = math.div(govStakingInfo?.bond_amount, MICRO);
  const value = math.times(staked, price);
  const rewards = math.div(govStakingInfo.pending_reward, MICRO);
  const rewardsValue = math.times(rewards, price);
  const apy = calculateTwdGovApy(blockHeight, govState, govConfig);
  return {
    name: NAME,
    symbol: SYMBOL,
    staked,
    value,
    rewards,
    rewardsValue,
    apy,
    price,
  };
};
