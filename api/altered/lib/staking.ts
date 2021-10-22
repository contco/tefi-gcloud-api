import { getPoolInfo, getPrice, wasmStoreRequest, MICRO } from '@contco/terra-utilities';
import { contracts } from './contracts';
import { getLpStakingInfo } from './getLpStaking';
import { calculateApr } from './calculateApr';


const fetchAlteredPoolData = (address: string) => {
  const LpTokenMsg = {
    balance: {
      address: address,
    },
  };

  const holderLPMsg = {
    holder: {
      address: address,
    },
  };
  const accrued_rewards = {
    accrued_rewards: {
      address: address,
    },
  };

  const poolInfoRequest = getPoolInfo(contracts.pool);
  const lotaPoolInfoRequest = getPoolInfo(contracts.lotaPool);
  const lpTokenRequest = wasmStoreRequest(contracts.AlteredLPAddress, LpTokenMsg);
  const holderLP = wasmStoreRequest(contracts.AlteredStakingLPAddress, holderLPMsg);
  const LPHolderAccruedRewards = wasmStoreRequest(contracts.AlteredStakingLPAddress, accrued_rewards);
  const stateLpStaking = wasmStoreRequest(contracts.AlteredStakingLPAddress, {state: {}});
  return Promise.all([poolInfoRequest, lotaPoolInfoRequest,lpTokenRequest, holderLP, LPHolderAccruedRewards, stateLpStaking]);
}

export const getAlteredStaking = async (address: string) => {
  try {
    const [
      poolInfo,
      lotaPoolInfo,
      lpTokenInfo,
      holderLPInfo,
      lpRewardsInfo,
      stateLpStakingInfo,
    ] = await fetchAlteredPoolData(address);

    const altePoolInfo = getLpStakingInfo(poolInfo, lpTokenInfo, holderLPInfo);
    if(altePoolInfo) {
      const lotaPrice: any = getPrice(lotaPoolInfo);
      const rewards = lpRewardsInfo?.rewards / MICRO;
      const rewardsSymbol = 'LOTA';
      const {apr, totalStaked} = calculateApr(poolInfo, stateLpStakingInfo, lotaPoolInfo);
      const rewardsValue = lotaPrice * rewards;
      const altePool = { ...altePoolInfo, rewards: rewards.toString(), rewardsValue: rewardsValue.toString(), rewardsSymbol, apr, totalStaked };
      return altePool;
    }
    return null;
  } catch (err) {
    return null;
  }
};
