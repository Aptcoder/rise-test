import express, { Application, Request, Response } from 'express';
import { setupUserRoutes } from './user.routes';
import Container from 'typedi';

type IContainer = typeof Container 
export const setupRoutes = (Container: IContainer) =>{
  const apiRouter = express.Router();
  apiRouter.use('/users', setupUserRoutes(Container))

  return apiRouter

}
