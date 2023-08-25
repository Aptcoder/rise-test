import Container from "typedi"
import {
    mockFileRepository,
    sampleFile,
    mockReviewRepository,
} from "../../mocks/repo.mocks"
import FileService from "../../../src/services/file.service"
import { BadRequestError, ConflictError } from "../../../src/common/errors"

describe("File service", () => {
    let fileService: FileService

    beforeEach(async () => {
        Container.set({ id: "file_repository", value: mockFileRepository })
        Container.set({ id: "review_repository", value: mockReviewRepository })
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

    test("Service should get file", async () => {
        const findSpy = jest.spyOn(mockFileRepository, "findById")
        const file = await fileService.getFile("key")

        expect(findSpy).toHaveBeenCalledTimes(1)
        expect(findSpy).toHaveBeenCalledWith("key")
    })

    test("Service should add admin review", async () => {
        const file = {
            ...sampleFile,
            mimeType: "image/jpeg",
        }
        const findSpy = jest
            .spyOn(mockFileRepository, "findById")
            .mockResolvedValue(file)

        const findReviewSpy = jest
            .spyOn(mockReviewRepository, "findOne")
            .mockResolvedValue(null)

        const reviewSpy = jest.spyOn(mockReviewRepository, "create")

        await fileService.markUnsafe("2", "4")

        expect(findSpy).toHaveBeenCalledTimes(1)
        expect(findReviewSpy).toHaveBeenCalledTimes(1)
        expect(reviewSpy).toHaveBeenCalledTimes(1)
        expect(reviewSpy).toHaveBeenCalledWith({
            fileId: file.id,
            reviewerId: "4",
            comment: expect.any(String),
        })
    })

    test("Service should not mark file unsafe if file is not video or image", async () => {
        const findSpy = jest.spyOn(mockFileRepository, "findById")
        const updateSpy = jest.spyOn(mockFileRepository, "update")

        expect(async () => {
            await fileService.markUnsafe("2", "4")
        }).rejects.toBeInstanceOf(BadRequestError)

        expect(findSpy).toHaveBeenCalledTimes(1)
        expect(updateSpy).toHaveBeenCalledTimes(0)
    })

    test("Service should not create multiple review of file", async () => {
        const file = {
            ...sampleFile,
            mimeType: "image/jpeg",
        }
        const findSpy = jest
            .spyOn(mockFileRepository, "findById")
            .mockResolvedValue(file)

        expect(async () => {
            await fileService.markUnsafe("2", "4")
        }).rejects.toBeInstanceOf(ConflictError)
    })
})
