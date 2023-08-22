import { AuthUserDto, CreateUserDTO } from "../dtos/user.dtos"
import { IUser } from "./entities.interfaces"

export interface IUserService {
    createUser(createUserDto: CreateUserDTO): Promise<IUser>
    getUsers(): Promise<IUser[]>
    auth(
        authUserDto: AuthUserDto
    ): Promise<{ accessToken: string; user: IUser }>
}
