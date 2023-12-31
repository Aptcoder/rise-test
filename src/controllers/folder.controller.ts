import { NextFunction, Request, Response } from "express"
import { Inject, Service } from "typedi"
import { CreateUserDTO } from "../common/dtos/user.dtos"
import { IFolderService } from "../common/interfaces/services.interfaces"
import Helper from "../common/helper"

@Service()
export default class FileController {
    constructor(
        @Inject("folder_service") public folderService: IFolderService
    ) {
        this.folderService = folderService
    }

    public async createFolder(req: Request, res: Response, next: NextFunction) {
        try {
            const folder = await this.folderService.createFolder(req.body)
            return Helper.formatResponse(res, "Folder created", {
                folder,
            })
        } catch (err: any) {
            return next(err)
        }
    }

    public async getFolders(req: Request, res: Response, next: NextFunction) {
        try {
            const folders = await this.folderService.getFolders()
            return Helper.formatResponse(res, "Folders", { folders })
        } catch (err: any) {
            return next(err)
        }
    }

    public async addFilesToFolder(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { folderId } = req.params
            const { files } = req.body

            const folder = await this.folderService.addFiles(folderId, files)
            return Helper.formatResponse(res, "Files added to folder", {
                folder,
            })
        } catch (err) {
            return next(err)
        }
    }

    public async removeFileFromFolder(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { folderId, fileId } = req.params

            const folder = await this.folderService.removeFile(folderId, fileId)
            return Helper.formatResponse(res, "File removed from folder", {
                folder,
            })
        } catch (err) {
            return next(err)
        }
    }
}
