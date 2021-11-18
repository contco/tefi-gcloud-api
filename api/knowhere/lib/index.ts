import { fetchNftContracts } from "./fetchNftContracts";
import { fetchUserTokenIdList } from "./fetchUserTokenIdList";
import { fetchNftInfo } from "./fetchNftInfo";

const getKnowhereAccount = async (address: string) => {
  const nftContractsBatches = await fetchNftContracts();
  const userNftTokenIdList = await fetchUserTokenIdList(
    nftContractsBatches,
    address
  );
  const nftInfo = await fetchNftInfo(userNftTokenIdList);
  console.log(nftInfo);
};
getKnowhereAccount("terra18jg24fpqvjntm2wfc0p47skqccdr9ldtgl5ac9");
