import { gql } from "graphql-request";

export const generateMantleQueryFromBatches = (
  nftContractsBatches: any,
  address: string
) => {
  const mantleQueriesList = nftContractsBatches.map((nftContractList: any) => {
    const queryObject = nftContractList.reduce(
      (queryObject, contractInfo: any, index) => {
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
  });
  return mantleQueriesList;
};
