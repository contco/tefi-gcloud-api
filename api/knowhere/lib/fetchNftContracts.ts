import axios from "axios";
import { KNOWHERE_API } from "./constant";
import { Collection } from "./type";

const MAX_RESULT = 30;

interface ResponseData {
  nodes: Collection[];
  hasNextPage: boolean;
}

interface CollectionResponse {
  data: ResponseData;
}

export const fetchNftContracts = async () => {
  let offset = 0;
  let fetchMore = true;
  const nftContractsBatches: Collection[][] = [];
  while (fetchMore) {
    const result: CollectionResponse = await axios.get(
      KNOWHERE_API + "/collections",
      {
        params: { offset, limit: MAX_RESULT },
      }
    );
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
