import axios from "axios";
import { VKR_API } from "./constants";

export const fetchPoolApr = async () => {
  try {
    const { data }: any = await axios.get(
      VKR_API + "liquidity-provision/stake/apr"
    );
    const apr = data?.data?.apr ? data.data.apr.toString() : "0";
    return apr;
  } catch (err) {
    return "0";
  }
};

export const fetchGovApr = async () => {
  try {
    const { data }: any = await axios.get(VKR_API + "governance/stake/apr");
    const apr = data?.data?.apr ? (data.data.apr * 100).toString() : "0";
    return apr;
  } catch (err) {
    return "0";
  }
};
