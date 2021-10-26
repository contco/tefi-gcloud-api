import { MICRO } from "@contco/terra-utilities";

export const calculateApr = (poolInfo: any, stakingState: any) => {
  if (poolInfo.total_share && stakingState.total_bond_amount) {
    const ratio = poolInfo.total_share / poolInfo.assets[0].amount;
    const flokiPrice = poolInfo.assets[1].amount / poolInfo.assets[0].amount;
    const inFloki = stakingState.total_bond_amount / ratio;
    const totalStaked = (inFloki * flokiPrice) / MICRO;
    const apr = ((15000000 / totalStaked) * 100).toString();
    return { apr, totalStaked: totalStaked.toString() };
  }
};
