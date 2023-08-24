import { createConnection, Connection } from "typeorm"
import config from "config"
import path from "path"

const entityPath = path.resolve(__dirname, "..", "entities")

export default (): Promise<void | Connection> =>
    createConnection({
        type: "postgres",
        url: config.get<string>("database_url"),
        entities: [`${entityPath}/*.{js,ts}`],
        logging: false,
        synchronize: false,
    })
        .then(() => {
            console.log("Sucessfully connected to db")
        })
        .catch((err: Error) => {
            console.log("Could not connect to db", err)
            process.exit(1)
        })
