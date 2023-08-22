import { init } from "../services/providers/cache/redis.setup"
import UserRepository from "../repositories/user.repository"
import UserService from "../services/user.service"
import Container from "typedi"
import { RedisCache } from "cache-manager-redis-yet"
import { CacheService } from "../services/providers/cache/cache.service"
import { StorageService } from "../services/providers/storage/stoarage.service"
import FileService from "../services/file.service"
import FileRepository from "../repositories/file.repository"

export const initContainer = async () => {
    const redisCache: RedisCache = await init()

    // external services
    const cacheService = new CacheService(redisCache)
    Container.set({ id: "cache_service", value: cacheService })

    Container.set({ id: "storage_service", type: StorageService })

    Container.set({ id: "user_repository", type: UserRepository })
    Container.set({ id: "file_repository", type: FileRepository })

    // services
    Container.set({ id: "user_service", type: UserService })
    Container.set({ id: "file_service", type: FileService })
    return Container
}
