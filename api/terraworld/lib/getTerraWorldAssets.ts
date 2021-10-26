import {
  getPoolInfo,
  wasmStoreRequest,
  getLatestBlockHeight,
} from "@contco/terra-utilities";
import { contracts } from "./contracts";
import { getLpStakingInfo } from "./getLpStaking";
import { getGovInfo } from "./getGovInfo";
import { getWalletHoldings } from "./getWalletHoldings";

export const getTerraWorldAssets = async (address: string) => {
  try {
    const blockRequest = await getLatestBlockHeight();
    const blockHeight = parseFloat(blockRequest);

    const balanceMsg = {
      balance: {
        address: address,
      },
    };

    const stakerInfo = {
      staker_info: {
        staker: address,
        block_height: blockHeight,
      },
    };

    const poolInfoRequest = getPoolInfo(contracts.pool);
    const stakingLpRequest = wasmStoreRequest(
      contracts.twdPoolStakingContract,
      stakerInfo
    );
    const stakingStateRequest = wasmStoreRequest(
      contracts.twdPoolStakingContract,
      { state: {} }
    );
    const stakingConfigRequest = wasmStoreRequest(
      contracts.twdPoolStakingContract,
      { config: {} }
    );
    const poolLpRequest = wasmStoreRequest(contracts.staking, balanceMsg);
    const stakingGovRequest = wasmStoreRequest(
      contracts.twdGovStakingContract,
      stakerInfo
    );
    const govStateRequest = wasmStoreRequest(contracts.twdGovStakingContract, {
      state: {},
    });
    const govConfigRequest = wasmStoreRequest(contracts.twdGovStakingContract, {
      config: {},
    });
    const twdHoldingsRequest = wasmStoreRequest(contracts.token, balanceMsg);

    const [
      poolInfo,
      stakingLpInfo,
      stakingGovInfo,
      poolLpBalance,
      twdHoldingsInfo,
      stakingLpState,
      stakingLpConfig,
      govState,
      govConfig,
    ] = await Promise.all([
      poolInfoRequest,
      stakingLpRequest,
      stakingGovRequest,
      poolLpRequest,
      twdHoldingsRequest,
      stakingStateRequest,
      stakingConfigRequest,
      govStateRequest,
      govConfigRequest,
    ]);
    const twdPool = getLpStakingInfo(
      poolInfo,
      stakingLpInfo,
      poolLpBalance,
      stakingLpState,
      stakingLpConfig,
      blockHeight
    );
    const twdGov = getGovInfo(
      poolInfo,
      stakingGovInfo,
      govState,
      govConfig,
      blockHeight
    );
    const twdHoldings = getWalletHoldings(poolInfo, twdHoldingsInfo);
    return { twdHoldings, twdPool, twdGov };
  } catch (err) {
    return null;
  }
};
