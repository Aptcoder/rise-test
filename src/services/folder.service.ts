import { Service, Inject } from "typedi"
import { IFolder } from "../utils/interfaces/entities.interfaces"
import {
    IFileRepository,
    IFolderRepository,
} from "../utils/interfaces/repos.interfaces"
import { IFolderService } from "../utils/interfaces/services.interfaces"
import { CreateFolderDTO } from "../utils/dtos/file.dtos"
import { NotFoundError } from "../utils/errors"

export interface CreateFileInput {
    originalname: string
    location: string
    mimetype: string
    size: number
}

@Service("folder_service")
export default class FolderService implements IFolderService {
    constructor(
        @Inject("folder_repository") public folderRepository: IFolderRepository,
        @Inject("file_repository") public fileRepository: IFileRepository
    ) {
        this.folderRepository = folderRepository
    }
    async getFolders() {
        const folders = await this.folderRepository.findAll()
        return folders
    }

    async createFolder(createFolderDto: CreateFolderDTO): Promise<IFolder> {
        const files = await this.fileRepository.findByKeys(
            createFolderDto.files
        )
        if (files.length < createFolderDto.files.length) {
            throw new NotFoundError("One or more files not found")
        }
        return this.folderRepository.create(createFolderDto.name, files)
    }
}
