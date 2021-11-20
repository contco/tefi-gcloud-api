import { wasmStoreRequest } from "@contco/terra-utilities";
import { TokensInfo } from "../../knowhere/lib/type";
import { fetchNftInfo } from "../../randomearth/lib/fetchNftInfo";
import { getNftId } from "../../randomearth/lib/formatMantleNftInfo";
import { NFTCollections, CollectionsByContract } from "./constants";

import { NFTCollection } from "./type";
import { MantleNftInfoResult } from "../../randomearth/lib/type";
import { MantleData, NftInfo } from "../../knowhere/lib/type";

const LIMIT = 1000;
const MARKETPLACE = "TerraFloki";

export const getTflokiImageUrl = (token_uri: string) => {
  const imageUrl = "https://terrafloki.io/flokis/" + token_uri + ".gif";
  return imageUrl;
};

export const formatMantleNftInfo = (
  mantleNftInfoList: MantleNftInfoResult[]
) => {
  const nftData = mantleNftInfoList.reduce(
    (nftData: NftInfo[], mantleNftInfo: MantleNftInfoResult) => {
      const nftIds = Object.keys(mantleNftInfo.result);
      const nftResult = Object.values(mantleNftInfo.result);
      const formatNftInfo = nftResult.map(
        (nftResult: MantleData, index: number) => {
          const result = JSON.parse(nftResult.Result);
          return {
            tokenId: getNftId(nftIds[index]),
            description: result?.extension?.description,
            name: result?.extension?.name,
            image: getTflokiImageUrl(result?.token_uri),
            attributes: result?.extension?.attributes,
            nftContract: mantleNftInfo.nftContract,
            collectionName:
              CollectionsByContract[mantleNftInfo.nftContract].name,
            symbol: CollectionsByContract[mantleNftInfo.nftContract].symbol,
            class: result?.extension?.class,
            rarity: result?.extension?.rarity,
            skills: result?.extension?.skills,
            marketplace: MARKETPLACE,
          };
        }
      );
      return [...nftData, ...formatNftInfo];
    },
    []
  );
  return nftData;
};

const getTokensInfo = async (address: string) => {
  const tokenIdsListPromise = NFTCollections.map(
    async (collection: NFTCollection) => {
      const tokens = await wasmStoreRequest(collection.nftContract, {
        tokens: { owner: address, limit: LIMIT },
      });
      return { nftContract: collection.nftContract, ...tokens };
    }
  );
  const tokensInfo: TokensInfo[] = await Promise.all(tokenIdsListPromise);
  return tokensInfo;
};

export const getTFlokiNfts = async (address: string) => {
  try {
    const tokensInfoList = await getTokensInfo(address);
    const nftsInfo = await fetchNftInfo(tokensInfoList);
    const nftInfo = formatMantleNftInfo(nftsInfo);
    return nftInfo;
  } catch (err) {
    return [];
  }
};
