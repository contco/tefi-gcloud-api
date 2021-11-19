import { KnowhereNftInfo, NftInfo } from "./type";

const MARKETPLACE = "knowhere";

export const formatNftData = (nftInfoList: KnowhereNftInfo[]) => {
  const nftData: NftInfo[] = nftInfoList.map((nftInfo: KnowhereNftInfo) => {
    return {
      tokenId: nftInfo?.tokenId,
      nftContract: nftInfo?.nftContract,
      name: nftInfo?.name,
      description: nftInfo?.description,
      image: nftInfo?.images?.original,
      collectionName: nftInfo?.collection.name,
      marketplace: MARKETPLACE,
      attributes: nftInfo?.attributes,
    };
  });
  return nftData;
};
