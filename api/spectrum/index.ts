import { ApolloServer, gql } from "apollo-server-cloud-functions";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { getSpectrumAccount } from "./lib";

const typeDefs = gql`
  type SpecHoldings {
    name: String!
    symbol: String!
    balance: String!
    value: String!
    price: String!
    contract: String!
  }

  type SpecFarms {
    symbol: String!
    lpName: String!
    stakedLp: String!
    stakedLpUstValue: String!
    tokenStaked: String!
    ustStaked: String!
    farm: String!
    stakedSpec: String!
    stakedSpecValue: String!
    tokenRewardsStakedSymbol: String!
    tokenRewardsStaked: String!
    tokenRewardsStakedValue: String!
    apy: String!
  }

  type SpecGov {
    name: String!
    symbol: String!
    staked: String!
    value: String!
    rewards: String!
    price: String!
    apr: String!
  }

  type SpectrumTotal {
    farmsTotal: String!
    holdingsTotal: String!
    rewardsTotal: String!
  }

  type SpectrumAccount {
    farms: [SpecFarms!]
    specHoldings: [SpecHoldings!]
    specGov: SpecGov
    spectrumTotal: SpectrumTotal
  }

  extend type Assets @key(fields: "address") {
    address: String! @external
    spectrum: SpectrumAccount
  }
`;

const resolvers = {
  Assets: {
    spectrum(assets) {
      return getSpectrumAccount(assets.address);
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
