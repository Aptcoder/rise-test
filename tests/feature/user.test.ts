import express, { Application } from "express"
import { setupForTests } from "../setup"
import { Connection, getConnection } from "typeorm"
import request from "supertest"
import User, { UserRole } from "../../src/entities/user.entity"
import bcrypt from "bcrypt"
import {
    useSeederFactory,
    useDataSource,
    prepareSeederFactories,
} from "typeorm-extension"
import { userFactory } from "../../src/database/factories/user.factory"
import UserService from "src/services/user.service"
import { IUser } from "src/common/interfaces/entities.interfaces"

describe("/users", () => {
    let app: Application
    let connection: Connection
    let adminUser: IUser
    let adminAccessToken: string
    let token
    beforeAll(async () => {
        app = express()
        const container = await setupForTests({ expressApp: app })
        connection = getConnection("rise")

        const userService = container.get<UserService>("user_service")
        const ds = await useDataSource()
        await ds.dropDatabase()
        await ds.runMigrations()

        const password = await bcrypt.hash("password", 10)
        prepareSeederFactories([userFactory])
        const user = await useSeederFactory(User).make({
            email: "sample@sample.com",
            password: password,
            role: UserRole.ADMIN,
        })
        await user.save()

        const user2 = await useSeederFactory(User).make({
            email: "sample2@sample.com",
            password: password,
        })
        await user2.save()
        ;({ accessToken: adminAccessToken, user: adminUser } =
            await userService.auth({
                email: "sample@sample.com",
                password: "password",
            }))
    })
    describe("GET /users", () => {
        test("Should fetch all users", async () => {
            const res = await request(app)
                .get("/api/users")
                .set("Authorization", `Bearer ${adminAccessToken}`)
            expect(res.statusCode).toBe(200)
            expect(res.body).toMatchObject({
                status: "success",
                data: {
                    users: expect.any(Array),
                },
            })
        })

        test("Should not fetch users if user not authenticated", async () => {
            const res = await request(app).get("/api/users")
            expect(res.statusCode).toBe(401)
            expect(res.body).toMatchObject({
                status: "failed",
            })
        })
    })

    describe("POST /api/users/auth - authenticate user", () => {
        test("Should auth user", async () => {
            const res = await request(app).post("/api/users/auth").send({
                email: "sample2@sample.com",
                password: "password",
            })
            expect(res.statusCode).toBe(200)
            expect(res.body).toMatchObject({
                status: "success",
                data: {
                    token: expect.any(String),
                    user: expect.objectContaining({
                        email: "sample2@sample.com",
                    }),
                },
            })
        })

        test("Should not auth user if password is wrong", async () => {
            const res = await request(app).post("/api/users/auth").send({
                email: "sample2@sample.com",
                password: "wrong password",
            })
            expect(res.statusCode).toBe(401)
            expect(res.body).toMatchObject({
                status: "failed",
            })
        })
    })

    describe("POST /api/users/ - create new user", () => {
        test("Should create new user", async () => {
            const res = await request(app).post("/api/users").send({
                email: "created@sample.com",
                password: "StrongPassword20?",
                firstName: "created",
                lastName: "user",
            })
            expect(res.statusCode).toBe(201)
            expect(res.body).toMatchObject({
                status: "success",
                data: {
                    user: expect.objectContaining({
                        email: "created@sample.com",
                    }),
                },
            })

            const user = await User.findOne({
                where: {
                    email: "created@sample.com",
                },
            })
            expect(user).toBeTruthy()
        })

        test("Should not create new user with weak password", async () => {
            const res = await request(app).post("/api/users").send({
                email: "created@sample.com",
                password: "weakassword",
                firstName: "created",
                lastName: "user",
            })
            expect(res.statusCode).toBe(400)
            expect(res.body).toMatchObject({
                status: "failed",
            })
        })

        test("Should not create new user with invalid email", async () => {
            const res = await request(app).post("/api/users").send({
                email: "invalidsample.com",
                password: "StrongPassword20?",
                firstName: "created",
                lastName: "user",
            })
            expect(res.statusCode).toBe(400)
            expect(res.body).toMatchObject({
                status: "failed",
            })
        })
    })

    afterAll(() => {
        connection.close()
    })
})
