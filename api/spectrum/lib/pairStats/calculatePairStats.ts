import { calculateMirrorPairStats } from "./mirrorPairStats";
import { calculateSpecPairStats } from "./specPairStats";
import { calculatePylonPairStats } from "./pylonPairStats";
import { calculateAnchorPairStats } from "./anchorPairStats";
import { calculateTwdPairStats } from "./twdPairStats";
import { calculateVkrPairStats } from "./vkrPairStats";
import { calculateNexusPairStats } from "./nexusPairStats";

export const calculatePairStats = (
  pairStatsData,
  mirrorPoolInfo,
  specPoolInfo,
  pylonPoolInfo,
  anchorPoolInfo,
  govConfig,
  govVaults,
  terraSwapPoolResponses,
  twdPoolInfo,
  vkrPoolInfo,
  nexusPoolInfo
) => {
  const {
    anchorPairStatsData,
    mirrorPairStatsData,
    pylonPairStatsData,
    twdPairStatsData,
    vkrPairStatsData,
    nexusPairStatsData,
  } = pairStatsData;

  const mirrorStats = calculateMirrorPairStats(
    mirrorPairStatsData,
    mirrorPoolInfo,
    govConfig,
    govVaults,
    terraSwapPoolResponses
  );
  const specStats = calculateSpecPairStats(
    specPoolInfo,
    govVaults,
    terraSwapPoolResponses
  );
  const pylonStats = calculatePylonPairStats(
    pylonPairStatsData,
    pylonPoolInfo,
    govVaults,
    govConfig,
    terraSwapPoolResponses
  );
  const anchorStats = calculateAnchorPairStats(
    anchorPairStatsData,
    anchorPoolInfo,
    govVaults,
    govConfig,
    terraSwapPoolResponses
  );
  const twdStats = calculateTwdPairStats(
    twdPairStatsData,
    twdPoolInfo,
    govVaults,
    terraSwapPoolResponses
  );

  const vkrStats = calculateVkrPairStats(
    vkrPairStatsData,
    vkrPoolInfo,
    govVaults,
    terraSwapPoolResponses
  );

  const nexusStats = calculateNexusPairStats(
    nexusPairStatsData,
    nexusPoolInfo,
    govVaults,
    govConfig,
    terraSwapPoolResponses
  );

  return {
    ...mirrorStats,
    ...specStats,
    ...pylonStats,
    ...anchorStats,
    ...twdStats,
    ...vkrStats,
    ...nexusStats,
  };
};
