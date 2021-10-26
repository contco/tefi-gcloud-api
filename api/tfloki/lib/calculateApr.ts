import axios from "axios";
import { TFLOKI_API } from "./constants";

export const fetchPoolApr = async () => {
  try {
    const { data }: any = await axios.get(TFLOKI_API + "apr/lpstaking");
    const apr = data ? (data / 100).toString() : "0";
    return apr;
  } catch (err) {
    return "0";
  }
};
