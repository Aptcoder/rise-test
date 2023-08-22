import { init } from "../services/providers/cache/redis.setup"
import UserRepository from "../repositories/user.repository"
import UserService from "../services/user.service"
import Container from "typedi"
import { RedisCache } from "cache-manager-redis-yet"
import { CacheService } from "../services/providers/cache/cache.service"
import { StorageService } from "src/services/providers/storage/stoarage.service"

export const initContainer = async () => {
    const redisCache: RedisCache = await init()

    // external services
    const cacheService = new CacheService(redisCache)
    Container.set({ id: "cache_service", value: cacheService })

    Container.set({ id: "storage_service", type: StorageService })

    Container.set({ id: "user_repository", type: UserRepository })

    // services
    Container.set({ id: "user_service", type: UserService })
    return Container
}
