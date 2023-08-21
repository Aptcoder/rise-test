import Container from "typedi";
import UserController from "../../../src/controllers/user.controller";
import { mockNext, mockReq, mockRes } from "../../mocks/utils.mock";
import { mockUserService } from "../../../tests/mocks/service.mocks";

describe('User controller', () => {
    Container.set({ id: 'user_service', value: mockUserService})
    const userController = Container.get(UserController)

    beforeEach(() => {
        jest.clearAllMocks()
    })
    
    test('Controller calls user service to create user', async () => {
        const createSpy = jest.spyOn(mockUserService, 'createUser')

        await userController.createUser(mockReq, mockRes, mockNext)
        expect(createSpy).toHaveBeenCalledTimes(1)
        expect(mockRes.send).toHaveBeenCalledWith(expect.objectContaining({
            message: 'User created'
        }))
    })

    test('Controller calls get users', async () => {
        const getSpy = jest.spyOn(mockUserService, 'getUsers')

        await userController.getAllUsers(mockReq, mockRes, mockNext)
        expect(getSpy).toHaveBeenCalledTimes(1)
        expect(mockRes.send).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Users'
        }))
    })
})