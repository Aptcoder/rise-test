import { Service, Inject } from "typedi"
import * as bcrypt from "bcrypt"
import { IFile, IUser } from "../utils/interfaces/entities.interfaces"
import { IFileRepository } from "../utils/interfaces/repos.interfaces"
import { APIError, ConflictError, NotFoundError } from "../utils/errors"
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

    async createFile(input: CreateFileInput): Promise<IFile> {
        return this.fileRepository.create(input)
    }
}