import Container from "typedi"
import {
    mockFileRepository,
    mockFolderRepository,
    sampleFile,
} from "../../mocks/repo.mocks"
import FolderService from "../../../src/services/folder.service"

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

        const findSpy = jest.spyOn(mockFileRepository, "findByKeys")
        const createSpy = jest.spyOn(mockFolderRepository, "create")
        const folder = await folderService.createFolder(folderData)

        expect(findSpy).toHaveBeenCalledTimes(1)
        expect(createSpy).toHaveBeenCalledTimes(1)
        expect(folder.name).toBe(folderData.name)
    })
})
