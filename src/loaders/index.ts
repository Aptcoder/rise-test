/* eslint-disable import/prefer-default-export */
import { Application } from "express"
import { initContainer } from "./container"
import initDb from "./db"
import { setupCron } from "../cron"
import { ILogger } from "../common/interfaces/services.interfaces"
import { init as initRedisCache } from "../common/services/cache/redis.setup"

async function init({ expressApp }: { expressApp: Application }) {
    const Container = await initContainer()
    await initDb(Container.get<ILogger>("logger"))
    const { loadApp } = await import("./app")
    await loadApp({ app: expressApp, Container: Container })
    await setupCron(Container)

    return Container
}

export { init }
