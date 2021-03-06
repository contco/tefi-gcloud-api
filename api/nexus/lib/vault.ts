import { wasmStoreRequest, math, MICRO } from "@contco/terra-utilities";
import { NEXUS_CONTRACTS, NEXUS_GRAPH_API } from "./constants";
import axios from "axios";
import { BASSETS_INFO } from "../../constants";
import { fetchData } from "../../commons";

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
  const aprRecords: any = await axios.get(NEXUS_GRAPH_API, {
    params: {
      query: APR_QUERY,
    },
  });

  return aprRecords?.data?.data?.getBAssetVaultAprRecords[0];
};

export const EMPTY_VAULT = {
  bLunaDeposit: "0",
  bLunaDepositValue: "0",
  bEthDeposit: "0",
  bEthDepositValue: "0",
  bLunaRewards: "0",
  bEthRewards: "0",
  bLunaVaultApr: "0",
  bEthVaultApr: "0",
};

export const fetchVaultData = async (address: string) => {
  try {
    const [bLunaDeposit, bEthDeposit, bLunaRewards, bEthRewards, aprRecords] =
      await Promise.all([
        fetchBalances(NEXUS_CONTRACTS["bLunaVault"], address),
        fetchBalances(NEXUS_CONTRACTS["bEthVault"], address),
        fetchRewards(NEXUS_CONTRACTS["bLunaRewards"], address),
        fetchRewards(NEXUS_CONTRACTS["bEthRewards"], address),
        fetchAprRecords(),
      ]);

    const bLunaVaultApr = aprRecords?.bLunaVaultApr;
    const bEthVaultApr = aprRecords?.bEthVaultApr;

    const bEthRequest: any = await fetchData(BASSETS_INFO + "beth");
    const bEthPrice = bEthRequest?.data?.beth_price;

    const bLUNARequest: any = await fetchData(BASSETS_INFO + "bluna");
    const bLUNAPrice = bLUNARequest?.data?.bLuna_price;

    return {
      bLunaDeposit,
      bLunaDepositValue: (
        parseFloat(bLunaDeposit) * parseFloat(bLUNAPrice)
      ).toString(),
      bEthDeposit,
      bEthDepositValue: (
        parseFloat(bEthDeposit) * parseFloat(bEthPrice)
      ).toString(),
      bLunaRewards,
      bEthRewards,
      bLunaVaultApr,
      bEthVaultApr,
    };
  } catch (err) {
    return EMPTY_VAULT;
  }
};
