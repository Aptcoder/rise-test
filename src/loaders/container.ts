import { init } from "../common/services/cache/redis.setup"
import UserRepository from "../repositories/user.repository"
import UserService from "../services/user.service"
import Container from "typedi"
import { RedisCache } from "cache-manager-redis-yet"
import { CacheService } from "../common/services/cache/cache.service"
import { StorageService } from "../common/services/storage/storage.service"
import FileService from "../services/file.service"
import FileRepository from "../repositories/file.repository"
import FolderRepository from "../repositories/folder.repository"
import FolderService from "../services/folder.service"
import { Auth as AuthService } from "../middlewares/auth"
import LoggerService from "../common/services/logger"
import { ILogger } from "../common/interfaces/services.interfaces"
import ReviewRepository from "../repositories/review.repository"
import { MemoryCache } from "cache-manager"

export const initContainer = async () => {
    Container.set({ id: "logger", type: LoggerService })
    const logger = Container.get<ILogger>("logger")
    const redisCache: RedisCache | MemoryCache = await init(logger)

    // external services
    const cacheService = new CacheService(redisCache)
    Container.set({ id: "cache_service", value: cacheService })
    Container.set({ id: "storage_service", type: StorageService })

    // Auth service
    Container.set({ id: "auth_service", type: AuthService })

    // repos
    Container.set({ id: "user_repository", type: UserRepository })
    Container.set({ id: "file_repository", type: FileRepository })
    Container.set({ id: "folder_repository", type: FolderRepository })
    Container.set({ id: "review_repository", type: ReviewRepository })

    // services
    Container.set({ id: "user_service", type: UserService })
    Container.set({ id: "file_service", type: FileService })
    Container.set({ id: "folder_service", type: FolderService })
    return Container
}
