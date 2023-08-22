import { IFile, IUser } from "../utils/interfaces/entities.interfaces"
import { IFileRepository } from "../utils/interfaces/repos.interfaces"
import { File } from "../entities/file.entity"
import { CreateFileInput } from "../services/file.service"

export default class FileRepository implements IFileRepository {
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
}