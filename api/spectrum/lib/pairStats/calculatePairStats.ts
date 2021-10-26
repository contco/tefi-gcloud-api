import { calculateMirrorPairStats } from "./mirrorPairStats";
import { calculateSpecPairStats } from "./specPairStats";
import { calculatePylonPairStats } from "./pylonPairStats";
import { calculateAnchorPairStats } from "./anchorPairStats";
import { calculateTwdPairStats } from './twdPairStats';

export const calculatePairStats =  (pairStatsData, mirrorPoolInfo, specPoolInfo, pylonPoolInfo, anchorPoolInfo, govConfig, govVaults, terraSwapPoolResponses, twdPoolInfo) => {
    const {anchorPairStatsData, mirrorPairStatsData, pylonPairStatsData, twdPairStatsData} = pairStatsData;
    const mirrorStats = calculateMirrorPairStats(mirrorPairStatsData, mirrorPoolInfo, govConfig, govVaults, terraSwapPoolResponses);
    const specStats =  calculateSpecPairStats(specPoolInfo, govVaults, terraSwapPoolResponses);
    const pylonStats = calculatePylonPairStats(pylonPairStatsData, pylonPoolInfo, govVaults, govConfig, terraSwapPoolResponses);
    const anchorStats = calculateAnchorPairStats(anchorPairStatsData, anchorPoolInfo, govVaults, govConfig, terraSwapPoolResponses);
    const twdStats = calculateTwdPairStats(twdPairStatsData, twdPoolInfo, govVaults, govConfig, terraSwapPoolResponses);
    return {...mirrorStats, ...specStats, ...pylonStats, ...anchorStats, ...twdStats};
}