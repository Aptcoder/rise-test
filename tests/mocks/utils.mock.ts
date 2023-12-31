import { Response, Request, NextFunction } from "express"

export const mockReq = {
    user: {
        email: "sample@gmail.com",
        id: "3",
    },
} as any as Request

export const mockRes = {
    status: jest.fn(() => {
        return mockRes
    }),
    send: jest.fn(),
} as unknown as Response

export const mockNext = (err?: any) => {
    if (err) {
        console.log("Error from MockNext", err)
        throw new Error("Error from mockNext")
    }
}
