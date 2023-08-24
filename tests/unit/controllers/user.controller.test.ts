import Container from "typedi"
import UserController from "../../../src/controllers/user.controller"
import { mockNext, mockReq, mockRes } from "../../mocks/utils.mock"
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

        await userController.createUser(mockReq, mockRes, mockNext)
        expect(createSpy).toHaveBeenCalledTimes(1)
        expect(mockRes.send).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "User created",
            })
        )
    })

    test("Controller calls get users", async () => {
        const getSpy = jest.spyOn(mockUserService, "getUsers")

        await userController.getAllUsers(mockReq, mockRes, mockNext)
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
        await userController.authUser(req, mockRes, mockNext)
        expect(authSpy).toHaveBeenCalledTimes(1)
        expect(mockRes.send).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "User auth successful",
            })
        )
    })

    test("Controller logout should log user out", async () => {
        const logSpy = jest.spyOn(mockUserService, "logoutUser")
        const req = {
            ...mockReq,
            user: {
                id: "random",
            },
        } as Request
        await userController.logoutUser(req, mockRes, mockNext)
        expect(logSpy).toHaveBeenCalledTimes(1)
        expect(logSpy).toHaveBeenCalledWith("random")
        expect(mockRes.send).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "Logged user out",
            })
        )
    })
})
