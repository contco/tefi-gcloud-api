import { getAnchorPairStatsData } from "./anchorPairStats";
import { getMirrorPairStatsData } from "./mirrorPairStats";
import { getPylonPairStatsData } from "./pylonPairStats";
import { getTwdPairStatsData } from "./twdPairStats";
import { getVkrPairStatsData } from "./vkrPairStats";
import { getNexusPairStatsData } from "./nexusPairStats";
import { contracts } from "../contracts";

export const getPairStatsData = async (height: string, poolResponses: any) => {
  const [
    anchorPairStatsData,
    mirrorPairStatsData,
    pylonPairStatsData,
    twdPairStatsData,
    vkrPairStatsData,
    nexusPairStatsData,
  ] = await Promise.all([
    getAnchorPairStatsData(height),
    getMirrorPairStatsData(),
    getPylonPairStatsData(height),
    getTwdPairStatsData(height, poolResponses[contracts.terraworldToken]),
    getVkrPairStatsData(height),
    getNexusPairStatsData(height, poolResponses[contracts.nexusToken]),
  ]);

  const result = {
    anchorPairStatsData,
    mirrorPairStatsData,
    pylonPairStatsData,
    twdPairStatsData,
    vkrPairStatsData,
    nexusPairStatsData,
  };
  return result;
};
