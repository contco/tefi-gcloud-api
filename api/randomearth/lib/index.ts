import { getRandomEarthNfts } from "./getRandomEarthNfts";

export const getRandomEarthAccount = async (address: string) => {
  try {
    const nfts = await getRandomEarthNfts(address);
    return { nfts };
  } catch (err) {
    return { nfts: [] };
  }
};
