import { MICRO, math, wasmStoreRequest } from "@contco/terra-utilities";
import { VKR_CONTRACTS } from "./contracts";

const SYMBOL = "VKR";
const NAME = "VKR Gov";

export const fetchGov = async (address: string) => {
  const query_msg = {
    staker_state: { address },
  };
  const result = await wasmStoreRequest(VKR_CONTRACTS.govStaking, query_msg);
  return result;
};

export const getGovInfo = (
  vkrPrice: string,
  govStakingInfo: any,
  govApr: string
) => {
  if (govStakingInfo?.balance === "0") {
    return null;
  }

  const staked = math.div(govStakingInfo?.balance, MICRO.toString());
  const value = math.times(staked, vkrPrice);
  return {
    name: NAME,
    symbol: SYMBOL,
    staked,
    value,
    apr: govApr,
    rewards: "Automatically re-staked",
    price: vkrPrice,
  };
};
