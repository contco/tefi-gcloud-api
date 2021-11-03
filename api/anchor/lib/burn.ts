/* eslint-disable no-useless-escape */
import axios from "axios";
import { fetchData, date, getPriceFromFCD } from "../../commons";
import { MICRO } from "@contco/terra-utilities";
import { MANTLE_URL, LUNA_DENOM, BASSETS_INFO } from "../../constants";

const WITHDRAWABLE_REQUEST_QUERY = (address, blockTime) =>
  `{\n  withdrawableUnbonded: WasmContractsContractAddressStore(\n    ContractAddress: \"terra1mtwph2juhj0rvjz7dy92gvl6xvukaxu8rfv8ts\"\n    QueryMsg: \"{\\\"withdrawable_unbonded\\\":{\\\"block_time\\\":${blockTime},\\\"address\\\":\\\"${address}\\\"}}\"\n  ) {\n    Result\n  }\n  unbondedRequests: WasmContractsContractAddressStore(\n    ContractAddress: \"terra1mtwph2juhj0rvjz7dy92gvl6xvukaxu8rfv8ts\"\n    QueryMsg: \"{\\\"unbond_requests\\\":{\\\"address\\\":\\\"${address}\\\"}}\"\n  ) {\n    Result\n  }\n}\n`;

const ALL_HISTORY_QUERY = (number) =>
  `{\n  allHistory: WasmContractsContractAddressStore(\n    ContractAddress: "terra1mtwph2juhj0rvjz7dy92gvl6xvukaxu8rfv8ts"\n    QueryMsg: "{\\"all_history\\":{\\"start_from\\":${
    number - 1
  },\\"limit\\":${number}}}"\n  ) {\n    Result\n  }\n  parameters: WasmContractsContractAddressStore(\n    ContractAddress: "terra1mtwph2juhj0rvjz7dy92gvl6xvukaxu8rfv8ts"\n    QueryMsg: "{\\"parameters\\":{}}"\n  ) {\n    Result\n  }\n}\n`;

const valueConversion = (value) => value / MICRO;

export const getAllHistory = async (requestNumber: number) => {
  try {
    const history: any = await axios.get(
      MANTLE_URL + "?bond--withdraw-history",
      {
        params: {
          query: ALL_HISTORY_QUERY(requestNumber),
          variables: {},
        },
      }
    );

    const monthTime = 2592000;
    const histories = JSON.parse(
      history?.data?.data?.allHistory?.Result
    ).history;
    const blockTime = Math.floor(new Date().getTime() / 1000);
    if (histories.length > 0) {
      const exchangeRate = histories[0].applied_exchange_rate;
      const requestedTime = date.secondsToDate(histories[0].time);
      const unbondingPeriod = JSON.parse(
        history?.data?.data?.parameters?.Result
      )?.unbonding_period;
      const claimableTime =
        histories[0].time + unbondingPeriod + monthTime > blockTime
          ? date.secondsToDate(histories[0].time + unbondingPeriod)
          : "-";

      return {
        exchangeRate,
        requestedTime,
        claimableTime,
      };
    } else {
      return {};
    }
  } catch (err) {
    return {};
  }
};

export const getWithdrawableRequest = async (address: string) => {
  const blockTime = Math.floor(new Date().getTime() / 1000);
  try {
    const withdrawables: any = await axios.get(
      MANTLE_URL + "?bond--withdrawable-requests",
      {
        params: {
          query: WITHDRAWABLE_REQUEST_QUERY(address, blockTime),
          variables: {},
        },
      }
    );

    const requests = JSON.parse(
      withdrawables.data?.data?.unbondedRequests.Result
    ).requests;

    let requestHistories: any = [];
    if (requests.length > 0) {
      requestHistories = await Promise.all(
        requests.map(async (request) => {
          const amount = valueConversion(request[1]).toString();
          const history = await getAllHistory(request[0]);
          const bLUNARequest: any = await fetchData(BASSETS_INFO + "bluna");
          const bLunaPrice = bLUNARequest?.data?.bLuna_price;
          const totalValue = parseFloat(amount) * parseFloat(bLunaPrice);

          return {
            amount: {
              amount,
              amountValue: totalValue.toString(),
            },
            time: {
              requestedTime: history?.requestedTime,
              claimableTime: history?.claimableTime,
            },
          };
        })
      );
    }

    const lunaPrice = await getPriceFromFCD(LUNA_DENOM);
    const withdrawableAmount = JSON.parse(
      withdrawables?.data?.data.withdrawableUnbonded?.Result
    )?.withdrawable;
    const withdrawableValue =
      valueConversion(withdrawableAmount) * parseFloat(lunaPrice);

    return {
      requestHistories: requestHistories.filter(
        (history) => history.time.claimableTime !== "-"
      ),
      withdrawableAmount: valueConversion(withdrawableAmount).toString(),
      withdrawableValue: withdrawableValue.toString(),
    };
  } catch (err) {
    return {
      requestHistories: [],
      withdrawableAmount: "0",
      withdrawableValue: "0",
    };
  }
};

export default async (address) => {
  const { requestHistories, withdrawableAmount, withdrawableValue } =
    await getWithdrawableRequest(address);

  const totalBurnAmount = requestHistories
    .reduce((a, data) => a + parseFloat(data?.amount?.amount), 0)
    .toString();
  const totalBurnAmountValue = requestHistories
    .reduce((a, data) => a + parseFloat(data?.amount?.amountValue), 0)
    .toString();

  return {
    requestData: requestHistories,
    withdrawableAmount,
    withdrawableValue,
    totalBurnAmount,
    totalBurnAmountValue,
  };
};
