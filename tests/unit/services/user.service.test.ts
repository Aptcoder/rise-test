import Container from "typedi"
import { mockUserRepository } from "../..//mocks/user.repo";
import { IUserService } from "../../../src/utils/interfaces/services.interfaces";
import UserService from "../../../src/services/user.service";
import { ConflictError } from "../../../src/utils/errors";

describe('User service', () => {
    Container.set({ id: 'user_repository', value: mockUserRepository })
    Container.set({ id: 'user_service', type: UserService })
   
    const userService: IUserService = Container.get('user_service');

    beforeEach(() => {
        // jest.clearAllMocks();
        jest.resetAllMocks()
        jest.restoreAllMocks()
    })

    test('Service should create user', async() => {
        const userData = {
            firstName: 'Samuel',
            lastName: 'Testing',
            email: 'samuel@testing.com',
            password: 'hithere'
        }

        const findSpy = jest.spyOn(mockUserRepository, 'findByEmail').mockResolvedValue(null);
        const createSpy = jest.spyOn(mockUserRepository, 'create')
        const user = await userService.createUser(userData)

        expect(findSpy).toHaveBeenCalledTimes(1)
        expect(createSpy).toHaveBeenCalledTimes(1)
        expect(user.firstName).toBe(userData.firstName)
    })

    test('Service should throw error if user with email found', async () => {
        const userData = {
            firstName: 'Samuel',
            lastName: 'Testing',
            email: 'samuel@testing.com',
            password: 'hithere'
        }

        const findSpy = jest.spyOn(mockUserRepository, 'findByEmail')
        const createSpy = jest.spyOn(mockUserRepository, 'create')
    
        expect(async () => {
            await userService.createUser(userData)
        }).rejects.toBeInstanceOf(ConflictError)

        expect(findSpy).toHaveBeenCalledTimes(1)
        expect(createSpy).toHaveBeenCalledTimes(0)
    })
})