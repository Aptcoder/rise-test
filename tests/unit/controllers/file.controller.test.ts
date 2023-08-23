import Container from "typedi"
import UserController from "../../../src/controllers/user.controller"
import { mockReq, mockRes } from "../../mocks/utils.mock"
import {
    mockFileService,
    mockStorageService,
} from "../../../tests/mocks/service.mocks"
import { Request, Response } from "express"
import FileController from "../../../src/controllers/file.controller"
import { sampleFile } from "../../mocks/repo.mocks"
import {
    createWriteStream,
    readFileSync,
    truncateSync,
    unlink,
    unlinkSync,
} from "fs"
import { readFile } from "fs/promises"

describe("File controller", () => {
    Container.set({ id: "file_service", value: mockFileService })
    Container.set({ id: "storage_service", value: mockStorageService })
    const fileController = Container.get(FileController)

    beforeEach(() => {
        jest.clearAllMocks()
    })

    test("Controller calls file service to create file", async () => {
        const createSpy = jest.spyOn(mockFileService, "createFile")

        const req = {
            ...mockReq,
            file: {
                ...sampleFile,
            },
        } as unknown as Request

        await fileController.createFile(req, mockRes)
        expect(createSpy).toHaveBeenCalledTimes(1)
        expect(mockRes.send).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "File created",
            })
        )
    })

    test("Controller calls get files", async () => {
        const getSpy = jest.spyOn(mockFileService, "getFiles")

        await fileController.getFiles(mockReq, mockRes)
        expect(getSpy).toHaveBeenCalledTimes(1)
        expect(mockRes.send).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "Files",
            })
        )
    })

    test("Controller marks file unsafe", async () => {
        const markSpy = jest.spyOn(mockFileService, "markUnsafe")

        const req = {
            ...mockReq,
            params: {
                fileId: "a",
            },
        } as unknown as Request

        await fileController.markFileUnSafe(req, mockRes)
        expect(markSpy).toHaveBeenCalledTimes(1)
        expect(mockRes.send).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "File marked as unsafe",
            })
        )
    })

    test("Controller downloads file", async () => {
        // clear file for test
        truncateSync("./tests/mocks/mockfiles/write.txt", 0)

        const getSpy = jest.spyOn(mockFileService, "getFile")
        const res = createWriteStream(
            "./tests/mocks/mockfiles/write.txt"
        ) as unknown as Response
        const req = {
            ...mockReq,
            params: {
                fileId: "a",
            },
        } as unknown as Request

        await fileController.downloadFile(req, res)
        expect(getSpy).toHaveBeenCalledTimes(1)

        res.on("close", () => {
            const text = readFileSync("./tests/mocks/mockfiles/write.txt")
            expect(text.toString()).toBe("just test")
        })
    })
})
