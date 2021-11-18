import axios from "axios";
import { KNOWHERE_API } from "./constant";

export const fetchNftInfo = async (nftTokenList: any) => {
  const nftInfoPromise = nftTokenList.map(async (nftToken: any) => {
    const result: any = await axios.post(`${KNOWHERE_API}/collections/nfts`, {
      nftContract: nftToken.nftContract,
      tokenIds: nftToken.tokens,
    });
    return result.data;
  });
  const nftInfo: any = await Promise.all(nftInfoPromise);
  return nftInfo;
};
