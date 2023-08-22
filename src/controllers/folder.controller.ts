import { NextFunction, Request, Response } from "express"
import { Inject, Service } from "typedi"
import { CreateUserDTO } from "../utils/dtos/user.dtos"
import { IFolderService } from "../utils/interfaces/services.interfaces"
import Helper from "../utils/helper"

@Service()
export default class FileController {
    constructor(
        @Inject("folder_service") public folderService: IFolderService
    ) {
        this.folderService = folderService
    }

    public async createFolder(req: Request, res: Response) {
        try {
            const folder = await this.folderService.createFolder(req.body)
            return Helper.formatResponse(res, "Folder created", {
                folder,
            })
        } catch (err: any) {
            return Helper.handleError(res, err)
        }
    }

    public async getFolders(req: Request, res: Response) {
        try {
            const folders = await this.folderService.getFolders()
            return Helper.formatResponse(res, "Folders", { folders })
        } catch (err: any) {
            return Helper.handleError(res, err)
        }
    }
}
