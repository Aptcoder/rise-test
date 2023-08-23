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

const videoAndAudioTypes = new Set([
    "audio/mpeg",
    "audio/mp4",
    "audio/mp3",
    "audio/ogg",
    "audio/vnd.wav",
    "audio/wave",
    "video/mp4",
    "video/3gpp",
    "video/quicktime",
    "video/x-ms-wmv",
    "video/x-msvideo",
    "video/x-flv",
])

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

    public async getFileView(req: Request, res: Response) {
        try {
            const { fileId } = req.params
            const file = await this.fileService.getFile(fileId)

            return res.render("file", {
                file,
            })
        } catch (err: any) {
            return Helper.handleError(res, err)
        }
    }

    public async getFileStream(req: Request, res: Response) {
        try {
            const { fileId } = req.params
            const file = await this.fileService.getFile(fileId)

            if (!videoAndAudioTypes.has(file.mimeType)) {
                throw new BadRequestError("This file type can not be streamed")
            }

            const fileKey = file.key

            const fileSize = await this.storageService.getObjectSize(fileKey)

            const requestedRange = req.headers.range
            let start, end
            if (requestedRange) {
                ;[start, end] = requestedRange.replace(/bytes=/, "").split("-")
                start = Number(start)
                end = end ? Math.min(Number(end), fileSize - 1) : fileSize - 1
            } else {
                start = 0
                end = Math.min(start + 3e6, fileSize)
            }
            const contentLength = end! - start! + 1

            res.statusCode = 206
            res.setHeader("Accept-Ranges", "bytes")
            res.setHeader("Content-Range", `bytes ${start}-${end}/${fileSize}`)
            res.setHeader("Content-Length", contentLength)

            const stream = await this.storageService.getObject(
                fileKey,
                `bytes=${start}-${end}`
            )
            stream.pipe(res)
        } catch (err: any) {
            return Helper.handleError(res, err)
        }
    }

    public async markFileUnSafe(req: Request, res: Response) {
        try {
            const { fileId } = req.params
            const file = await this.fileService.markUnsafe(fileId)

            return Helper.formatResponse(res, "File marked as unsafe", {
                file,
            })
        } catch (err: any) {
            return Helper.handleError(res, err)
        }
    }
}
