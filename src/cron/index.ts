import cron from "node-cron"
import { StorageService } from "../services/providers/storage/storage.service"
import { Inject, Service } from "typedi"
import { IFileRepository } from "../utils/interfaces/repos.interfaces"

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
