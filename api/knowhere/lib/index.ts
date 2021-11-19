import { fetchNftContracts } from "./fetchNftContracts";
import { fetchUserTokenIdList } from "./fetchUserTokenIdList";
import { fetchNftInfo } from "./fetchNftInfo";
import { formatNftData } from "./formatNftData";

export const getKnowhereAccount = async (address: string) => {
  try {
    const nftContractsBatches = await fetchNftContracts();
    const userNftTokenIdList = await fetchUserTokenIdList(
      nftContractsBatches,
      address
    );
    const nftInfo = await fetchNftInfo(userNftTokenIdList);
    const nfts = formatNftData(nftInfo);
    return { nfts };
  } catch (err) {
    return { nfts: [] };
  }
};
