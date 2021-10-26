import axios from "axios";
const ANCHOR_API_URL = "https://api.anchorprotocol.com/api/v2/";

export const getAnchorApyStats = async () => {
  try {
    const { data: distributionAPY }: any = await axios.get(
      ANCHOR_API_URL + "distribution-apy"
    );
    const { data: ustLpRewardApy }: any = await axios.get(
      ANCHOR_API_URL + "ust-lp-reward"
    );
    const { data: govRewardApy }: any = await axios.get(
      ANCHOR_API_URL + "gov-reward"
    );
    return {
      distributionAPY: distributionAPY?.distribution_apy,
      lpRewardApy: ustLpRewardApy?.apy,
      govRewardApy: govRewardApy?.current_apy,
    };
  } catch (err) {
    return { distributionAPY: "0", lpRewardApy: "0", govRewardApy: "0" };
  }
};
