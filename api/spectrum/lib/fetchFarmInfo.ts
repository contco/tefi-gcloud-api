import axios from "axios";
import { LCD_URL } from "@contco/terra-utilities";

export const fetchSpecFarmInfo = async (pool_addr: string) => {
  const { data }: any = await axios.get(
    LCD_URL + `wasm/contracts/${pool_addr}/store`,
    {
      params: {
        query_msg: JSON.stringify({
          pools: {},
        }),
      },
    }
  );

  return data?.result;
};
