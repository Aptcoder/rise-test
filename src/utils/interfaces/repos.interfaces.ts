import { CreateUserDTO } from "../dtos/user.dtos"
import { IUser } from "./entities.interfaces"

export interface IUserRepository {
    create(createUserDto: CreateUserDTO): Promise<IUser>
    findAll(): Promise<IUser[]>
    findByEmail(email: string): Promise<IUser | null>
}
