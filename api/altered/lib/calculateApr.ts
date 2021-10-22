import { MICRO } from "@contco/terra-utilities";

export const calculateApr = (poolInfo, stateLPStaking, lotaPoolInfo) => {
  if (poolInfo.total_share && stateLPStaking.total_balance) {
    const ratio = poolInfo.total_share / poolInfo.assets[0].amount; 
    const altePrice = poolInfo.assets[1].amount / poolInfo.assets[0].amount;
    const lotaPrice = lotaPoolInfo.assets[1].amount / lotaPoolInfo.assets[0].amount;
    const inAlte = stateLPStaking.total_balance / ratio; 
    const totalStaked = (inAlte * altePrice) / MICRO / lotaPrice;
    const apr = ((150000 / totalStaked)).toString();

    return { apr, totalStaked: totalStaked.toString() };
  }
};
