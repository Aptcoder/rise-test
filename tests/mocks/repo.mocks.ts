import { faker } from "@faker-js/faker"
import { CreateUserDTO } from "../../src/utils/dtos/user.dtos"
import { IFile, IUser } from "../../src/utils/interfaces/entities.interfaces"
import {
    IFileRepository,
    IUserRepository,
} from "../../src/utils/interfaces/repos.interfaces"
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
}
