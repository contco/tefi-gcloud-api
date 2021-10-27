import { math, UUSD_DENOM } from "@contco/terra-utilities";
export const calculateApr = (
  poolResponse: any,
  stakingState: any,
  stakingConfig: any,
  nexusPrice: string
) => {
  const nexusPoolUSTAmount =
    poolResponse.assets[1]?.info?.native_token?.["denom"] === UUSD_DENOM
      ? poolResponse.assets[1].amount
      : poolResponse.assets[0].amount;
  const current_time = Math.round(new Date().getTime() / 1000);
  const current_distribution_schedule =
    stakingConfig.distribution_schedule.find(
      (obj: any) =>
        current_time >= obj?.start_time && current_time <= obj?.end_time
    );
  const totalMint = +current_distribution_schedule?.amount;
  const c = math.div(
    math.times(nexusPoolUSTAmount, 2),
    poolResponse.total_share
  );
  const s = math.times(stakingState.total_bond_amount, c);
  const apr = math.div(math.times(totalMint, nexusPrice), s);
  return apr;
};
