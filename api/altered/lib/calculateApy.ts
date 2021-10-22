import { MICRO } from "@contco/terra-utilities";

export const calculateAPY = (poolInfo, stateLPStaking, LotaPoolInfo) => {
  if (poolInfo.total_share && stateLPStaking.total_balance) {
    const ratio = poolInfo.total_share / poolInfo.assets[0].amount; 
    const Cal = poolInfo.assets[1].amount / poolInfo.assets[0].amount;
    const dec = LotaPoolInfo.assets[1].amount / LotaPoolInfo.assets[0].amount;
    const inAlte = stateLPStaking.total_balance / ratio; 
    const totalStaked = (inAlte * Cal) / MICRO / dec;
    const apr = ((150000 / totalStaked) * 100).toString();

    return { apr, totalStaked: totalStaked.toString() };
  }
};
