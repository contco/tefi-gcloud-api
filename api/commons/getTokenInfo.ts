import axios from 'axios';
import { LCD_URL } from '@contco/terra-utilities';

export const getTokenInfo = async (token) => {
    const result: any = await axios.get(LCD_URL + `wasm/contracts/${token}/store`, {
      params: {
        query_msg: JSON.stringify({
          token_info: {}
        })
      },
    });
    return result?.data?.result
  }