import { ApolloServer, gql } from 'apollo-server-cloud-functions';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { getTFlokiAccount } from './lib';

const typeDefs = gql`

type TFlokiHolding {
    symbol: String!
    name: String!
    balance: String!
    value: String!
    price: String!
    contract: String!
  }

  type FlokiPool {
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

  type TFlokiAccount {
    tflokiHoldings: TFlokiHolding
    flokiPool: FlokiPool
  }

  extend type Assets @key(fields: "address") {
    address: String! @external
    tfloki: TFlokiAccount
  }
`;

const resolvers = {
  Assets: {
    tfloki(assets) {
      return getTFlokiAccount(assets.address);
    },
  },
};

const apolloServer = new ApolloServer({ schema: buildSubgraphSchema([{ typeDefs, resolvers }]) });

export default apolloServer.createHandler()