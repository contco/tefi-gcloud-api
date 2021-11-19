import { request } from "graphql-request";
import { MANTLE_URL } from "../../constants";
import { generateMantleQueryFromBatches } from "./generateMantleQueryFromBatches";
import {
  Collection,
  MantleResponse,
  MantleData,
  QueriesInfo,
  TokensInfo,
} from "./type";

const formatTokensListFromMantleResponse = (
  mantleResults: MantleResponse[]
) => {
  const tokensList = mantleResults.reduce(
    (tokensList: TokensInfo[], mantleResponse: MantleResponse) => {
      const mantleResultList = Object.values(mantleResponse);
      const nftContractsList = Object.keys(mantleResponse);
      const batchTokenList: TokensInfo[] = mantleResultList.reduce(
        (tokenList: TokensInfo[], mantleResult: MantleData, index) => {
          const parsedResult = JSON.parse(mantleResult.Result);
          if (parsedResult.tokens.length > 0) {
            tokenList.push({
              nftContract: nftContractsList[index],
              tokens: parsedResult.tokens,
            });
          }
          return tokenList;
        },
        []
      );
      return [...tokensList, ...batchTokenList];
    },
    []
  );
  return tokensList;
};

export const fetchUserTokenIdList = async (
  nftContractBatches: Collection[][],
  address: string
) => {
  const mantleQueryList = generateMantleQueryFromBatches(
    nftContractBatches,
    address
  );
  const mantleResultsPromise = mantleQueryList.map(
    async (queryDetails: QueriesInfo) => {
      const result = await request(
        MANTLE_URL,
        queryDetails.query,
        queryDetails.variables
      );
      return result;
    }
  );
  const mantleResults: MantleResponse[] = await Promise.all(
    mantleResultsPromise
  );
  const userNftTokensList = formatTokensListFromMantleResponse(mantleResults);
  return userNftTokensList;
};
