import { Router } from "express"
import { IContainer } from "../utils/types"
import { StorageService } from "../services/providers/storage/stoarage.service"
import FileController from "../controllers/file.controller"
import validator from "../middlewares/validator"
import { KeyDTO } from "../utils/dtos/file.dtos"

export const setupFileRoutes = (container: IContainer) => {
    const storageService: StorageService = container.get("storage_service")
    const fileRouter: Router = Router()
    const fileController = container.get(FileController)

    fileRouter.get("/", fileController.getFiles.bind(fileController))

    fileRouter.get(
        "/:key/download",
        validator({
            param: KeyDTO,
        }),
        fileController.downloadFile.bind(fileController)
    )

    fileRouter.post(
        "/",
        storageService.upload.single("file"),
        fileController.createFile.bind(fileController)
    )
    return fileRouter
}
