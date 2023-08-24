/* eslint-disable import/prefer-default-export */
import { Application } from "express"
import { initContainer } from "./container"
import initDb from "./db"
import { setupCron } from "./cron"

async function init({ expressApp }: { expressApp: Application }) {
    await initDb()
    const Container = await initContainer()
    const { loadApp } = await import("./app")
    await loadApp({ app: expressApp, Container: Container })
    await setupCron(Container)

    return Container
}

export { init }
