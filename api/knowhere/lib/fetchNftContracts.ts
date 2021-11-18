import axios from "axios";
import { KNOWHERE_API } from "./constant";

const MAX_RESULT = 30;

export const fetchNftContracts = async () => {
  let offset = 0;
  let fetchMore = true;
  const nftContractsBatches = [];
  while (fetchMore) {
    const result: any = await axios.get(KNOWHERE_API + "/collections", {
      params: { offset, limit: MAX_RESULT },
    });
    if (result?.data?.nodes) {
      nftContractsBatches.push(result.data.nodes);
    }
    if (!result?.data?.hasNextPage) {
      fetchMore = false;
    } else {
      offset = offset + MAX_RESULT;
    }
  }
  return nftContractsBatches;
};
