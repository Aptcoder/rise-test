import { CronScheduler } from "../cron"
import { IContainer } from "../utils/types"

export const setupCron = async (container: IContainer) => {
    const cronScheduler = container.get(CronScheduler)

    const cron = await cronScheduler.schedule()
    cron.start()
}
