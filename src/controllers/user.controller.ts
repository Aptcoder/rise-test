import { NextFunction, Request, Response } from "express"
import { Inject, Service } from "typedi"
import { CreateUserDTO } from "../utils/dtos/user.dtos"
import { IUserService } from "../utils/interfaces/services.interfaces"
import { UserRole } from "../entities/user.entity"
import Helper from "../utils/helper"

@Service()
export default class UserController {
    constructor(@Inject("user_service") public userService: IUserService) {
        this.userService = userService
    }

    public async createUser(req: Request, res: Response) {
        const createUserDto: CreateUserDTO = req.body
        try {
            const user = await this.userService.createUser(createUserDto)
            return Helper.formatResponse(res, "User created", { user })
        } catch (err: any) {
            return Helper.handleError(res, err)
        }
    }

    public async createAdminUser(req: Request, res: Response) {
        const createUserDto: CreateUserDTO = req.body
        try {
            const admin = await this.userService.createUser({
                ...createUserDto,
                role: UserRole.ADMIN,
            })
            return Helper.formatResponse(res, "Created admin", { admin })
        } catch (err: any) {
            return Helper.handleError(res, err)
        }
    }

    public async getAllUsers(req: Request, res: Response) {
        try {
            const users = await this.userService.getUsers()
            return Helper.formatResponse(res, "Users", { users })
        } catch (err: any) {
            return Helper.handleError(res, err)
        }
    }

    public async authUser(
        req: Request,
        res: Response
    ): Promise<void | Response> {
        try {
            const { email, password } = req.body
            const { accessToken, user } = await this.userService.auth({
                email,
                password,
            })
            return Helper.formatResponse(res, "User auth successful", {
                token: accessToken,
                user,
            })
        } catch (err) {
            return Helper.handleError(res, err)
        }
    }
}
