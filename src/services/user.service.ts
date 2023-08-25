import { Service, Inject } from "typedi"
import * as bcrypt from "bcrypt"
import { IUser } from "../common/interfaces/entities.interfaces"
import { IUserRepository } from "../common/interfaces/repos.interfaces"
import { APIError, ConflictError, NotFoundError } from "../common/errors"
import { AuthUserDto, CreateUserDTO } from "../common/dtos/user.dtos"
import { IUserService } from "src/common/interfaces/services.interfaces"
import jwt from "jsonwebtoken"
import config from "config"
import _ from "lodash"
import { CacheService } from "../common/services/cache/cache.service"

@Service("user_service")
export default class UserService implements IUserService {
    constructor(
        @Inject("user_repository") public userRepository: IUserRepository,
        @Inject("cache_service") public cacheService: CacheService
    ) {
        this.userRepository = userRepository
        this.cacheService = cacheService
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

    async logoutUser(userId: string) {
        await this.cacheService.delete(userId)
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

        await this.cacheService.set(user.id, accessToken, {
            ttl: 60 * 60 * 1000,
        })

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
