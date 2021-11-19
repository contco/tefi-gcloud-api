import { ApolloServer, gql } from "apollo-server-cloud-functions";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { getRandomEarthAccount } from "./lib";

const typeDefs = gql`
  type NftAttributes {
    display_type: String
    trait_type: String
    value: String
  }

  type RandomEarthNft {
    tokenId: String
    nftContract: String
    name: String
    description: String
    image: String
    collectionName: String
    marketplace: String
    symbol: String
    attributes: [NftAttributes]
  }

  type RandomEarthAccount {
    nfts: [RandomEarthNft]
  }

  extend type Assets @key(fields: "address") {
    address: String! @external
    randomearth: RandomEarthAccount
  }
`;

const resolvers = {
  Assets: {
    randomearth(assets) {
      return getRandomEarthAccount(assets.address);
    },
  },
};

const apolloServer = new ApolloServer({
  schema: buildSubgraphSchema([{ typeDefs, resolvers }]),
});

export default apolloServer.createHandler();
