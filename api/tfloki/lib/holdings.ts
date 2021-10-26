import { wasmStoreRequest, math, MICRO } from "@contco/terra-utilities";
import { TFLOKI_CONTRACTS } from "./contracts";

const SYMBOL = "TFLOKI";
const NAME = "Terra Floki";

export const fetchHoldings = (address: string) => {
  const query_msg = {
    balance: {
      address,
    },
  };
  const result = wasmStoreRequest(TFLOKI_CONTRACTS.token, query_msg);
  return result;
};

export const getHoldings = (holdingInfo: any, tflokiPrice: string) => {
  if (holdingInfo?.balance && holdingInfo?.balance !== "0") {
    const balance = math.div(holdingInfo.balance, MICRO);
    const value = math.times(balance, tflokiPrice);
    const contract = TFLOKI_CONTRACTS.token;
    return {
      name: NAME,
      symbol: SYMBOL,
      balance,
      value,
      contract,
      price: tflokiPrice,
    };
  }
  return null;
};
