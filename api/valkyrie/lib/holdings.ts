import { wasmStoreRequest, math, MICRO } from "@contco/terra-utilities";
import { VKR_CONTRACTS } from "./contracts";

const SYMBOL = "VKR";
const NAME = "Valkyrie";

export const fetchHoldings = (address: string) => {
  const query_msg = {
    balance: {
      address,
    },
  };
  const result = wasmStoreRequest(VKR_CONTRACTS.token, query_msg);
  return result;
};

export const getHoldings = (holdingInfo: any, vkrPrice: string) => {
  if (holdingInfo?.balance && holdingInfo?.balance !== "0") {
    const balance = math.div(holdingInfo.balance, MICRO);
    const value = math.times(balance, vkrPrice);
    const contract = VKR_CONTRACTS.token;
    return {
      name: NAME,
      symbol: SYMBOL,
      balance,
      value,
      contract,
      price: vkrPrice,
    };
  }
  return null;
};
