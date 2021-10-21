import axios from "axios"
import fetch from 'node-fetch';

import { MANTLE_URL } from "../../constants";

export const getLastSyncedHeight = async () => {
  try {
    const LAST_SYNCED_HEIGHT_QUERY = `
      query {
        LastSyncedHeight
      }
    `;
    const payload = {query: LAST_SYNCED_HEIGHT_QUERY, variables: {} };
    const {data}: any = await axios.post(MANTLE_URL + "?last-synced-height", payload);
    return data?.data?.LastSyncedHeight;
  }
  catch(err) {
    throw new Error("Error fetching last synced height");
  }
}

export const mantleFetch : any = async (
  query: string,
  variables: any,
  endpoint: string,
  requestInit?: any,
) => {
  const {data: result} = await axios.post(endpoint, {query, variables});
  const {data, errors}: any = result;
  if (errors) {
    return errors[0].message;
  }
  return data;
};

export const formatRate = (rate) => {
  return (parseFloat(rate) * 100).toFixed(2);
};

export const MICRO = 1000000;

export const valueConversion = (value) =>
  (parseFloat(value) / MICRO).toFixed(3);
	
