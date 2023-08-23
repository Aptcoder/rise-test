import config from "config"
import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
import { Inject, Service } from "typedi"
import { Cache } from "cache-manager"
import { IUser } from "../utils/interfaces/entities.interfaces"

@Service()
export class Auth {
    constructor(@Inject("cache_service") private cache: Cache) {}

    private verifyToken(token: string) {
        return new Promise((resolve, reject) => {
            jwt.verify(
                token,
                config.get<string>("jwtSecret"),
                (err: any, decoded: unknown) => {
                    if (err) {
                        return reject(err)
                    }
                    return resolve(decoded)
                }
            )
        })
    }

    public auth =
        (roles: string[] = ["guest", "admin"]) =>
        async (req: Request, res: Response, next: NextFunction) => {
            const token = req.header("x-auth")
            if (!token) {
                return res.status(401).send({
                    message: "Not allowed, Kindly log in",
                    status: "failed",
                    data: {},
                })
            }

            try {
                const cachedToken = await this.cache.get(token)
                if (!cachedToken) {
                    return res.status(401).send({
                        message: "Not authorized, kindly log in",
                        status: "failed",
                        data: {},
                    })
                }
                const decoded = await this.verifyToken(token)
                req.user = decoded as IUser

                const { user } = req
                if (!user)
                    return res.status(401).send({
                        message: "Not authorized, kindly log in",
                        status: "failed",
                        data: {},
                    })

                if (!roles.includes(user.role.toString()))
                    return res.status(403).send({
                        message: "Not authorized.",
                        status: "failed",
                        data: {},
                    })

                return next()
            } catch (err) {
                return res.status(401).send({
                    message: "Not authorized, kindly log in",
                    status: "failed",
                    data: {},
                })
            }
        }
}
