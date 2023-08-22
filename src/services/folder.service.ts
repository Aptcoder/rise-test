import { Service, Inject } from "typedi"
import { IFile, IFolder } from "../utils/interfaces/entities.interfaces"
import {
    IFileRepository,
    IFolderRepository,
} from "../utils/interfaces/repos.interfaces"
import { IFolderService } from "../utils/interfaces/services.interfaces"
import { CreateFolderDTO } from "../utils/dtos/file.dtos"
import { ConflictError, NotFoundError } from "../utils/errors"

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
        let files: IFile[] = []

        const folder = await this.folderRepository.findByName(
            createFolderDto.name.toLocaleLowerCase()
        )
        if (folder) {
            throw new ConflictError("Folder with name exists")
        }

        if (createFolderDto.files) {
            files = await this.fileRepository.findByKeys(createFolderDto.files)

            if (files.length < createFolderDto.files.length) {
                throw new NotFoundError("One or more files not found")
            }
        }

        return this.folderRepository.create(createFolderDto.name, files)
    }

    async addFiles(folderId: string, fileIds: string[]) {
        let files = await this.fileRepository.findByIds(fileIds)
        if (files.length < fileIds.length) {
            throw new NotFoundError("One or more files not found")
        }
        let folder = await this.folderRepository.findById(folderId)
        if (!folder) {
            throw new NotFoundError("Folder not found")
        }

        const updatedFolder = this.folderRepository.addFiles(files, folder)
        return updatedFolder
    }

    async removeFile(folderId: string, fileId: string) {
        let folder = await this.folderRepository.findById(folderId)
        if (!folder) {
            throw new NotFoundError("Folder not found")
        }

        const updatedFolder = this.folderRepository.removeFile(fileId, folder)
        return updatedFolder
    }
}
