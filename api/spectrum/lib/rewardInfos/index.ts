import {wasmStoreRequest } from "@contco/terra-utilities";
import { contracts } from "../contracts";

const rewardInfoRequest = async (address: string, contract: string) => {
  const result = await wasmStoreRequest(contract, {reward_info: { staker_addr: address }});
  return result?.reward_infos;
}

const formatRewardInfos = (rewards) => {
  const rewards_infos = {};
  rewards.forEach((item) => {
   rewards_infos[item?.asset_token] = item;
  });
  return rewards_infos;
}

const fetchRewardInfos = async (address) => {
  const mirrorRewardsInfoRequest = rewardInfoRequest(address, contracts.mirrorFarm);
  const specRewardInfosRequest = rewardInfoRequest(address, contracts.specFarm);
  const pylonRewardInfosRequest = rewardInfoRequest(address, contracts.pylonFarm);
  const anchorRewardInfosRequest = rewardInfoRequest(address, contracts.anchorFarm);
  const result = await Promise.all([mirrorRewardsInfoRequest, specRewardInfosRequest, pylonRewardInfosRequest, anchorRewardInfosRequest]);
  return result;
}


export const getRewardInfos = async (address: string) => {
  const [mirrorRewardInfos, specRewardInfos, pylonRewardInfos, anchorRewardInfos] = await fetchRewardInfos(address);
  const rewardInfos = formatRewardInfos([...mirrorRewardInfos, ...specRewardInfos, ...pylonRewardInfos, ...anchorRewardInfos]);
  return rewardInfos;
};