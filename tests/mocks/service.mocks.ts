import {
    IFileService,
    IUserService,
} from "src/utils/interfaces/services.interfaces"
import { sampleFile, sampleUser } from "./repo.mocks"
import { CreateFileInput } from "src/services/file.service"
import { IFile } from "src/utils/interfaces/entities.interfaces"

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
}
