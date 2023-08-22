import { Router } from "express"
import UserController from "../controllers/user.controller"
import { IContainer } from "../utils/types"
import validator from "../middlewares/validator"
import { AuthUserDto, CreateUserDTO } from "../utils/dtos/user.dtos"
import { StorageService } from "../services/providers/storage/stoarage.service"
import FileController from "../controllers/file.controller"

export const setupUserRoutes = (container: IContainer) => {
    const storageService: StorageService = container.get("storage_service")
    const fileRouter: Router = Router()
    const fileController = container.get(FileController)

    fileRouter.get("/", fileController.getFiles.bind(fileController))

    fileRouter.post(
        "/upload",
        storageService.upload.single("file"),
        fileController.createFile.bind(fileController)
    )
    return fileRouter
}
