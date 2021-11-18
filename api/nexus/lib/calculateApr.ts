import { MICRO, UUSD_DENOM } from "@contco/terra-utilities";

export const calculateApr = (
  poolResponse: any,
  stakingState: any,
  stakingConfig: any,
  nexusPrice: string,
  isUstPair = true
) => {
  const nexusPoolUSTAmount = !isUstPair
    ? poolResponse.assets[1].amount * parseFloat(nexusPrice)
    : poolResponse.assets[1]?.info?.native_token?.["denom"] === UUSD_DENOM
    ? poolResponse.assets[1].amount
    : poolResponse.assets[0].amount;
  const current_time = Math.round(new Date().getTime() / 1000);
  const current_distribution_schedule =
    stakingConfig.distribution_schedule.find(
      (obj: any) =>
        current_time >= obj?.start_time && current_time <= obj?.end_time
    );
  const totalMint = +current_distribution_schedule?.amount;
  const distributionPerSecond =
    totalMint /
    (current_distribution_schedule.end_time -
      current_distribution_schedule.start_time) /
    MICRO;
  const seconds_per_year = 60 * 60 * 24 * 365;
  const poolUstValue = (nexusPoolUSTAmount * 2) / MICRO;
  const stakedLpRatio =
    stakingState.total_bond_amount / poolResponse.total_share;
  const apr = (
    ((parseFloat(nexusPrice) * distributionPerSecond * seconds_per_year) /
      poolUstValue) *
    stakedLpRatio
  ).toString();
  return apr;
};
