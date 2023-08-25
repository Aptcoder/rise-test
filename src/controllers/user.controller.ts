import { NextFunction, Request, Response } from "express"
import { Inject, Service } from "typedi"
import { CreateUserDTO } from "../common/dtos/user.dtos"
import { IUserService } from "../common/interfaces/services.interfaces"
import { UserRole } from "../entities/user.entity"
import Helper from "../common/helper"

@Service()
export default class UserController {
    constructor(@Inject("user_service") public userService: IUserService) {
        this.userService = userService
    }

    public async createUser(req: Request, res: Response, next: NextFunction) {
        const createUserDto: CreateUserDTO = req.body
        try {
            const user = await this.userService.createUser(createUserDto)
            return Helper.formatResponse(res, "User created", { user })
        } catch (err: any) {
            return next(err)
        }
    }

    public async createAdminUser(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        const createUserDto: CreateUserDTO = req.body
        try {
            const admin = await this.userService.createUser({
                ...createUserDto,
                role: UserRole.ADMIN,
            })
            return Helper.formatResponse(res, "Created admin", { admin })
        } catch (err: any) {
            return next(err)
        }
    }

    public async getAllUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await this.userService.getUsers()
            return Helper.formatResponse(res, "Users", { users })
        } catch (err: any) {
            return next(err)
        }
    }

    public async logoutUser(req: Request, res: Response, next: NextFunction) {
        try {
            await this.userService.logoutUser(req.user!.id)
            return Helper.formatResponse(res, "Logged user out")
        } catch (err: any) {
            return next(err)
        }
    }

    public async authUser(
        req: Request,
        res: Response,
        next: NextFunction
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
            return next(err)
        }
    }
}
