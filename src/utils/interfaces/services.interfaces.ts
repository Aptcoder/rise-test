import { CreateUserDTO } from "../dtos/user.dtos"
import { IUser } from "./entities.interfaces"

export interface IUserService {
    createUser(createUserDto: CreateUserDTO): Promise<IUser>
    getUsers(): Promise<IUser[]>
}