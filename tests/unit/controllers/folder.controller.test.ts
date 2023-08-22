import Container from "typedi"
import UserController from "../../../src/controllers/user.controller"
import { mockReq, mockRes } from "../../mocks/utils.mock"
import { mockFolderService } from "../../../tests/mocks/service.mocks"
import { Request } from "express"
import FolderController from "../../../src/controllers/folder.controller"
import { sampleFile } from "../../mocks/repo.mocks"

describe("Folder controller", () => {
    Container.set({ id: "folder_service", value: mockFolderService })
    const folderController = Container.get(FolderController)

    beforeEach(() => {
        jest.clearAllMocks()
    })

    test("Controller calls folder service to create file", async () => {
        const createSpy = jest.spyOn(mockFolderService, "createFolder")
        await folderController.createFolder(mockReq, mockRes)
        expect(createSpy).toHaveBeenCalledTimes(1)
        expect(mockRes.send).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "Folder created",
            })
        )
    })

    test("Controller calls get folders", async () => {
        const getSpy = jest.spyOn(mockFolderService, "getFolders")

        await folderController.getFolders(mockReq, mockRes)
        expect(getSpy).toHaveBeenCalledTimes(1)
        expect(mockRes.send).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "Folders",
            })
        )
    })
})
