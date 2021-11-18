import { wasmStoreRequest, math, MICRO } from "@contco/terra-utilities";
import { NEXUS_CONTRACTS } from "./constants";

const SYMBOL = "PSI";
const NAME = "Nexus Psi";

export const fetchHoldings = (address: string) => {
  const query_msg = {
    balance: {
      address,
    },
  };
  const result = wasmStoreRequest(NEXUS_CONTRACTS.token, query_msg);
  return result;
};

export const getHoldings = (holdingInfo: any, psiPrice: string) => {
  if (holdingInfo?.balance && holdingInfo?.balance !== "0") {
    const balance = math.div(holdingInfo.balance, MICRO);
    const value = math.times(balance, psiPrice);
    const contract = NEXUS_CONTRACTS.token;
    return {
      name: NAME,
      symbol: SYMBOL,
      balance,
      value,
      contract,
      price: psiPrice,
    };
  }
  return null;
};
