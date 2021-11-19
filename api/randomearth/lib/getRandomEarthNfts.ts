import CollectionBatches from "./collections.json";
import { fetchUserTokenIdList } from "../../knowhere/lib/fetchUserTokenIdList";
import { fetchNftInfo } from "./fetchNftInfo";
import { formatMantleNftInfo } from "./formatMantleNftInfo";

export const getRandomEarthNfts = async (address: string) => {
  const nftTokenIds = await fetchUserTokenIdList(CollectionBatches, address);
  const mantleNftInfoList = await fetchNftInfo(nftTokenIds);
  const nftInfo = formatMantleNftInfo(mantleNftInfoList);
  return nftInfo;
};
