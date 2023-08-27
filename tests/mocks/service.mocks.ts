import {
    IFileService,
    IFolderService,
    ILogger,
    IUserService,
} from "../../src/common/interfaces/services.interfaces"
import { sampleFile, sampleFolder, sampleUser } from "./repo.mocks"
import { CreateFileInput } from "../../src/services/file.service"
import {
    IFile,
    IFileHistory,
    IFolder,
} from "../../src/common/interfaces/entities.interfaces"
import { StorageService } from "../../src/common/services/storage/storage.service"
import { createReadStream } from "fs"
import multer, { Multer, StorageEngine, memoryStorage } from "multer"
import { CreateFolderDTO } from "../../src/common/dtos/file.dtos"
import { Request } from "express"
import { ParamsDictionary } from "express-serve-static-core"
import { ParsedQs } from "qs"

export const mockLogger: ILogger = {
    info: function (message: string) {
        console.log(message)
        return mockLogger
    },
    warn: function (message: string): ILogger {
        console.log(message)
        return mockLogger
    },
    error: function (message: string, meta: {}): ILogger {
        console.log(message)
        return mockLogger
    },
}

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
    logoutUser: function (userId: string): Promise<void> {
        return Promise.resolve()
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
    getHistory: function (id: string): Promise<IFileHistory[]> {
        throw new Error("Function not implemented.")
    },
    update: function (
        fileId: string,
        update: { originalName: string }
    ): Promise<IFile> {
        throw new Error("Function not implemented.")
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

const mockMulterStorage: StorageEngine = {
    _handleFile: function (
        req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
        file: Express.Multer.File,
        callback: (
            error?: any,
            info?: Partial<Express.Multer.File> | undefined
        ) => void
    ): void {
        const mStorage = memoryStorage()
        let updatedFile: Express.MulterS3.File = {
            key: `${file.originalname}-${Date.now().toString()}`,
            location: "/random-url",
        } as Express.MulterS3.File
        mStorage._handleFile(req, file, (err, info) => {
            callback(err, Object.assign(updatedFile, info))
        })
    },
    _removeFile: function (
        req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
        file: Express.Multer.File,
        callback: (error: Error | null) => void
    ): void {
        throw new Error("Function not implemented.")
    },
}

export const mockStorageService: StorageService = {
    async getObject(key: string) {
        const stream = createReadStream("./tests/mocks/mockfiles/read.txt")
        return stream
    },
    upload: multer({
        storage: mockMulterStorage,
    }),
    getObjectSize: function (key: string): Promise<number> {
        return Promise.resolve(5400)
    },
    logger: mockLogger,
}
