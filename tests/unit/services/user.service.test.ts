import Container from "typedi"
import { mockUserRepository } from "../../mocks/repo.mocks"
import { IUserService } from "../../../src/utils/interfaces/services.interfaces"
import UserService from "../../../src/services/user.service"
import { APIError, ConflictError } from "../../../src/utils/errors"
import { caching } from "cache-manager"
import { CacheService } from "../../../src/services/providers/cache/cache.service"

describe("User service", () => {
    let userService: UserService
    let cacheService: CacheService

    beforeEach(async () => {
        Container.set({ id: "user_repository", value: mockUserRepository })
        const cache = await caching("memory")
        cacheService = new CacheService(cache)
        Container.set({ id: "cache_service", value: cacheService })
        Container.set({ id: "user_service", type: UserService })

        userService = Container.get("user_service")

        jest.restoreAllMocks()
        jest.clearAllMocks()
    })

    test("Service should create user", async () => {
        const userData = {
            firstName: "Samuel",
            lastName: "Testing",
            email: "samuel@testing.com",
            password: "hithere",
        }

        const findSpy = jest
            .spyOn(mockUserRepository, "findByEmail")
            .mockResolvedValue(null)
        const createSpy = jest.spyOn(mockUserRepository, "create")
        const user = await userService.createUser(userData)

        expect(findSpy).toHaveBeenCalledTimes(1)
        expect(createSpy).toHaveBeenCalledTimes(1)
        expect(user.firstName).toBe(userData.firstName)
    })

    test("Service should throw error if user with email found", async () => {
        const userData = {
            firstName: "Samuel",
            lastName: "Testing",
            email: "samuel@testing.com",
            password: "hithere",
        }

        const findSpy = jest.spyOn(mockUserRepository, "findByEmail")
        const createSpy = jest.spyOn(mockUserRepository, "create")

        expect(async () => {
            await userService.createUser(userData)
        }).rejects.toBeInstanceOf(ConflictError)

        expect(findSpy).toHaveBeenCalledTimes(1)
        expect(createSpy).toHaveBeenCalledTimes(0)
    })

    test("Service should auth user", async () => {
        const authData = {
            email: "damn",
            password: "good",
        }

        const cacheSpy = jest.spyOn(cacheService, "set")
        const findSpy = jest.spyOn(mockUserRepository, "findByEmail")
        const compareSpy = jest
            .spyOn(userService, "comparePassword")
            .mockResolvedValue(true)
        const generateSpy = jest.spyOn(userService, "generateToken")

        const result = await userService.auth(authData)
        expect(findSpy).toHaveBeenCalledTimes(1)
        expect(compareSpy).toHaveBeenCalledTimes(1)
        expect(generateSpy).toHaveBeenCalledTimes(1)
        expect(cacheSpy).toHaveBeenCalledTimes(1)
        expect(result).toMatchObject(
            expect.objectContaining({
                accessToken: expect.any(String),
            })
        )
    })

    test("Service should not auth user if password invalid", async () => {
        const authData = {
            email: "damn",
            password: "good",
        }

        const findSpy = jest.spyOn(mockUserRepository, "findByEmail")
        const generateSpy = jest.spyOn(userService, "generateToken")

        expect(async () => {
            await userService.auth(authData)
        }).rejects.toBeInstanceOf(APIError)

        expect(findSpy).toHaveBeenCalledTimes(1)
        expect(generateSpy).not.toHaveBeenCalled()
    })
})
