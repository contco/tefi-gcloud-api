import { getPoolInfo, getPrice } from "@contco/terra-utilities";
import { fetchPoolApr, fetchGovApr } from "./calculateApr";
import { VKR_CONTRACTS } from "./contracts";
import { fetchHoldings, getHoldings } from "./holdings";
import { fetchAvailableLp, fetchStakedLp, getVkrPool } from "./lp";
import { fetchGov, getGovInfo } from "./gov";

const fetchData = (address: string) => {
  const result = Promise.all([
    fetchHoldings(address),
    getPoolInfo(VKR_CONTRACTS.pool),
    fetchAvailableLp(address),
    fetchStakedLp(address),
    fetchPoolApr(),
    fetchGov(address),
    fetchGovApr(),
  ]);
  return result;
};

export const getValkyrieAccount = async (address: string) => {
  const [
    holdingsInfo,
    poolInfo,
    availableLp,
    stakedLp,
    poolApr,
    govInfo,
    govApr,
  ] = await fetchData(address);
  const vkrPrice = getPrice(poolInfo);
  const vkrHoldings = getHoldings(holdingsInfo, vkrPrice);
  const vkrPool = getVkrPool(
    availableLp,
    stakedLp,
    poolInfo,
    vkrPrice,
    poolApr
  );
  const vkrGov = getGovInfo(vkrPrice, govInfo, govApr);
  const valkyrieAccount = { vkrHoldings, vkrPool, vkrGov };
  return valkyrieAccount;
};
