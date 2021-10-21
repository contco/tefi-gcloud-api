import { FCD_URL } from "@contco/terra-utilities";
import axios from 'axios';
import { UUSD_DENOM } from "../constants";

export const getPriceFromFCD = async (denom: string) => {
    try {
      const priceList: any = await axios.get(FCD_URL + `v1/market/swaprate/${denom}`);
      const ussdPrice = priceList?.data.find((price) => price.denom === UUSD_DENOM);
      return ussdPrice.swaprate;
    } catch (err) {
      return '0';
    }
  };
  