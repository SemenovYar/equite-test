import { Router, NextFunction, Request, Response } from 'express';
import exchangeController from '../controllers/exchange';
import { getPricesValidator } from '../helpers/validators';
import { Exchange } from '../types';

const router = Router();

router.get('/price', getPricesValidator, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { query } = req;

    const dates = (Array.isArray(query.dates) ? query.dates : [query.dates]) as string[];
    const exchange = query.exchange as Exchange;
    const symbols = (Array.isArray(query.symbols) ? query.symbols : [query.symbols]) as string[];

    const result = await exchangeController.getPrices({ exchange, symbols, dates });

    return res.status(200).json(result);
  } catch (err) {
    return next(err);
  }
});

export default router;
