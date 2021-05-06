import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import HttpError from './helpers/httpError';
import routes from './routes';

// Create Express server
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', routes.exchange);

// 404
app.use((req: Request, res: Response) => {
  return res.status(404).json({
    description: 'Page not found',
  });
});

// Express error handling
// eslint-disable-next-line
app.use((err: Error | HttpError, req: Request, res: Response, _: NextFunction) => {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ ...err, message: err.message });
  }
  // eslint-disable-next-line no-console
  console.log('Internal server error', err);

  return res.status(500).json({
    message: 'INTERNAL_SERVER_ERROR',
  });
});

export default app;
