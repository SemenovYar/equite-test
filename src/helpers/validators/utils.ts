import { NextFunction, Request, Response } from 'express';
import HttpError from '../httpError';
import { ObjectSchema, ValidationError } from '@hapi/joi';

type ResponseValidationError = {
  type: string;
  value: any;
  path: (string | number)[];
};

type RequestWithValidateErrors = Request & {
  validateErrors: ResponseValidationError[];
};

export const getDetailErrors = (error: ValidationError): ResponseValidationError[] => {
  if (!error) {
    return [];
  }

  return error.details.map((detail) => {
    return {
      type: detail.type,
      value: detail.context.value,
      path: detail.path,
    };
  });
};

/**
 * Общая функция валидирования
 */
export const validate = (reqField: 'body' | 'params' | 'query' | 'headers', schema: ObjectSchema) => {
  return (req: RequestWithValidateErrors, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req[reqField], { abortEarly: false });
    const errors = getDetailErrors(error);
    req.validateErrors = [...(req.validateErrors || []), ...errors];

    return next();
  };
};

/**
 * Функции валидирования конкретных частей запроса
 */
export const validateBody = (
  schema: ObjectSchema,
): ((req: RequestWithValidateErrors, res: Response, next: NextFunction) => void) => {
  return validate('body', schema);
};

export const validateQuery = (
  schema: ObjectSchema,
): ((req: RequestWithValidateErrors, res: Response, next: NextFunction) => void) => {
  return validate('query', schema);
};

export const validateParams = (
  schema: ObjectSchema,
): ((req: RequestWithValidateErrors, res: Response, next: NextFunction) => void) => {
  return validate('params', schema);
};

export const validateHeaders = (
  schema: ObjectSchema,
): ((req: RequestWithValidateErrors, res: Response, next: NextFunction) => void) => {
  return validate('headers', schema.unknown(true));
};

/**
 * Миддлвайр для обработки ошибок валидации
 */
export const validationMiddleware = (req: RequestWithValidateErrors, res: Response, next: NextFunction): void => {
  const errors = req.validateErrors;

  if (errors.length > 0) {
    const httpError = new HttpError(422, 'VALIDATION_ERROR', errors);

    return next(httpError);
  }

  return next();
};
