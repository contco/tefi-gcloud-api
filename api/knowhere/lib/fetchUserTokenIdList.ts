import { request } from "graphql-request";
import { MANTLE_URL } from "../../constants";
import { generateMantleQueryFromBatches } from "./generateMantleQueryFromBatches";

const formatTokensListFromMantleResponse = (mantleResults: any) => {
  const tokensList = mantleResults.reduce(
    (tokensList: any, mantleResponse: any) => {
      const mantleResultList = Object.values(mantleResponse);
      const nftContractsList = Object.keys(mantleResponse);
      const batchTokenList: any = mantleResultList.reduce(
        (tokenList: any, mantleResult: any, index) => {
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
  nftContractBatches: any,
  address: string
) => {
  const mantleQueryList = generateMantleQueryFromBatches(
    nftContractBatches,
    address
  );
  const mantleResultsPromise = mantleQueryList.map(
    async (queryDetails: any) => {
      const result = await request(
        MANTLE_URL,
        queryDetails.query,
        queryDetails.variables
      );
      return result;
    }
  );
  const mantleResults = await Promise.all(mantleResultsPromise);
  const userNftTokensList = formatTokensListFromMantleResponse(mantleResults);
  return userNftTokensList;
};
