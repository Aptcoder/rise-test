import cron from "node-cron"
import { StorageService } from "../common/services/storage/storage.service"
import { Inject, Service } from "typedi"
import { IFileRepository } from "../common/interfaces/repos.interfaces"
import { IContainer } from "../common/types"

export const setupCron = async (container: IContainer) => {
    const cronScheduler = container.get(CronScheduler)

    const cron = await cronScheduler.schedule()
    cron.start()
}

@Service()
export class CronScheduler {
    constructor(
        @Inject("file_repository") public fileRepository: IFileRepository,
        @Inject("storage_service") public storageService: StorageService
    ) {
        this.storageService = storageService
        this.fileRepository = fileRepository
    }
    async schedule() {
        return cron.schedule("*/30 * * * *", async () => {
            console.log("starting cron job")
            await this.deleteUnsafeFiles()
            console.log("Ran cron job")
        })
    }

    async deleteUnsafeFiles() {
        await this.fileRepository.updateMany(
            {
                safe: false,
            },
            {
                deletedAt: new Date(),
            }
        )
    }
}
