import Container from "typedi"
import UserController from "../../../src/controllers/user.controller"
import { mockReq, mockRes } from "../../mocks/utils.mock"
import { mockFileService } from "../../../tests/mocks/service.mocks"
import { Request } from "express"
import FileController from "../../../src/controllers/file.controller"
import { sampleFile } from "../../mocks/repo.mocks"

describe("File controller", () => {
    Container.set({ id: "file_service", value: mockFileService })
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
})
