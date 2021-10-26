import { ApolloServer } from "apollo-server";
import {
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginInlineTrace,
} from "apollo-server-core";
import { ApolloGateway } from "@apollo/gateway";
import { readFileSync } from "fs";

const supergraphSdl = readFileSync("./supergraph.graphql").toString();

const gateway = new ApolloGateway({
  supergraphSdl,
});

const apolloServer = new ApolloServer({
  gateway,
  introspection: true,
  plugins: [
    ApolloServerPluginLandingPageGraphQLPlayground,
    ApolloServerPluginInlineTrace,
  ],
});

apolloServer
  .listen(8080)
  .then(({ url }) => {
    console.log(`🚀 Tefi Gateway ready at ${url}`);
  })
  .catch((err) => {
    console.error(err);
  });
