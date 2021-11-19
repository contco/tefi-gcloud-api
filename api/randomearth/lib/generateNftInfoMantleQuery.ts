import { gql } from "graphql-request";
import { TokensInfo, QueryObject, QueriesInfo } from "../../knowhere/lib/type";

export const generateNftInfoMantleQuery = (tokenInfo: TokensInfo) => {
  const queryObject = tokenInfo.tokens.reduce(
    (queryObject: QueryObject, tokenId: string, index: number) => {
      let variableName = `$nft${tokenId}: String!`;
      if (index !== tokenInfo.tokens.length - 1) {
        variableName = variableName + ",";
      }
      const contractQuery = gql`
               nft${tokenId}: WasmContractsContractAddressStore(ContractAddress: "${tokenInfo.nftContract}", QueryMsg: $nft${tokenId}) {
                      Height
                      Result
                  }
            `;
      queryObject.variableNames = queryObject.variableNames + variableName;
      queryObject.queryStrings = queryObject.queryStrings + contractQuery;
      queryObject.variables = {
        ...queryObject.variables,
        [`nft${tokenId}`]: JSON.stringify({
          nft_info: { token_id: tokenId },
        }),
      };
      return queryObject;
    },
    { variableNames: "", queryStrings: "", variables: {} }
  );

  const queriesInfo: QueriesInfo = {
    query: gql`query(${queryObject.variableNames}) { ${queryObject.queryStrings} }`,
    variables: queryObject.variables,
  };
  return queriesInfo;
};
