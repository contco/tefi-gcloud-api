import { gql } from "graphql-request";
import { Collection, QueriesInfo, QueryObject } from "./type";

export const generateMantleQueryFromBatches = (
  nftContractsBatches: Collection[][],
  address: string
) => {
  const mantleQueriesList: QueriesInfo[] = nftContractsBatches.map(
    (nftContractList: Collection[]) => {
      const queryObject = nftContractList.reduce(
        (queryObject: QueryObject, contractInfo: Collection, index: number) => {
          let variableName = `$${contractInfo.nftContract}: String!`;
          if (index !== nftContractList.length - 1) {
            variableName = variableName + ",";
          }
          const contractQuery = gql`
               ${contractInfo.nftContract}: WasmContractsContractAddressStore(ContractAddress: "${contractInfo.nftContract}", QueryMsg: $${contractInfo.nftContract}) {
                      Height
                      Result
                  }
            `;
          queryObject.variableNames = queryObject.variableNames + variableName;
          queryObject.queryStrings = queryObject.queryStrings + contractQuery;
          queryObject.variables = {
            ...queryObject.variables,
            [`${contractInfo.nftContract}`]: JSON.stringify({
              tokens: { owner: address },
            }),
          };
          return queryObject;
        },
        { variableNames: "", queryStrings: "", variables: {} }
      );

      return {
        query: gql`query(${queryObject.variableNames}) { ${queryObject.queryStrings} }`,
        variables: queryObject.variables,
      };
    }
  );
  return mantleQueriesList;
};
