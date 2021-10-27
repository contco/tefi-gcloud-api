import { getPoolInfo, getPrice } from "@contco/terra-utilities";
import { fetchHoldings, getHoldings } from "./holdings";
import {
  fetchAvailableLp,
  fetchStakedLp,
  fetchStakingConfig,
  fetchStakingState,
  getNexusPool,
} from "./lp";
import { NEXUS_CONTRACTS } from "./contracts";

const fetchData = (address: string) => {
  const result = Promise.all([
    fetchHoldings(address),
    getPoolInfo(NEXUS_CONTRACTS.pool),
    fetchAvailableLp(address),
    fetchStakedLp(address),
    fetchStakingState(),
    fetchStakingConfig(),
  ]);
  return result;
};

export const getNexusAccount = async (address: string) => {
  const [
    holdingsInfo,
    poolInfo,
    availableLp,
    stakedLp,
    stakingState,
    stakingConfig,
  ] = await fetchData(address);
  const nexusPrice = getPrice(poolInfo);
  const nexusHoldings = getHoldings(holdingsInfo, nexusPrice);
  const nexusPool = getNexusPool(
    availableLp,
    stakedLp,
    poolInfo,
    stakingState,
    stakingConfig,
    nexusPrice
  );
  const nexusAccount = { nexusHoldings, nexusPool };

  return nexusAccount;
};
