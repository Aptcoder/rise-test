import { Service, Inject } from "typedi"
import * as bcrypt from "bcrypt"
import { IFile, IUser } from "../utils/interfaces/entities.interfaces"
import { IFileRepository } from "../utils/interfaces/repos.interfaces"
import {
    APIError,
    BadRequestError,
    ConflictError,
    NotFoundError,
} from "../utils/errors"
import { AuthUserDto, CreateUserDTO } from "../utils/dtos/user.dtos"
import { IFileService } from "../utils/interfaces/services.interfaces"
import jwt from "jsonwebtoken"
import config from "config"
import _ from "lodash"
import { CacheService } from "./providers/cache/cache.service"

export interface CreateFileInput {
    originalname: string
    location: string
    mimetype: string
    size: number
}

const videoAndImageTypes = new Set([
    "image/jpeg",
    "image/jpg",
    "image/png",
    "video/mp4",
    "video/3gpp",
    "video/quicktime",
    "video/x-ms-wmv",
    "video/x-msvideo",
    "video/x-flv",
])

@Service("file_service")
export default class FileService implements IFileService {
    constructor(
        @Inject("file_repository") public fileRepository: IFileRepository
    ) {
        this.fileRepository = fileRepository
    }
    async getFiles() {
        const files = await this.fileRepository.findAll()
        return files
    }

    async getFile(key: string): Promise<IFile> {
        const file = await this.fileRepository.findByKey(key)
        if (!file) {
            throw new NotFoundError("File not found")
        }
        return file
    }

    async createFile(input: CreateFileInput): Promise<IFile> {
        return this.fileRepository.create(input)
    }

    async markUnsafe(fileId: string) {
        let file = await this.fileRepository.findById(fileId)
        if (!file) {
            throw new NotFoundError("File not found")
        }

        if (!videoAndImageTypes.has(file.mimeType)) {
            throw new BadRequestError(
                "File of this type can not be marked unsafe"
            )
        }

        file = await this.fileRepository.update(file, {
            safe: false,
        })

        return file
    }
}
