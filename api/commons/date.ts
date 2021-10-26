import { addMinutes, format as formatting } from "date-fns";
export const FMT = { HHmm: "EEE, LLL dd, HH:mm aa", MMdd: "LLL dd, yyyy" };

export const getUTCDate = () => {
  const offset = new Date().getTimezoneOffset();
  const utc = addMinutes(new Date(), offset);
  return formatting(utc, "MMM d");
};

export const isPast = (second: number) => second * 1000 < Date.now();
export const isFuture = (second: number) => Date.now() < second * 1000;
export const secondsToDate = (second?: number) =>
  second ? formatting(new Date(second * 1000), FMT.HHmm) : "";

export const date = {
  getUTCDate,
  isPast,
  isFuture,
  secondsToDate,
  FMT,
};
