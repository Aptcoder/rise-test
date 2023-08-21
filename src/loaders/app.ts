/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

import express, {
  Application, NextFunction, Response, Request
} from 'express';
import { IContainer } from '../utils/types';
import { setupRoutes } from '../routes/api.routes';

const loadApp = ({ app, Container}: { app: any, Container: IContainer  }) => {
  app.use(express.json());

  app.use('/api', setupRoutes(Container));

  app.use('*', (req: Request, res: Response) => res.status(404).send({
    status: 'failed',
    message: 'Endpoint not found',
    data: {},
  }));

  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.log('Error', err);
    if (err.type && err.type === 'entity.parse.failed') {
      return res
        .status(400)
        .send({ status: 'failed', message: err.message }); // Bad request
    }
    return res.status(err.status || 500).send({
      status: 'failed',
      message: 'Something unexpected happened',
    });
  });

  return app;
};

export { loadApp };
