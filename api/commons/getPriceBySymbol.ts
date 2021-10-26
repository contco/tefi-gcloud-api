import { fetchData } from "./fetchData";
import { EXTRATERRESTRIAL_URl } from "../constants";

export const getPriceBySymbol = async (symbol) => {
  if (symbol) {
    const pricesRequest: any = await fetchData(EXTRATERRESTRIAL_URl);
    const tokenPrice = pricesRequest.data.prices[symbol].price;
    if (tokenPrice) {
      return tokenPrice;
    }
  }
  return 0;
};
