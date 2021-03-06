import {
  wasmStoreRequest,
  calculateLpBonding,
  getLatestBlockTime,
  MICRO,
} from "@contco/terra-utilities";
import { date } from "../../commons";
import { contracts } from "./contracts";

const LP_NAME = "STT-UST";
const TOKEN1_SYMBOL = "UST";
const TOKEN2_SYMBOL = "STT";

export const fetchUserStarTerraStakingPools = async (address: string) => {
  try {
    const block_time = await getLatestBlockTime();
    const query_msg = {
      staker_info: {
        staker: address,
        block_time,
      },
    };

    const userStakingPoolPromises = contracts.lpStakingContracts.map(
      async (lpContract: any) => {
        const userStakingInfo = await wasmStoreRequest(
          lpContract.contract,
          query_msg
        );
        return { factionName: lpContract.faction, ...userStakingInfo };
      }
    );

    const userStakingPools = await Promise.all(userStakingPoolPromises);
    const filteredResults = userStakingPools.filter(
      (item) => item.bond_amount !== "0" || item.rewards_per_fee.length !== 0
    );
    return filteredResults;
  } catch (err) {
    return [];
  }
};

export const fetchUserLpData = (address: string) => {
  const query_msg = {
    balance: {
      address,
    },
  };
  const result = wasmStoreRequest(contracts.lp, query_msg);
  return result;
};

const getStakedData = (stakingPools: any, poolInfo: any, sttPrice: any) => {
  if (stakingPools.length === 0) {
    return {
      stakedData: null,
      totalStakedLp: "0",
      totalStakedLpUstValue: "0",
      totalRewards: "0",
      totalRewardsValue: "0",
    };
  } else {
    let totalStakedLp = 0;
    let totalBondedLp = 0;
    let totalBondedLpUstValue = 0;
    let totalStakedLpUstValue = 0;
    let totalRewards = 0;
    let totalRewardsValue = 0;

    const stakedData = stakingPools.map((stakingPool: any) => {
      const { lpAmount, lpUstValue, token1, token2 } = calculateLpBonding(
        stakingPool.bond_amount,
        poolInfo
      );
      const rewards = stakingPool.pending_reward / MICRO;
      const rewardsValue = rewards * parseFloat(sttPrice);
      const bondedAmount = stakingPool.rewards_per_fee[0]
        ? stakingPool.rewards_per_fee[0].amount
        : 0;
      const bondedData = calculateLpBonding(bondedAmount, poolInfo);

      const unbondingTime = stakingPool.rewards_per_fee[0]
        ? date.secondsToDate(
            Math.floor(new Date().getTime()) / 1000 +
              parseFloat(stakingPool.time_to_best_fee)
          )
        : "-";

      const bondedLp = bondedData.lpAmount;
      const bondedLpUstValue = bondedData.lpUstValue;
      const token1Bonded = bondedData.token1;
      const token2Bonded = bondedData.token2;

      totalStakedLp = totalStakedLp + lpAmount;
      totalStakedLpUstValue = totalStakedLpUstValue + lpUstValue;
      totalBondedLp = totalBondedLp + bondedLp;
      totalBondedLpUstValue = totalBondedLpUstValue + bondedLpUstValue;
      totalRewards = totalRewards + rewards;
      totalRewardsValue = totalRewardsValue + rewardsValue;

      return {
        lpName: LP_NAME,
        faction: stakingPool.factionName,
        stakedLp: lpAmount.toString(),
        stakedLpUstValue: lpUstValue.toString(),
        token1Staked: token1.toString(),
        token2Staked: token2.toString(),
        rewards: rewards.toString(),
        rewardsValue: rewardsValue.toString(),
        bondedLp: bondedLp.toString(),
        bondedLpUstValue: bondedLpUstValue.toString(),
        token1Bonded: token1Bonded.toString(),
        token2Bonded: token2Bonded.toString(),
        unbondingTime,
      };
    });

    return {
      stakedData,
      totalStakedLp: totalStakedLp.toString(),
      totalStakedLpUstValue: totalStakedLpUstValue.toString(),
      totalBondedLp: totalBondedLp.toString(),
      totalBondedLpUstValue: totalBondedLpUstValue.toString(),
      totalRewards: totalRewards.toString(),
      totalRewardsValue: totalRewardsValue.toString(),
    };
  }
};

const getStakeAbleData = (userLpData: any, poolInfo: any) => {
  if (userLpData?.balance === "0" && userLpData?.pending_reward === "0") {
    return {
      stakeableLp: "0",
      stakeableLpUstValue: "0",
      token1UnStaked: "0",
      token2UnStaked: "0",
    };
  } else {
    const { lpAmount, lpUstValue, token1, token2 } = calculateLpBonding(
      userLpData.balance,
      poolInfo
    );
    return {
      stakeableLp: lpAmount.toString(),
      stakeableLpUstValue: lpUstValue.toString(),
      token1UnStaked: token1.toString(),
      token2UnStaked: token2.toString(),
    };
  }
};

export const getStarTerraPools = (
  userStakingPools: any,
  userLpData: any,
  poolInfo: any,
  sttPrice: string
) => {
  const {
    stakedData,
    totalStakedLp,
    totalStakedLpUstValue,
    totalBondedLp,
    totalBondedLpUstValue,
    totalRewards,
    totalRewardsValue,
  } = getStakedData(userStakingPools, poolInfo, sttPrice);
  const stakeableData = getStakeAbleData(userLpData, poolInfo);

  return {
    stakedData,
    symbol1: TOKEN1_SYMBOL,
    symbol2: TOKEN2_SYMBOL,
    totalStakedLp,
    totalStakedLpUstValue,
    totalBondedLp,
    totalBondedLpUstValue,
    totalRewards,
    totalRewardsValue,
    ...stakeableData,
  };
};
