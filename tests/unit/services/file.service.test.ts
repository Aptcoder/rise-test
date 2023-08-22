import Container from "typedi"
import { mockFileRepository, sampleFile } from "../../mocks/repo.mocks"
import FileService from "../../../src/services/file.service"

describe("User service", () => {
    let fileService: FileService

    beforeEach(async () => {
        Container.set({ id: "file_repository", value: mockFileRepository })
        Container.set({ id: "file_service", type: FileService })

        fileService = Container.get("file_service")

        jest.restoreAllMocks()
        jest.clearAllMocks()
    })

    test("Service should create file", async () => {
        const fileData = {
            ...sampleFile,
            originalname: sampleFile.originalName,
            mimetype: "application/pdf",
        }

        const createSpy = jest.spyOn(mockFileRepository, "create")
        const file = await fileService.createFile(fileData)

        expect(createSpy).toHaveBeenCalledTimes(1)
        expect(file.originalName).toBe(fileData.originalname)
    })
})
