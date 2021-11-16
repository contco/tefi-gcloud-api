import { getPoolInfo, getPrice } from "@contco/terra-utilities";
import { fetchHoldings, getHoldings } from "./holdings";
import { getNexusPoolDetails } from "./lp";
import { NEXUS_CONTRACTS } from "./constants";
import { fetchVaultData } from "./vault";
import { fetchGovState, getNexusGov } from "./gov";

const fetchData = (address: string) => {
  const result = Promise.all([
    fetchHoldings(address),
    getPoolInfo(NEXUS_CONTRACTS.pool),
    getNexusPoolDetails(address),
    fetchVaultData(address),
    fetchGovState(address),
  ]);
  return result;
};

export const getNexusAccount = async (address: string) => {
  const [holdingsInfo, poolInfo, nexusPools, nexusVault, govState] =
    await fetchData(address);
  const nexusPrice = getPrice(poolInfo);
  const nexusHoldings = getHoldings(holdingsInfo, nexusPrice);
  const nexusPool = nexusPools[0]?.symbol1 === "UST" ? nexusPools[0] : null;
  const nexusGov = getNexusGov(govState, nexusPrice);
  const nexusAccount = {
    nexusHoldings,
    nexusPool,
    nexusPools,
    nexusGov,
    nexusVault,
  };
  return nexusAccount;
};
