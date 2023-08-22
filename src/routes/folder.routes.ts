import { Router } from "express"
import { IContainer } from "../utils/types"
import FolderController from "../controllers/folder.controller"
import { CreateFolderDTO } from "../utils/dtos/file.dtos"
import validator from "../middlewares/validator"

export const setupFolderRoutes = (container: IContainer) => {
    const folderRouter: Router = Router()
    const folderController = container.get(FolderController)

    folderRouter.get("/", folderController.getFolders.bind(folderController))

    folderRouter.post(
        "/",
        validator({
            body: CreateFolderDTO,
        }),
        folderController.createFolder.bind(folderController)
    )
    return folderRouter
}
