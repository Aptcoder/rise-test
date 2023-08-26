import { Router } from "express"
import { IContainer } from "../common/types"
import FolderController from "../controllers/folder.controller"
import {
    AddFileToFolderBodyDTO,
    CreateFolderDTO,
    FolderParamDTO,
    RemoveFileParam,
} from "../common/dtos/file.dtos"
import validator from "../middlewares/validator"
import { Auth as AuthService } from "../middlewares/auth"

export const setupFolderRoutes = (container: IContainer) => {
    const folderRouter: Router = Router()
    const folderController = container.get(FolderController)
    const authService = container.get(AuthService)

    folderRouter.get("/", folderController.getFolders.bind(folderController))

    folderRouter.post(
        "/",
        authService.auth(),
        validator({
            body: CreateFolderDTO,
        }),
        folderController.createFolder.bind(folderController)
    )

    folderRouter.post(
        "/:folderId/files",
        authService.auth(),
        validator({
            body: AddFileToFolderBodyDTO,
            param: FolderParamDTO,
        }),
        folderController.addFilesToFolder.bind(folderController)
    )

    folderRouter.delete(
        "/:folderId/files/:fileId",
        authService.auth(),
        validator({
            param: RemoveFileParam,
        }),
        folderController.removeFileFromFolder.bind(folderController)
    )

    return folderRouter
}
