import { Service, Inject } from "typedi"
import * as bcrypt from "bcrypt"
import { IFile, IUser } from "../common/interfaces/entities.interfaces"
import {
    IFileRepository,
    IReviewRepository,
} from "../common/interfaces/repos.interfaces"
import {
    APIError,
    BadRequestError,
    ConflictError,
    NotFoundError,
} from "../common/errors"
import { IFileService } from "../common/interfaces/services.interfaces"
import _ from "lodash"

export interface CreateFileInput {
    originalname: string
    location: string
    mimetype: string
    size: number
    key?: string
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
        @Inject("file_repository") public fileRepository: IFileRepository,
        @Inject("review_repository") public reviewRepository: IReviewRepository
    ) {
        this.fileRepository = fileRepository
    }
    async getFiles() {
        const files = await this.fileRepository.findAll()
        return files
    }

    async getFile(id: string): Promise<IFile> {
        const file = await this.fileRepository.findById(id)
        if (!file) {
            throw new NotFoundError("File not found")
        }
        return file
    }

    async createFile(input: CreateFileInput): Promise<IFile> {
        return this.fileRepository.create(input)
    }

    async markUnsafe(fileId: string, reviewerId: string, comment?: string) {
        let file = await this.fileRepository.findById(fileId)
        if (!file) {
            throw new NotFoundError("File not found")
        }

        if (!videoAndImageTypes.has(file.mimeType)) {
            throw new BadRequestError(
                "File of this type can not be marked unsafe"
            )
        }

        const review = await this.reviewRepository.findOne({
            fileId: file.id,
            reviewerId: reviewerId,
        })

        if (review) {
            throw new ConflictError(
                "File has already been reviewed by this admin"
            )
        }

        await this.reviewRepository.create({
            comment,
            fileId: file.id,
            reviewerId: reviewerId,
        })

        return file
    }
}
