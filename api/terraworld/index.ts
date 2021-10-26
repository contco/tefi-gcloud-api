import { ApolloServer, gql } from "apollo-server-cloud-functions";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { getTWDAccount } from "./lib";

const typeDefs = gql`
  type TWDHolding {
    symbol: String!
    name: String!
    balance: String!
    value: String!
    price: String!
    contract: String!
  }

  type TWDGov {
    name: String!
    symbol: String!
    staked: String!
    value: String!
    rewards: String!
    rewardsValue: String!
    apy: String!
    price: String!
  }

  type TWDPool {
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

  type TWDAccount {
    twdHoldings: TWDHolding
    twdGov: TWDGov
    twdPool: TWDPool
  }

  extend type Assets @key(fields: "address") {
    address: String! @external
    terraworld: TWDAccount
  }
`;

const resolvers = {
  Assets: {
    terraworld(assets) {
      return getTWDAccount(assets.address);
    },
  },
};

const apolloServer = new ApolloServer({
  schema: buildSubgraphSchema([{ typeDefs, resolvers }]),
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apolloServer.createHandler();
