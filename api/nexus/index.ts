import { ApolloServer, gql } from "apollo-server-cloud-functions";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { getNexusAccount } from "./lib";

const typeDefs = gql`
  type NexusHolding {
    symbol: String!
    name: String!
    balance: String!
    value: String!
    price: String!
    contract: String!
  }

  type NexusPool {
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

  type NexusAccount {
    nexusHoldings: NexusHolding
    nexusPool: NexusPool
  }

  extend type Assets @key(fields: "address") {
    address: String! @external
    nexus: NexusAccount
  }
`;

const resolvers = {
  Assets: {
    nexus(assets) {
      return getNexusAccount(assets.address);
    },
  },
};

const apolloServer = new ApolloServer({
  schema: buildSubgraphSchema([{ typeDefs, resolvers }]),
});

export default apolloServer.createHandler();
