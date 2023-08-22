import { Service, Inject } from "typedi"
import * as bcrypt from "bcrypt"
import { IUser } from "../utils/interfaces/entities.interfaces"
import { IUserRepository } from "../utils/interfaces/repos.interfaces"
import { APIError, ConflictError, NotFoundError } from "../utils/errors"
import { AuthUserDto, CreateUserDTO } from "../utils/dtos/user.dtos"
import { IUserService } from "src/utils/interfaces/services.interfaces"
import jwt from "jsonwebtoken"
import config from "config"
import _ from "lodash"

@Service("user_service")
export default class UserService implements IUserService {
    constructor(
        @Inject("user_repository") public userRepository: IUserRepository
    ) {
        this.userRepository = userRepository
    }

    private async hashPassword(password: string): Promise<string> {
        const hash = await bcrypt.hash(password, 10)
        return hash
    }

    async createUser(createUserDto: CreateUserDTO): Promise<IUser> {
        const existingUser = await this.userRepository.findByEmail(
            createUserDto.email
        )
        if (existingUser) {
            throw new ConflictError("User with this email already exists")
        }
        const hashedPassword = await this.hashPassword(createUserDto.password)
        return this.userRepository.create({
            ...createUserDto,
            password: hashedPassword,
        })
    }

    public async auth(
        authUserDto: AuthUserDto
    ): Promise<{ accessToken: string; user: Omit<IUser, "password"> }> {
        const { email: userEmail, password: userPassword } = authUserDto
        let user = await this.userRepository.findByEmail(userEmail)

        if (!user) {
            throw new NotFoundError("User not found")
        }

        const comparePasswordResult = await this.comparePassword(
            userPassword,
            user.password
        )
        if (!comparePasswordResult) {
            throw new APIError("Invalid password", 401)
        }

        const { accessToken } = await this.generateToken(user)
        const userWithoutPassword = _.omit(user, "password")
        return { accessToken, user: userWithoutPassword }
    }

    public async comparePassword(inputPass: string, password: string) {
        return bcrypt.compare(inputPass, password)
    }

    public async generateToken(user: IUser): Promise<{ accessToken: string }> {
        const payload = {
            email: user.email,
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
        }
        return new Promise((resolve, reject) => {
            jwt.sign(
                payload,
                config.get<string>("jwtSecret"),
                {
                    // expiresIn: '600000'
                    expiresIn: "18000000",
                },
                (err: any, token) => {
                    if (err) {
                        return reject(err)
                    }
                    return resolve({ accessToken: token as string })
                }
            )
        })
    }

    async getUsers(): Promise<IUser[]> {
        return this.userRepository.findAll()
    }
}