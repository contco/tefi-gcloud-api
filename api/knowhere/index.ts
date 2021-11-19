import { ApolloServer, gql } from "apollo-server-cloud-functions";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { getKnowhereAccount } from "./lib";

const typeDefs = gql`
  type NftAttributes {
    display_type: String
    trait_type: String
    value: String
  }

  type KnowhereNft {
    tokenId: String
    nftContract: String
    name: String
    description: String
    image: String
    collectionName: String
    marketplace: String
    attributes: [NftAttributes]
  }

  type KnowhereAccount {
    nfts: [KnowhereNft]
  }

  extend type Assets @key(fields: "address") {
    address: String! @external
    knowhere: KnowhereAccount
  }
`;

const resolvers = {
  Assets: {
    knowhere(assets) {
      return getKnowhereAccount(assets.address);
    },
  },
};

const apolloServer = new ApolloServer({
  schema: buildSubgraphSchema([{ typeDefs, resolvers }]),
});

export default apolloServer.createHandler();
