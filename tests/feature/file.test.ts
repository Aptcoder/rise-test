import express, { Application } from "express"
import { setupDb, setupForTests } from "../setup"
import { Connection, getConnection } from "typeorm"
import request from "supertest"
import User, { UserRole } from "../../src/entities/user.entity"
import { File } from "../../src/entities/file.entity"
import bcrypt from "bcrypt"
import { useSeederFactory } from "typeorm-extension"
import { userFactory } from "../../src/database/factories/user.factory"
import UserService from "../../src/services/user.service"
import { IFile, IUser } from "../../src/common/interfaces/entities.interfaces"
import path from "path"
import { readFileSync } from "fs"
import { Review } from "../../src/entities/review.entity"
import { faker } from "@faker-js/faker"
import { createUsers } from "../setup/factories/user"

describe("/api/files", () => {
    let app: Application
    let connection: Connection
    let adminUser: IUser
    let guestUser: IUser
    let adminAccessToken: string
    let token: string
    let testFile: IFile
    beforeAll(async () => {
        app = express()
        const container = await setupForTests({ expressApp: app })
        connection = getConnection("rise")

        const userService = container.get<UserService>("user_service")
        const ds = await setupDb()
        await createUsers()
        ;({ accessToken: adminAccessToken, user: adminUser } =
            await userService.auth({
                email: "sample@sample.com",
                password: "password",
            }))
        ;({ accessToken: token, user: guestUser } = await userService.auth({
            email: "sample2@sample.com",
            password: "password",
        }))

        const f = await useSeederFactory(File).make()
        testFile = await f.save()
    })
    describe("GET /api/files", () => {
        test("Should fetch all files", async () => {
            const res = await request(app)
                .get("/api/files")
                .set("Authorization", `Bearer ${token}`)
            expect(res.statusCode).toBe(200)
            expect(res.body).toMatchObject({
                status: "success",
                data: {
                    files: expect.any(Array),
                },
            })
        })

        test("Should not fetch files if user not authenticated", async () => {
            const res = await request(app).get("/api/files")
            expect(res.statusCode).toBe(401)
            expect(res.body).toMatchObject({
                status: "failed",
            })
        })
    })

    describe("POST /api/files", () => {
        test("Should upload file and create file", async () => {
            const filePath = path.resolve(
                __dirname,
                "../mocks/mockfiles/read.txt"
            )
            const file = readFileSync(filePath)
            const res = await request(app)
                .post("/api/files")
                .set("Authorization", `Bearer ${token}`)
                .set("Accept", "application/json")
                .set("Content-Type", "multipart/form-data")
                .attach("file", file, {
                    filename: "test-file",
                })
            expect(res.statusCode).toBe(200)
            expect(res.body).toMatchObject({
                status: "success",
            })

            const createdFile = await File.findOne({
                where: {
                    originalName: "test-file",
                },
            })

            expect(createdFile).toBeTruthy()
        })
    })

    describe("PATCH /:fileId/mark_as_unsafe", () => {
        test("Should not create review if file not found", async () => {
            const res = await request(app)
                .patch(`/api/files/${faker.string.uuid()}/mark_as_unsafe`)
                .set("Authorization", `Bearer ${adminAccessToken}`)
                .send({
                    comment: "File has nudity",
                })
            expect(res.statusCode).toBe(404)
            expect(res.body).toMatchObject({
                status: "failed",
            })

            const review = await Review.findOne({
                where: {
                    fileId: testFile.id,
                },
            })

            expect(review).toBeFalsy()
        })

        test("Should create review for file marked as undafe", async () => {
            const res = await request(app)
                .patch(`/api/files/${testFile.id}/mark_as_unsafe`)
                .set("Authorization", `Bearer ${adminAccessToken}`)
                .send({
                    comment: "File has nudity",
                })
            expect(res.statusCode).toBe(200)
            expect(res.body).toMatchObject({
                status: "success",
            })

            const review = await Review.findOne({
                where: {
                    fileId: testFile.id,
                },
            })

            expect(review).toBeTruthy()
        })
    })

    afterAll(() => {
        connection.close()
    })
})
