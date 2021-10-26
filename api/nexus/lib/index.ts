import {
  getPoolInfo,
  getPrice,
  getLatestBlockTime,
} from "@contco/terra-utilities";
import { fetchHoldings, getHoldings } from "./holdings";
import { fetchAvailableLp, fetchStakedLp, getNexusPool } from "./lp";
import { NEXUS_CONTRACTS } from "./contracts";
import nexus from "..";

const fetchData = (address: string) => {
  const result = Promise.all([
    fetchHoldings(address),
    getPoolInfo(NEXUS_CONTRACTS.pool),
    fetchAvailableLp(address),
    fetchStakedLp(address),
  ]);
  return result;
};

export const getNexusAccount = async (address: string) => {
  const [holdingsInfo, poolInfo, availableLp, stakedLp] = await fetchData(
    address
  );
  const nexusPrice = getPrice(poolInfo);
  const nexusHoldings = getHoldings(holdingsInfo, nexusPrice);
  const nexusPool = getNexusPool(availableLp, stakedLp, poolInfo, nexusPrice);
  const nexusAccount = { nexusHoldings, nexusPool };
  return nexusAccount;
};
