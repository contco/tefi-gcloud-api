import { getPoolInfo, getPrice } from "@contco/terra-utilities";
import { fetchPoolApr } from "./calculateApr";
import { TFLOKI_CONTRACTS } from "./contracts";
import { getTFlokiNfts } from "./getTflokiNfts";
import { fetchHoldings, getHoldings } from "./holdings";
import { fetchAvailableLp, fetchStakedLp, getFlokiPool } from "./lp";

const fetchData = (address: string) => {
  const result = Promise.all([
    fetchHoldings(address),
    getPoolInfo(TFLOKI_CONTRACTS.pool),
    fetchAvailableLp(address),
    fetchStakedLp(address),
    fetchPoolApr(),
    getTFlokiNfts(address),
  ]);
  return result;
};

export const getTFlokiAccount = async (address: string) => {
  const [holdingsInfo, poolInfo, availableLp, stakedLp, poolApr, nfts] =
    await fetchData(address);
  const tflokiPrice = getPrice(poolInfo);
  const userHoldings = getHoldings(holdingsInfo, tflokiPrice);
  const flokiPool = getFlokiPool(
    availableLp,
    stakedLp,
    poolInfo,
    tflokiPrice,
    poolApr
  );
  const tflokiAccount = { tflokiHoldings: userHoldings, flokiPool, nfts };
  return tflokiAccount;
};
