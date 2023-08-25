import { NextFunction, Request, Response } from "express"
import { Inject, Service } from "typedi"
import { IFileService } from "../common/interfaces/services.interfaces"
import Helper from "../common/helper"
import { BadRequestError } from "../common/errors"
import { StorageService } from "../common/services/storage/storage.service"

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

    public async createFile(req: Request, res: Response, next: NextFunction) {
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
            return next(err)
        }
    }

    public async getFiles(req: Request, res: Response, next: NextFunction) {
        try {
            const files = await this.fileService.getFiles()
            return Helper.formatResponse(res, "Files", { files })
        } catch (err: any) {
            return next(err)
        }
    }

    public async downloadFile(req: Request, res: Response, next: NextFunction) {
        try {
            const { fileId } = req.params
            const file = await this.fileService.getFile(fileId)

            const stream = await this.storageService.getObject(file.key)
            stream.pipe(res)
        } catch (err: any) {
            return next(err)
        }
    }

    public async getFileView(req: Request, res: Response, next: NextFunction) {
        try {
            const { fileId } = req.params
            const file = await this.fileService.getFile(fileId)

            if (!videoAndAudioTypes.has(file.mimeType)) {
                throw new BadRequestError("This file type can not be streamed")
            }

            return res.render("file", {
                file,
            })
        } catch (err: any) {
            return next(err)
        }
    }

    public async getFileStream(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
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
            return next(err)
        }
    }

    public async markFileUnSafe(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { fileId } = req.params
            const { user } = req
            const { comment } = req.body
            const file = await this.fileService.markUnsafe(
                fileId,
                user!.id,
                comment
            )

            return Helper.formatResponse(res, "File reviewed", {
                file,
            })
        } catch (err: any) {
            return next(err)
        }
    }
}
