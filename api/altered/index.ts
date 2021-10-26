import { ApolloServer, gql } from "apollo-server-cloud-functions";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { getAlteredAccount } from "./lib";

const typeDefs = gql`
  type AltePool {
    symbol1: String!
    symbol2: String!
    lpName: String!
    price: String!
    stakedLp: String!
    stakedLpUstValue: String!
    stakeableLp: String!
    stakeableLpUstValue: String!
    token1UnStaked: String!
    token1Staked: String!
    token2UnStaked: String!
    token2Staked: String!
    totalLpUstValue: String!
    totalStaked: String!
    rewards: String!
    rewardsValue: String!
    rewardsSymbol: String!
    apr: String!
  }

  type AlteredAccount {
    altePool: AltePool
  }

  extend type Assets @key(fields: "address") {
    address: String! @external
    altered: AlteredAccount
  }
`;

const resolvers = {
  Assets: {
    altered(assets) {
      return getAlteredAccount(assets.address);
    },
  },
};

const apolloServer = new ApolloServer({
  schema: buildSubgraphSchema([{ typeDefs, resolvers }]),
});

export default apolloServer.createHandler();
