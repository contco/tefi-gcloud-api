import { request } from "graphql-request";
import { MANTLE_URL } from "../../constants";
import { TokensInfo } from "../../knowhere/lib/type";
import { MantleNftInfoResult } from "./type";
import { generateNftInfoMantleQuery } from "./generateNftInfoMantleQuery";

export const fetchNftInfo = async (tokensInfoList: TokensInfo[]) => {
  const nftInfoPromises = tokensInfoList.map(async (tokenInfo: TokensInfo) => {
    const mantleQuery = generateNftInfoMantleQuery(tokenInfo);
    const result = await request(
      MANTLE_URL,
      mantleQuery.query,
      mantleQuery.variables
    );
    return { nftContract: tokenInfo.nftContract, result };
  });

  const mantleNftInfoList: MantleNftInfoResult[] = await Promise.all(
    nftInfoPromises
  );
  return mantleNftInfoList;
};
