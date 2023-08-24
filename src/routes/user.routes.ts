import { Router } from "express"
import UserController from "../controllers/user.controller"
import { IContainer } from "../utils/types"
import validator from "../middlewares/validator"
import { AuthUserDto, CreateUserDTO } from "../utils/dtos/user.dtos"
import { Auth as AuthService } from "../middlewares/auth"

export const setupUserRoutes = (container: IContainer) => {
    const userRouter: Router = Router()
    const userController = container.get(UserController)

    const authService = container.get(AuthService)

    userRouter.get(
        "/",
        authService.auth(),
        userController.getAllUsers.bind(userController)
    )

    userRouter.post(
        "/logout",
        authService.auth(),
        userController.logoutUser.bind(userController)
    )

    userRouter.post(
        "/",
        validator({
            body: CreateUserDTO,
        }),
        userController.createUser.bind(userController)
    )

    userRouter.post(
        "/admins",
        userController.createAdminUser.bind(userController)
    )

    userRouter.post(
        "/auth",
        validator({
            body: AuthUserDto,
        }),
        userController.authUser.bind(userController)
    )
    return userRouter
}
