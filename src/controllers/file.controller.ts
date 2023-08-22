import { NextFunction, Request, Response } from "express"
import { Inject, Service } from "typedi"
import { CreateUserDTO } from "../utils/dtos/user.dtos"
import {
    IFileService,
    IUserService,
} from "../utils/interfaces/services.interfaces"
import { UserRole } from "../entities/user.entity"
import Helper from "../utils/helper"
import { BadRequestError } from "../utils/errors"
import { StorageService } from "../services/providers/storage/stoarage.service"

@Service()
export default class FileController {
    constructor(
        @Inject("file_service") public fileService: IFileService,
        @Inject("storage_service") public storageService: StorageService
    ) {
        this.fileService = fileService
        this.storageService = storageService
    }

    public async createFile(req: Request, res: Response) {
        try {
            let { file } = req
            if (!file) {
                throw new BadRequestError("File not uploaded")
            }
            const createdFile = await this.fileService.createFile(
                file as Express.MulterS3.File
            )
            return Helper.formatResponse(res, "File created", {
                file: createdFile,
            })
        } catch (err: any) {
            return Helper.handleError(res, err)
        }
    }

    public async getFiles(req: Request, res: Response) {
        try {
            const files = await this.fileService.getFiles()
            return Helper.formatResponse(res, "Files", { files })
        } catch (err: any) {
            return Helper.handleError(res, err)
        }
    }

    public async downloadFile(req: Request, res: Response) {
        try {
            const { key } = req.params
            const file = await this.fileService.getFile(key)

            const stream = await this.storageService.getObject(file.key)
            stream.pipe(res)
        } catch (err: any) {
            return Helper.handleError(res, err)
        }
    }
}
