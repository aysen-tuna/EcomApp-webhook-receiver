import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import routes from './common/routes';
import unknownEndpoint from './middlewares/unknownEndpoint';
import webhooksController from './resources/stripe/webhooks/controller';

import './common/env';

const app: Application = express();

app.disable('x-powered-by');
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(
  express.urlencoded({
    extended: true,
    limit: process.env.REQUEST_LIMIT || '100kb',
  }),
);

app.post('/v1/stripe/webhooks', express.raw({ type: 'application/json' }), webhooksController.receiveUpdates);

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    'health-check': 'OK: top level api working',
  });
});

app.use('/v1/', routes);

app.use('*', unknownEndpoint);

export default app;
