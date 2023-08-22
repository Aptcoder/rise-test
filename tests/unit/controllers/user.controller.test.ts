import Container from "typedi"
import UserController from "../../../src/controllers/user.controller"
import { mockReq, mockRes } from "../../mocks/utils.mock"
import { mockUserService } from "../../../tests/mocks/service.mocks"
import { Request } from "express"

describe("User controller", () => {
    Container.set({ id: "user_service", value: mockUserService })
    const userController = Container.get(UserController)

    beforeEach(() => {
        jest.clearAllMocks()
    })

    test("Controller calls user service to create user", async () => {
        const createSpy = jest.spyOn(mockUserService, "createUser")

        await userController.createUser(mockReq, mockRes)
        expect(createSpy).toHaveBeenCalledTimes(1)
        expect(mockRes.send).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "User created",
            })
        )
    })

    test("Controller calls get users", async () => {
        const getSpy = jest.spyOn(mockUserService, "getUsers")

        await userController.getAllUsers(mockReq, mockRes)
        expect(getSpy).toHaveBeenCalledTimes(1)
        expect(mockRes.send).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "Users",
            })
        )
    })

    test("Controller auth calls auth user service", async () => {
        const authSpy = jest.spyOn(mockUserService, "auth")
        const req = {
            ...mockReq,
            body: {
                email: "sample",
                password: "hey",
            },
        } as Request
        await userController.authUser(req, mockRes)
        expect(authSpy).toHaveBeenCalledTimes(1)
        expect(mockRes.send).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "User auth successful",
            })
        )
    })
})
