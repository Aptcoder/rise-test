import { CreateFileInput } from "src/services/file.service"
import { AuthUserDto, CreateUserDTO } from "../dtos/user.dtos"
import { IFile, IUser } from "./entities.interfaces"

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
