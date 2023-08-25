import cron from "node-cron"
import { StorageService } from "../common/services/storage/storage.service"
import { Inject, Service } from "typedi"
import {
    IFileRepository,
    IReviewRepository,
} from "../common/interfaces/repos.interfaces"
import { IContainer } from "../common/types"
import { In } from "typeorm"

export const setupCron = async (container: IContainer) => {
    const cronScheduler = container.get(CronScheduler)

    const cron = await cronScheduler.schedule()
    cron.start()
}

@Service()
export class CronScheduler {
    constructor(
        @Inject("file_repository") public fileRepository: IFileRepository,
        @Inject("review_repository") public reviewRepository: IReviewRepository,
        @Inject("storage_service") public storageService: StorageService
    ) {
        this.storageService = storageService
        this.fileRepository = fileRepository
    }
    async schedule() {
        return cron.schedule("*/1 * * * *", async () => {
            console.log("starting cron job")
            await this.deleteUnsafeFiles()
            console.log("Ran cron job")
        })
    }

    async deleteUnsafeFiles() {
        let result =
            await this.reviewRepository.getFilesReviewedMoreThanTimes(2)
        let fileIds = result.map((file) => {
            return file.fileId
        })
        await this.fileRepository.updateMany(
            {
                id: In(fileIds) as unknown as string,
            },
            {
                deletedAt: new Date(),
            }
        )
    }
}
