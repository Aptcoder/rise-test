import { CreateFileInput } from "src/services/file.service"
import { CreateUserDTO } from "../dtos/user.dtos"
import { IFile, IFolder, IUser } from "./entities.interfaces"

export interface IUserRepository {
    create(createUserDto: CreateUserDTO): Promise<IUser>
    findAll(): Promise<IUser[]>
    findByEmail(email: string): Promise<IUser | null>
}

export interface IFileRepository {
    create(fileInput: CreateFileInput): Promise<IFile>
    findAll(): Promise<IFile[]>
    findByKey(key: string): Promise<IFile | null>
    findByKeys(keys: string[]): Promise<IFile[]>
}

export interface IFolderRepository {
    findAll(): Promise<IFolder[]>
    findByName(name: string): Promise<IFolder | null>
    create(name: string, files?: IFile[]): Promise<IFolder>
}
