import express, { Application, Request, Response } from "express"
import { setupUserRoutes } from "./user.routes"
import Container from "typedi"
import { setupFileRoutes } from "./file.routes"

type IContainer = typeof Container
export const setupRoutes = (Container: IContainer) => {
    const apiRouter = express.Router()
    apiRouter.use("/users", setupUserRoutes(Container))
    apiRouter.use("/files", setupFileRoutes(Container))

    return apiRouter
}
