import { getPrice, getLpValue, MICRO } from '@contco/terra-utilities';
import { getPoolValues } from './getPoolValues';

const LP_NAME = 'ALTE-UST';
const SYMBOL1 = 'UST'
const SYMBOL2 = "ALTE";

export const getLpStakingInfo = (poolInfo, lpTokenInfo, holderLPInfo) => {
  if (lpTokenInfo?.balance === '0' && holderLPInfo?.balance === '0') {
    return null;
  }
  const price = getPrice(poolInfo);
  const lpValue = getLpValue(poolInfo, parseFloat(price));
  const stakeableLp = parseFloat(lpTokenInfo.balance) / MICRO;
  const stakedLp = parseFloat(holderLPInfo.balance) / MICRO;
  const LpStakeInfo: any = getPoolValues(stakedLp, stakeableLp, lpValue, parseFloat(price));
  return { symbol1: SYMBOL1, symbol2: SYMBOL2, lpName: LP_NAME, lpValue: lpValue.toString(), price, stakedLp: stakedLp.toString(), stakeableLp: stakeableLp.toString(), ...LpStakeInfo };
};
