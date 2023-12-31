/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

import express, { Application, NextFunction, Response, Request } from "express"
import morgan from "morgan"
import { IContainer } from "../common/types"
import { setupRoutes } from "../routes/api.routes"
import { create, engine } from "express-handlebars"
import { APIError } from "../common/errors"
import { ILogger } from "../common/interfaces/services.interfaces"
import { MulterError } from "multer"

const loadApp = ({
    app,
    Container,
}: {
    app: Application
    Container: IContainer
}) => {
    const logger = Container.get<ILogger>("logger")
    const hbs = create({
        helpers: {
            isType(mimeType: string, type: string, options: any) {
                const fileType = mimeType.split("/")[0]
                if (fileType === type) {
                    return options.fn(this)
                }

                return options.inverse(this)
            },
        },
    })

    // Register `hbs.engine` with the Express app.
    app.engine("handlebars", hbs.engine)
    app.set("view engine", "handlebars")
    app.set("views", "./src/views")

    app.use(express.json())
    app.use(morgan("combined"))

    app.use("/api", setupRoutes(Container))

    app.use("*", (req: Request, res: Response) =>
        res.status(404).send({
            status: "failed",
            message: "Endpoint not found",
            data: {},
        })
    )

    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
        if (!(err instanceof APIError)) {
            logger.error(`Unexpected error: ${err}`)
        }
        if (err instanceof MulterError && err.code == "LIMIT_FILE_SIZE") {
            return res
                .status(413)
                .send({ status: "failed", message: err.message })
        }

        if (err.type && err.type === "entity.parse.failed") {
            return res
                .status(400)
                .send({ status: "failed", message: err.message }) // Bad request
        }
        const message = err.message || "Something unexpected happened"
        return res.status(err.status || 500).send({
            status: "failed",
            message,
        })
    })

    return app
}

export { loadApp }
