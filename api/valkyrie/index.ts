import { ApolloServer, gql } from "apollo-server-cloud-functions";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { getValkyrieAccount } from "./lib";

const typeDefs = gql`
  type ValkyrieHolding {
    symbol: String!
    name: String!
    balance: String!
    value: String!
    price: String!
    contract: String!
  }

  type ValkyriePool {
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
    rewards: String!
    rewardsValue: String!
    rewardsSymbol: String!
    apr: String!
  }

  type ValkyrieGov {
    name: String!
    symbol: String!
    staked: String!
    value: String!
    rewards: String!
    price: String!
    apr: String!
  }

  type ValkyrieAccount {
    vkrHoldings: ValkyrieHolding
    vkrPool: ValkyriePool
    vkrGov: ValkyrieGov
  }

  extend type Assets @key(fields: "address") {
    address: String! @external
    valkyrie: ValkyrieAccount
  }
`;

const resolvers = {
  Assets: {
    valkyrie(assets) {
      return getValkyrieAccount(assets.address);
    },
  },
};

const apolloServer = new ApolloServer({
  schema: buildSubgraphSchema([{ typeDefs, resolvers }]),
});

export default apolloServer.createHandler();
