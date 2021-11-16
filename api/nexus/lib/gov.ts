import { wasmStoreRequest, math, MICRO } from "@contco/terra-utilities";
import { NEXUS_CONTRACTS, NEXUS_GRAPH_API } from "./constants";
import { request, gql } from "graphql-request";

const NAME = "Nexus Gov";
const SYMBOL = "PSI";

const GOV_APR_QUERY = gql`
  query getGovApr {
    getGovStakingAprRecords(limit: 1, offset: 0) {
      date
      govStakingApr
    }
  }
`;

const fetchGovApr = async () => {
  try {
    const result = await request(NEXUS_GRAPH_API, GOV_APR_QUERY);
    return result;
  } catch (err) {
    return { getGovStakingAprRecords: [{ govStakingApr: 0 }] };
  }
};

export const fetchGovState = async (address: string) => {
  const [userGov, govApr] = await Promise.all([
    wasmStoreRequest(NEXUS_CONTRACTS.nexusGov, { staker: { address } }),
    fetchGovApr(),
  ]);
  return { userGov, govApr };
};

export const getNexusGov = (govState: any, nexusPrice: string) => {
  const { userGov, govApr } = govState;
  if (userGov?.balance && userGov?.balance !== "0") {
    const staked = math.div(userGov?.balance, MICRO.toString());
    const value = math.times(staked, nexusPrice);
    const apr = govApr?.getGovStakingAprRecords[0]?.govStakingApr ?? 0;
    return {
      name: NAME,
      symbol: SYMBOL,
      staked,
      value,
      apr: apr.toString(),
      rewards: "Automatically re-staked",
      price: nexusPrice,
    };
  }
  return null;
};
