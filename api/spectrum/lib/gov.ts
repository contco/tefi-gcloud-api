import axios from "axios";
import { LCD_URL } from "@contco/terra-utilities";
import { contracts } from "./contracts";


export const getGovConfig = async () => {
    const {data: govConfig} : any =  await axios.get(LCD_URL + `wasm/contracts/${contracts.gov}/store`, {
        params: {
          query_msg: JSON.stringify({
            config: {}
          })
       },
    });
   return govConfig?.result;
}

export const getGovVaults = async () => {
    const {data: govVaults} : any =  await axios.get(LCD_URL + `wasm/contracts/${contracts.gov}/store`, {
        params: {
          query_msg: JSON.stringify({
            vaults: {}
          })
       },
    });
   return govVaults?.result;
}

export const getGovState = async (height) => {
   const {data: govState} : any =  await axios.get(LCD_URL + `wasm/contracts/${contracts.gov}/store?query_msg=%7B%22state%22:%7B%22height%22:${height}%7D%7D`);
   return govState?.result;
}