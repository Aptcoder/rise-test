import Container from "typedi"
import { mockNext, mockReq, mockRes } from "../../mocks/utils.mock"
import { mockFolderService } from "../../../tests/mocks/service.mocks"
import { Request } from "express"
import FolderController from "../../../src/controllers/folder.controller"

describe("Folder controller", () => {
    Container.set({ id: "folder_service", value: mockFolderService })
    const folderController = Container.get(FolderController)

    beforeEach(() => {
        jest.clearAllMocks()
    })

    test("Controller calls folder service to create file", async () => {
        const createSpy = jest.spyOn(mockFolderService, "createFolder")
        await folderController.createFolder(mockReq, mockRes, mockNext)
        expect(createSpy).toHaveBeenCalledTimes(1)
        expect(mockRes.send).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "Folder created",
            })
        )
    })

    test("Controller calls get folders", async () => {
        const getSpy = jest.spyOn(mockFolderService, "getFolders")

        await folderController.getFolders(mockReq, mockRes, mockNext)
        expect(getSpy).toHaveBeenCalledTimes(1)
        expect(mockRes.send).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "Folders",
            })
        )
    })

    test("Controller calls add file to folder", async () => {
        const addSpy = jest.spyOn(mockFolderService, "addFiles")

        const req = {
            ...mockReq,
            params: {
                folderId: "yea",
            },
            body: {
                files: [],
            },
        } as unknown as Request

        await folderController.addFilesToFolder(req, mockRes, mockNext)
        expect(addSpy).toHaveBeenCalledTimes(1)
        expect(mockRes.send).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "Files added to folder",
            })
        )
    })

    test("Controller calls remove file to folder", async () => {
        const removeSpy = jest.spyOn(mockFolderService, "removeFile")

        const req = {
            ...mockReq,
            params: {
                folderId: "yea",
                fileId: "oh",
            },
        } as unknown as Request

        await folderController.removeFileFromFolder(req, mockRes, mockNext)
        expect(removeSpy).toHaveBeenCalledTimes(1)
        expect(mockRes.send).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "File removed from folder",
            })
        )
    })
})
