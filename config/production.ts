import dotenv from "dotenv"

dotenv.config()

export default {
    port: process.env.PORT,
    jwtSecret: process.env.JWT_SECRET,
    database: {
        host: process.env.DB_HOST,
        port: 5432,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        ssl: true,
    },
    redis: {
        host: process.env.REDIS_HOST,
        port: 6379,
    },
    aws: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
        region: "us-easy-1",
    },
}
