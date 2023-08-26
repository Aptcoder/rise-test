import { Application } from "express"
import { initContainer } from "../../src/loaders/container"
import initDb from "../../src/loaders/db"
import { ILogger } from "../../src/common/interfaces/services.interfaces"

export async function setupForTests({
    expressApp,
}: {
    expressApp: Application
}) {
    const Container = await initContainer()
    await initDb(Container.get<ILogger>("logger"))
    const { loadApp } = await import("../../src/loaders/app")
    await loadApp({ app: expressApp, Container: Container })

    return Container
}
