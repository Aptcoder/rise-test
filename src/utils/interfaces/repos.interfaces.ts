import { CreateFileInput } from "src/services/file.service"
import { CreateUserDTO } from "../dtos/user.dtos"
import { IFile, IUser } from "./entities.interfaces"

export interface IUserRepository {
    create(createUserDto: CreateUserDTO): Promise<IUser>
    findAll(): Promise<IUser[]>
    findByEmail(email: string): Promise<IUser | null>
}

export interface IFileRepository {
    create(fileInput: CreateFileInput): Promise<IFile>
    findAll(): Promise<IFile[]>
    findByKey(key: string): Promise<IFile | null>
}
