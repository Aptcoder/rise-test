import { Router } from "express"
import { IContainer } from "../utils/types"
import { StorageService } from "../services/providers/storage/stoarage.service"
import FileController from "../controllers/file.controller"
import validator from "../middlewares/validator"
import { FileIdDTO, KeyDTO } from "../utils/dtos/file.dtos"
import { Auth as AuthService } from "../middlewares/auth"

export const setupFileRoutes = (container: IContainer) => {
    const storageService: StorageService = container.get("storage_service")
    const fileRouter: Router = Router()
    const fileController = container.get(FileController)

    const authService = container.get(AuthService)

    fileRouter.get(
        "/",
        authService.auth(),
        fileController.getFiles.bind(fileController)
    )

    fileRouter.get(
        "/:fileId/stream",
        validator({
            param: FileIdDTO,
        }),
        // authService.auth(),
        fileController.getFileStream.bind(fileController)
    )

    fileRouter.get(
        "/:fileId/view",
        validator({
            param: FileIdDTO,
        }),
        // authService.auth(),
        fileController.getFileView.bind(fileController)
    )

    fileRouter.get(
        "/:key/download",
        authService.auth(),
        validator({
            param: KeyDTO,
        }),
        fileController.downloadFile.bind(fileController)
    )

    fileRouter.post(
        "/",
        authService.auth(),
        storageService.upload.single("file"),
        fileController.createFile.bind(fileController)
    )

    fileRouter.patch(
        "/:fileId/mark_as_unsafe",
        validator({
            param: FileIdDTO,
        }),
        authService.auth(["admin"]),
        fileController.markFileUnSafe.bind(fileController)
    )

    return fileRouter
}
