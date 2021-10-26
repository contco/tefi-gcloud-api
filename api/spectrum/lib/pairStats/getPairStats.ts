import {getAnchorPairStatsData} from './anchorPairStats';
import { getMirrorPairStatsData } from './mirrorPairStats';
import { getPylonPairStatsData } from './pylonPairStats';
import { getTwdPairStatsData } from './twdPairStats';
import { contracts } from '../contracts';

export const getPairStatsData = async (height: string, poolResponses: any) => {
  const anchorDataPromise = getAnchorPairStatsData(height);
  const mirrorDataPromise = getMirrorPairStatsData();
  const pylonDataPromise = getPylonPairStatsData(height);
  const twdDataPromise = getTwdPairStatsData(height, poolResponses[contracts.terraworldToken]);

  const [anchorPairStatsData, mirrorPairStatsData, pylonPairStatsData, twdPairStatsData] = await Promise.all([anchorDataPromise, mirrorDataPromise, pylonDataPromise, twdDataPromise]);
  const result = {anchorPairStatsData, mirrorPairStatsData, pylonPairStatsData, twdPairStatsData};
  return result;
}