import { ApolloServer, gql } from 'apollo-server-cloud-functions';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { getApolloDaoAccount } from './lib';

const typeDefs = gql`
  type ApolloVaults {
    symbol1: String!
    symbol2: String!
    lpName: String!
    stakedLp: String!
    stakedLpUstValue: String!
    token1Staked: String!
    token2Staked: String!
  }

  type ApolloDaoAccount {
    vaults: [ApolloVaults!]
    total: String!
  }

  extend type Assets @key(fields: "address") {
    address: String! @external
    apolloDao: ApolloDaoAccount
  }
`;

const resolvers = {
  Assets: {
    apolloDao(assets) {
      return getApolloDaoAccount(assets.address);
    },
  },
};


const apolloServer = new ApolloServer({ schema: buildSubgraphSchema([{ typeDefs, resolvers }]) });

export const config = {
    api: {
        bodyParser: false,
    },
}

export default apolloServer.createHandler()