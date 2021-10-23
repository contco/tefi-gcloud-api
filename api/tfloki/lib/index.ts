import { getPoolInfo, getPrice} from "@contco/terra-utilities";
import { fetchHoldings, getHoldings } from "./holdings";
import { fetchAvailableLp, fetchStakedLp, fetchStakingState, getFlokiPool } from "./lp";

const fetchData = (address: string) => {
    const result = Promise.all([fetchHoldings(address), getPoolInfo("terra1yjmpu9c3dzknf8axtp6k74nvkwrd457u7p2sdr"), fetchAvailableLp(address), fetchStakedLp(address), fetchStakingState()]);
    return result;
}

export const getTFlokiAccount = async (address: string) => {
  const [holdingsInfo, poolInfo, availableLp, stakedLp, stakingState] = await fetchData(address);
  const tflokiPrice = getPrice(poolInfo);
  const userHoldings = getHoldings(holdingsInfo, tflokiPrice);
  const flokiPool = getFlokiPool(availableLp, stakedLp, poolInfo, stakingState, tflokiPrice);
  const tflokiAccount =  {tflokiHoldings: userHoldings, flokiPool};
  return tflokiAccount;
};
