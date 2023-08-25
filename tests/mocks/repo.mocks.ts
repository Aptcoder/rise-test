import { faker } from "@faker-js/faker"
import { CreateUserDTO } from "../../src/common/dtos/user.dtos"
import {
    IFile,
    IFolder,
    IReview,
    IUser,
} from "../../src/common/interfaces/entities.interfaces"
import {
    IFileRepository,
    IFolderRepository,
    IReviewRepository,
    IUserRepository,
} from "../../src/common/interfaces/repos.interfaces"
import { UserRole } from "../../src/entities/user.entity"

export const sampleUser: IUser = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    dateJoined: new Date(),
    role: UserRole.GUEST,
    id: faker.person.fullName(),

    save: jest.fn(),
    email: faker.internet.email(),
    password: faker.internet.password(),
}

export const sampleFile: IFile = {
    originalName: faker.person.fullName(),
    key: faker.internet.exampleEmail(),
    size: faker.number.int(),
    location: faker.internet.url(),
    id: faker.person.fullName(),
    deletedAt: new Date(),
    createdAt: new Date(),
    mimeType: "pdf",
    safe: true,
}

export const sampleFolder: IFolder = {
    id: faker.person.fullName(),
    name: "sample",
    files: [sampleFile],
}

export const sampleReview: IReview = {
    id: faker.person.fullName(),
    file: sampleFile,
    fileId: sampleFile.id,
    reviewerId: sampleUser.id,
    reviewer: sampleUser,
    safe: false,
    deletedAt: new Date(),
    createdAt: new Date(),
}

export const mockUserRepository: IUserRepository = {
    create: function (createUserDto: CreateUserDTO): Promise<IUser> {
        return Promise.resolve({
            ...createUserDto,
            dateJoined: new Date(),
            role: UserRole.GUEST,
            id: faker.person.fullName(),

            save: jest.fn(),
        })
    },
    findAll: function (): Promise<IUser[]> {
        throw new Error("Function not implemented.")
    },
    findByEmail: function (): Promise<IUser | null> {
        return Promise.resolve(sampleUser)
    },
}

export const mockFileRepository: IFileRepository = {
    create(fileInput) {
        return Promise.resolve(sampleFile)
    },
    findAll: function (): Promise<IFile[]> {
        return Promise.resolve([sampleFile])
    },
    findByKey: function (key: string): Promise<IFile | null> {
        return Promise.resolve(sampleFile)
    },
    findByKeys: function (keys: string[]): Promise<IFile[]> {
        return Promise.resolve([sampleFile])
    },
    findById: function (id: string): Promise<IFile | null> {
        return Promise.resolve(sampleFile)
    },
    findByIds: function (ids: string[]): Promise<IFile[]> {
        return Promise.resolve([sampleFile])
    },
    update: function (file: IFile, update: {}): Promise<IFile> {
        return Promise.resolve(sampleFile)
    },
    updateMany: function (condition: {}, update: {}): Promise<{}> {
        throw new Error("Function not implemented.")
    },
}

export const mockFolderRepository: IFolderRepository = {
    findAll: function (): Promise<IFolder[]> {
        throw new Error("Function not implemented.")
    },
    create: function (
        name: string,
        files?: IFile[] | undefined
    ): Promise<IFolder> {
        const folder = {
            ...sampleFolder,
        }
        folder.name = name
        return Promise.resolve(folder)
    },
    findByName: function (name: string): Promise<IFolder> {
        return Promise.resolve(sampleFolder)
    },
    findById: function (id: string): Promise<IFolder | null> {
        return Promise.resolve(sampleFolder)
    },
    addFiles: function (files: IFile[], folder: IFolder): Promise<IFolder> {
        return Promise.resolve(sampleFolder)
    },
    removeFile: function (fileId: string, folder: IFolder): Promise<IFolder> {
        return Promise.resolve(sampleFolder)
    },
}

export const mockReviewRepository: IReviewRepository = {
    findOne: function (where: {}): Promise<IReview> {
        return Promise.resolve(sampleReview)
    },
    findMany: function (where: {}): Promise<IReview[]> {
        return Promise.resolve([sampleReview])
    },
    create: function (input: {
        comment: string
        fileId: string
        reviewerId: string
    }): Promise<IReview> {
        return Promise.resolve(sampleReview)
    },
    getFilesReviewedMoreThanTimes: function (times: number) {
        throw new Error("Function not implemented.")
    },
}
