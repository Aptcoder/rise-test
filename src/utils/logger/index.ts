import { Service } from "typedi"
import winston from "winston"
import { ILogger } from "../interfaces/services.interfaces"

@Service()
export default class LoggerService implements ILogger {
    private readonly logger
    constructor() {
        this.logger = winston.createLogger({
            level: "info",
            format: winston.format.json(),
            transports: [
                new winston.transports.Console({
                    format: winston.format.combine(
                        winston.format.colorize(),
                        winston.format.simple()
                    ),
                }),
            ],
        })
    }

    info(message: string) {
        return this.logger.info(message)
    }

    warn(message: string) {
        return this.logger.info(message)
    }

    error(message: string, meta: {}) {
        return this.logger.error(message, meta)
    }
}
