import { CreateFileInput } from "src/services/file.service"
import { AuthUserDto, CreateUserDTO } from "../dtos/user.dtos"
import { IFile, IFolder, IUser } from "./entities.interfaces"
import { CreateFolderDTO } from "../dtos/file.dtos"

export interface IUserService {
    createUser(createUserDto: CreateUserDTO): Promise<IUser>
    getUsers(): Promise<IUser[]>
    auth(
        authUserDto: AuthUserDto
    ): Promise<{ accessToken: string; user: Omit<IUser, "password"> }>
}

export interface IFileService {
    createFile(input: CreateFileInput): Promise<IFile>
    getFiles(): Promise<IFile[]>
    getFile(key: string): Promise<IFile>
}

export interface IFolderService {
    createFolder(input: CreateFolderDTO): Promise<IFolder>
    getFolders(): Promise<IFolder[]>
    // getFolder(key: string): Promise<IFile>
}
