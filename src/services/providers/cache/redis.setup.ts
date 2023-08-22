import { caching } from "cache-manager"
import { RedisStore, redisStore } from "cache-manager-redis-yet"
import config from "config"

export const init = async () => {
    const redisHost = config.get<{
        host: string
    }>("redis").host

    var redisConfig = {
        url: `redis://${redisHost}:6379`,
        ttl: 60 * 60 * 60,
    }

    try {
        var redisCache = await caching(redisStore, redisConfig)

        // listen for redis connection error event
        var redisClient = redisCache.store.client

        await redisCache.set("let see", "hi")

        console.log("Redis connection done!")
        redisClient.on("error", (error: any) => {
            console.log("Redis Error", error)
        })

        return redisCache
    } catch (err) {
        console.log("Could not connect!")
        process.exit(1)
    }
}
