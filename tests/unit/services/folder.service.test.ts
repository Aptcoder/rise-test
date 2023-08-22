import Container from "typedi"
import {
    mockFileRepository,
    mockFolderRepository,
    sampleFile,
} from "../../mocks/repo.mocks"
import FolderService from "../../../src/services/folder.service"
import { NotFoundError } from "../../../src/utils/errors"

describe("Folder service", () => {
    let folderService: FolderService

    beforeEach(async () => {
        Container.set({ id: "file_repository", value: mockFileRepository })
        Container.set({ id: "folder_repository", value: mockFolderRepository })
        Container.set({ id: "folder_service", type: FolderService })

        folderService = Container.get("folder_service")

        jest.restoreAllMocks()
        jest.clearAllMocks()
    })

    test("Service should create folder", async () => {
        const folderData = {
            name: "Hi",
            files: ["sample"],
        }

        const findFolderSpy = jest
            .spyOn(mockFolderRepository, "findByName")
            .mockResolvedValue(null)
        const findSpy = jest.spyOn(mockFileRepository, "findByKeys")
        const createSpy = jest.spyOn(mockFolderRepository, "create")
        const folder = await folderService.createFolder(folderData)

        expect(findSpy).toHaveBeenCalledTimes(1)
        expect(findFolderSpy).toHaveBeenCalledTimes(1)
        expect(createSpy).toHaveBeenCalledTimes(1)
        expect(folder.name).toBe(folderData.name)
    })

    test("Service should create folder if file not found", async () => {
        const folderData = {
            name: "Hi",
            files: ["sample"],
        }

        const findFolderSpy = jest
            .spyOn(mockFolderRepository, "findByName")
            .mockResolvedValue(null)
        const findSpy = jest
            .spyOn(mockFileRepository, "findByKeys")
            .mockResolvedValue([])
        const createSpy = jest.spyOn(mockFolderRepository, "create")

        expect(async () => {
            await folderService.createFolder(folderData)
        }).rejects.toBeInstanceOf(NotFoundError)

        expect(findFolderSpy).toHaveBeenCalledTimes(1)
        expect(createSpy).toHaveBeenCalledTimes(0)
    })

    test("Service should add file to folder", async () => {
        const findFileSpy = jest.spyOn(mockFileRepository, "findByIds")
        const findFolderSpy = jest.spyOn(mockFolderRepository, "findById")
        const addSPy = jest.spyOn(mockFolderRepository, "addFiles")

        await folderService.addFiles("samp", ["sa"])

        expect(findFileSpy).toHaveBeenCalledTimes(1)
        expect(findFolderSpy).toHaveBeenCalledTimes(1)
        expect(addSPy).toHaveBeenCalledTimes(1)
    })

    test("Service should remove file from folder", async () => {
        const findFolderSpy = jest.spyOn(mockFolderRepository, "findById")
        const removeSpy = jest.spyOn(mockFolderRepository, "removeFile")

        await folderService.removeFile("samp", "sa")

        expect(findFolderSpy).toHaveBeenCalledTimes(1)
        expect(removeSpy).toHaveBeenCalledTimes(1)
    })
})
