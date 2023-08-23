import {
    IFileService,
    IFolderService,
    IUserService,
} from "../../src/utils/interfaces/services.interfaces"
import { sampleFile, sampleFolder, sampleUser } from "./repo.mocks"
import { CreateFileInput } from "../../src/services/file.service"
import { IFile, IFolder } from "../../src/utils/interfaces/entities.interfaces"
import { StorageService } from "../../src/services/providers/storage/stoarage.service"
import { createReadStream } from "fs"
import { Multer } from "multer"
import { CreateFolderDTO } from "src/utils/dtos/file.dtos"

export const mockUserService: IUserService = {
    createUser() {
        return Promise.resolve(sampleUser)
    },

    auth() {
        return Promise.resolve({
            user: sampleUser,
            accessToken: "random-string",
        })
    },

    getUsers() {
        return Promise.resolve([sampleUser])
    },
}

export const mockFileService: IFileService = {
    createFile: function (input: CreateFileInput): Promise<IFile> {
        return Promise.resolve(sampleFile)
    },
    getFiles: function (): Promise<IFile[]> {
        return Promise.resolve([sampleFile])
    },
    getFile: function (key: string): Promise<IFile> {
        return Promise.resolve(sampleFile)
    },
    markUnsafe: function (fileId: string): Promise<IFile> {
        return Promise.resolve(sampleFile)
    },
}

export const mockFolderService: IFolderService = {
    createFolder: function (input: CreateFolderDTO): Promise<IFolder> {
        return Promise.resolve(sampleFolder)
    },
    getFolders: function (): Promise<IFolder[]> {
        return Promise.resolve([sampleFolder])
    },
    addFiles: function (folderId: string, fileIds: string[]): Promise<IFolder> {
        return Promise.resolve(sampleFolder)
    },
    removeFile: function (folderId: string, fileId: string): Promise<IFolder> {
        return Promise.resolve(sampleFolder)
    },
}

export const mockStorageService: StorageService = {
    async getObject(key: string) {
        const stream = createReadStream("./mockfiles/test.txt")
        return stream
    },
    upload: {} as Multer,
}
