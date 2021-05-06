import ccxt from 'ccxt';
import { GetPricesParams, CryptoPair } from '../../types';

const exchanges = {
  binance: new ccxt.binance(),
  bitMex: new ccxt.bitmex(),
  byBit: new ccxt.bybit(),
};

const timeframe = '1d';

const getStrDate = (datesInMs: number): string => {
  const date = new Date(datesInMs);

  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
};

export const getPrices = async ({ exchange, symbols, dates }: GetPricesParams): Promise<CryptoPair[]> => {
  const currentExchange = exchanges[exchange];

  const resultPromises = await symbols.map(async (symbol) => {
    try {
      const symbolInfoPromises = dates.map(async (date) => {
        const datesInMs = new Date(date).getTime();

        return currentExchange.fetchOHLCV(symbol, timeframe, datesInMs);
      });
      const symbolInfoByDates = await Promise.all(symbolInfoPromises);

      const datesAndPrices = symbolInfoByDates.map((date) => {
        return date.reduce((acc, [date, openPrice]) => {
          const strDate = getStrDate(date);

          acc[strDate] = openPrice as number;

          return acc;
        }, {});
      });

      return {
        [symbol]: datesAndPrices,
      };
    } catch (e) {
      console.log(e);
    }
  });

  return Promise.all(resultPromises);
};
