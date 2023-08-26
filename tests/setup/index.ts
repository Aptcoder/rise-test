import { Application } from "express"
import { initContainer } from "../../src/loaders/container"
import initDb from "../../src/loaders/db"
import { ILogger } from "../../src/common/interfaces/services.interfaces"
import { prepareSeederFactories, useDataSource } from "typeorm-extension"
import { userFactory } from "../../src/database/factories/user.factory"
import { mockStorageService } from "../mocks/service.mocks"
import { fileFactory } from "../../src/database/factories/file.factory"

export async function setupForTests({
    expressApp,
}: {
    expressApp: Application
}) {
    const Container = await initContainer()

    Container.set({
        id: "storage_service",
        value: mockStorageService,
    })
    await initDb(Container.get<ILogger>("logger"))
    const { loadApp } = await import("../../src/loaders/app")
    await loadApp({ app: expressApp, Container: Container })

    return Container
}

export async function setupDb() {
    const ds = await useDataSource()
    await ds.dropDatabase()
    await ds.runMigrations()

    prepareSeederFactories([userFactory, fileFactory])

    return ds
}
