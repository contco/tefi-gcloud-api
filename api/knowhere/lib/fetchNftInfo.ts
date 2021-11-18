import axios from "axios";
import { KNOWHERE_API } from "./constant";
import { KnowhereNftInfo, TokensInfo } from "./type";

interface FetchNftInfoResponse {
  data?: KnowhereNftInfo[];
}

export const fetchNftInfo = async (nftTokenList: TokensInfo[]) => {
  const nftInfoPromise = nftTokenList.map(async (nftToken: TokensInfo) => {
    const result: FetchNftInfoResponse = await axios.post(
      `${KNOWHERE_API}/collections/nfts`,
      {
        nftContract: nftToken.nftContract,
        tokenIds: nftToken.tokens,
      }
    );
    return result.data;
  });
  const [nftInfoList]: KnowhereNftInfo[][] = await Promise.all(nftInfoPromise);
  return nftInfoList;
};
