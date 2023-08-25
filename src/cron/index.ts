import cron from "node-cron"
import { StorageService } from "../common/services/storage/storage.service"
import { Inject, Service } from "typedi"
import {
    IFileRepository,
    IReviewRepository,
} from "../common/interfaces/repos.interfaces"
import { IContainer } from "../common/types"
import { In } from "typeorm"
import { ILogger } from "src/common/interfaces/services.interfaces"

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
        @Inject("storage_service") public storageService: StorageService,
        @Inject("logger") public logger: ILogger
    ) {
        this.storageService = storageService
        this.fileRepository = fileRepository
    }
    async schedule() {
        return cron.schedule("*/30 * * * *", async () => {
            this.logger.info("starting cron job!")
            await this.deleteUnsafeFiles()
            this.logger.info("ran cron job!")
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
