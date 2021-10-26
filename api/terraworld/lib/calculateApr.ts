import { UUSD_DENOM, math } from "@contco/terra-utilities";

export const getTwdLpApr = (
  height: number,
  twdPoolResponse: any,
  stakingState: any,
  stakingConfig: any,
  twdPrice: string
) => {
  const twdPoolUSTAmount =
    twdPoolResponse.assets[1]?.info?.native_token?.["denom"] === UUSD_DENOM
      ? twdPoolResponse.assets[1].amount
      : twdPoolResponse.assets[0].amount;
  const current_distribution_schedule = (
    stakingConfig.distribution_schedule as []
  ).find((obj) => height >= +obj[0] && height <= +obj[1]);
  const totalMint = +current_distribution_schedule[2];
  const c = math.div(
    math.times(twdPoolUSTAmount, 2),
    twdPoolResponse.total_share
  );
  const s = math.times(stakingState.total_bond_amount, c);
  const apr = math.div(math.times(totalMint, twdPrice), s);
  return apr;
};

export const calculateTwdGovApy = (
  height: number,
  govState: any,
  govConfig: any
) => {
  try {
    const current_distribution_schedule = (
      govConfig.distribution_schedule as []
    ).find((obj) => +height >= +obj[0] && +height <= +obj[1]);
    const totalMint = +current_distribution_schedule[2];
    const apr = math.div(totalMint, govState.total_bond_amount);
    const apy = ((+apr / 365 + 1) ** 365 - 1) * 100;
    return apy.toString();
  } catch (err) {
    return "0";
  }
};
