import { IFile, IUser } from "../utils/interfaces/entities.interfaces"
import { IFileRepository } from "../utils/interfaces/repos.interfaces"
import { File } from "../entities/file.entity"
import { CreateFileInput } from "../services/file.service"
import { In } from "typeorm"

export default class FileRepository implements IFileRepository {
    async findById(id: string): Promise<IFile | null> {
        return File.findOne({
            where: {
                id,
            },
        })
    }
    async findByIds(ids: string[]): Promise<IFile[]> {
        const files = await File.find({
            where: {
                id: In(ids),
            },
        })
        return files
    }
    async create(fileData: CreateFileInput) {
        const file = File.create({
            ...fileData,
            originalName: fileData.originalname,
            mimeType: fileData.mimetype,
        })

        return file.save()
    }

    async findAll(): Promise<IFile[]> {
        return File.find({})
    }

    async findByKey(key: string): Promise<IFile | null> {
        const file = await File.findOne({
            where: {
                key,
            },
        })
        return file
    }

    async findByKeys(keys: string[]): Promise<IFile[]> {
        const files = await File.find({
            where: {
                key: In(keys),
            },
        })
        return files
    }
}
