import { validateQuery, validationMiddleware } from './utils';
import Joi from '@hapi/joi';
import { Exchange } from '../../types';

export const getPricesValidator = [
  validateQuery(
    Joi.object({
      exchange: Joi.string()
        .valid(...Object.values(Exchange))
        .required(),
      symbols: [Joi.array().items(Joi.string()).required(), Joi.string().required()],
      dates: Joi.array().items(Joi.string()).required(),
    }),
  ),
  validationMiddleware,
];
