import { IFile, IFolder, IUser } from "../utils/interfaces/entities.interfaces"
import { IFolderRepository } from "../utils/interfaces/repos.interfaces"
import { File } from "../entities/file.entity"
import { Folder } from "../entities/folder.entity"

export default class FolderRepository implements IFolderRepository {
    findById(id: string): Promise<IFolder | null> {
        return Folder.findOne({
            where: {
                id,
            },
        })
    }
    async create(name: string, files?: IFile[]) {
        const folder = Folder.create({
            name,
        })

        if (files) {
            folder.files = files as File[]
        }

        return folder.save()
    }

    async addFiles(files: IFile[], folder: IFolder) {
        console.log("foler", folder)
        folder.files = folder.files ? folder.files : []
        folder.files = folder.files.concat(files)
        return (folder as Folder).save()
    }

    async removeFile(fileId: string, folder: IFolder) {
        if (!folder.files) {
            return folder
        }

        folder.files = folder.files.filter((file) => {
            return file.id !== fileId
        })
        return (folder as Folder).save()
    }

    async findAll(): Promise<IFolder[]> {
        return Folder.find({})
    }

    async findByName(name: string) {
        return Folder.findOne({
            where: {
                name,
            },
        })
    }
}
