import { getPoolInfo, getPrice } from "@contco/terra-utilities";
import { fetchHoldings, getHoldings } from "./holdings";
import { getNexusPoolDetails } from "./lp";
import { NEXUS_CONTRACTS } from "./constants";
import { fetchVaultData, EMPTY_VAULT } from "./vault";
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
  try {
    const [
      holdingsInfo,
      poolInfo,
      { nexusPools, nexusPoolSum, nexusPoolRewardsSum },
      nexusVault,
      govState,
    ] = await fetchData(address);
    const nexusPrice = getPrice(poolInfo);
    const nexusHoldings = getHoldings(holdingsInfo, nexusPrice);
    const nexusGov = getNexusGov(govState, nexusPrice);
    const total = { nexusPoolSum, nexusPoolRewardsSum };
    const nexusAccount = {
      nexusHoldings,
      nexusPools,
      nexusGov,
      nexusVault,
      total,
    };

    return nexusAccount;
  } catch (err) {
    return {
      nexusHoldings: null,
      nexusPools: [],
      nexusGov: null,
      nexusVault: EMPTY_VAULT,
      total: { nexusPoolSum: "0", nexusPoolRewardsSum: "0" },
    };
  }
};
