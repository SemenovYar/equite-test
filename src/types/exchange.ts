export enum Exchange {
  binance = 'binance',
  bitmex = 'bitmex',
  bybit = 'bybit',
}

type RateHistory = Record<string, number>;

export type GetPricesParams = {
  exchange: Exchange;
  symbols: string[];
  dates: string[];
};

export type CryptoPair = Record<string, RateHistory[]>;
