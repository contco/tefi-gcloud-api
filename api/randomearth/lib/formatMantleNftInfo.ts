import { CollectionInfo } from "./collectionInfo";
import { getIpfsImageUrl } from "./getIpfsImageUrl";
import { MantleNftInfoResult } from "./type";
import { MantleData, NftInfo } from "../../knowhere/lib/type";

const MARKETPLACE = "RandomEarth";

export const getNftId = (idInfo: string) => {
  const id = idInfo.slice(3, idInfo.length - 1);
  return id;
};

export const formatMantleNftInfo = async (
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
            image: getIpfsImageUrl(result?.extension?.image),
            attributes: result?.extension?.attributes,
            nftContract: mantleNftInfo.nftContract,
            collectionName: CollectionInfo[mantleNftInfo.nftContract].name,
            symbol: CollectionInfo[mantleNftInfo.nftContract].symbol,
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
