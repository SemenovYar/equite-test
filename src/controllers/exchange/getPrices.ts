import { Exchange } from '../../types';

const ccxt = require('ccxt');

const exchanges = {
  binance: new ccxt.binance(),
  bitMex: new ccxt.bitmex(),
  byBit: new ccxt.bybit(),
};

const timeframe = '1d';

type getPricesParams = {
  exchange: Exchange;
  symbols: string[];
  dates: string[];
};

export const getPrices = async ({ exchange, symbols, dates }: getPricesParams): Promise<any> => {
  const currentExchange = exchanges[exchange];

  const resultPromises = await symbols.map(async (symbol) => {
    const symbolInfoPromises = dates.map(async (date) => {
      const datesInMs = new Date(date).getTime();

      return currentExchange.fetchOHLCV(symbol, timeframe, datesInMs);
    });

    const symbolInfoByDates = await Promise.all(symbolInfoPromises);

    const datesAndPrices = symbolInfoByDates.map((date) => {
      return date.reduce((acc, info) => {
        const date = new Date(info[0]);
        const normDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
        const openPrice = info[1];
        acc[normDate] = openPrice as number;

        return acc;
      }, {});
    });

    return {
      [symbol]: datesAndPrices,
    };
  });

  return Promise.all(resultPromises);
};
