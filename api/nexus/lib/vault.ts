import { wasmStoreRequest, math, MICRO } from "@contco/terra-utilities";
import { NEXUS_CONTRACTS } from "./contracts";
import axios from "axios";

const NEXUS_API = "https://api.nexusprotocol.app/graphql";

const APR_QUERY =
  "\n  {\n    getBAssetVaultAprRecords(limit: 7, offset: 0) {\n      date\n      bEthVaultApr\n      bEthVaultManualApr\n      bLunaVaultApr\n      bLunaVaultManualApr\n    }\n  }\n";

const fetchBalances = async (vaultContract: string, address: string) => {
  const query_msg = {
    balance: {
      address,
    },
  };
  const result = await wasmStoreRequest(vaultContract, query_msg);
  return math.div(result?.balance, MICRO);
};

const fetchRewards = async (rewardContract: string, address: string) => {
  const query_msg = {
    accrued_rewards: {
      address,
    },
  };
  const result = await wasmStoreRequest(rewardContract, query_msg);
  return math.div(result?.rewards, MICRO);
};

const fetchAprRecords = async () => {
  const aprRecords: any = await axios.get(NEXUS_API, {
    params: {
      query: APR_QUERY,
    },
  });

  return aprRecords?.data?.data?.getBAssetVaultAprRecords[0];
};

export const fetchVaultData = async (address: string) => {
  const bLunaDeposit = await fetchBalances(
    NEXUS_CONTRACTS["bLunaVault"],
    address
  );

  const bEthDeposit = await fetchBalances(
    NEXUS_CONTRACTS["bEthVault"],
    address
  );
  const bLunaRewards = await fetchRewards(
    NEXUS_CONTRACTS["bLunaRewards"],
    address
  );
  const bEthRewards = await fetchRewards(
    NEXUS_CONTRACTS["bEthRewards"],
    address
  );
  const aprRecords = await fetchAprRecords();
  const bLunaVaultApr = aprRecords?.bLunaVaultApr;
  const bEthVaultApr = aprRecords?.bEthVaultApr;

  return {
    bLunaDeposit,
    bEthDeposit,
    bLunaRewards,
    bEthRewards,
    bLunaVaultApr,
    bEthVaultApr,
  };
};
