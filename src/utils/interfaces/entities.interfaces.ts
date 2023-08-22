import { UserRole } from "../../entities/user.entity"

export interface IUser {
    id: string
    email: string
    firstName: string
    lastName: string
    password: string
    dateJoined: Date

    role: UserRole

    save(): Promise<IUser>
}

export interface IFile {
    id: string
    originalName: string
    mimeType: string
    size: number
    location: string
    deletedAt: Date
    key: string
    createdAt: Date
}
