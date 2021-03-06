import { request, gql } from "graphql-request";
import { networks } from "@contco/terra-utilities";

const STATS_NETWORK = "Terra";

const ASSETSTATS = gql`
  query assets($network: Network) {
    assets {
      token
      description
      statistic {
        liquidity(network: $network)
        volume(network: $network)
        apr {
          long
          short
        }
      }
    }
    statistic {
      govAPR
      mirPrice
    }
  }
`;

export const getAssetsStats = async () => {
  try {
    const variables = { network: STATS_NETWORK.toUpperCase() };
    const result = await request(networks.mainnet.stats, ASSETSTATS, variables);
    const apr = result.assets.reduce((acc: any, { token, statistic }) => {
      return { ...acc, [token]: statistic.apr.long };
    }, {});
    const shortApr = result.assets.reduce((acc: any, { token, statistic }) => {
      return { ...acc, [token]: statistic.apr.short };
    }, {});

    return { apr, shortApr, statistic: result?.statistic };
  } catch (err) {
    return null;
  }
};
