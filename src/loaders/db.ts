import { createConnection, Connection } from "typeorm"
import config from "config"
import path from "path"
import { ILogger } from "src/common/interfaces/services.interfaces"

const entityPath = path.resolve(__dirname, "..", "entities")

export default (logger: ILogger): Promise<void | Connection> =>
    createConnection({
        name: "rise",
        type: "postgres",
        url: config.get<string>("database_url"),
        entities: [`${entityPath}/*.{js,ts}`],
        logging: false,
        synchronize: false,
    })
        .then(() => {
            logger.info("Sucessfully connected to db")
        })
        .catch((err: Error) => {
            logger.error(`Could not connect to db: ${err}`)
            process.exit(1)
        })
