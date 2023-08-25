import { IsArray, IsOptional, IsString } from "class-validator"

export class KeyDTO {
    @IsString()
    key: string
}
export class FileIdDTO {
    @IsString()
    fileId: string
}

export class CreateFolderDTO {
    @IsString()
    name: string

    @IsArray()
    @IsOptional()
    files: string[] = []
}

export class AddFileToFolderBodyDTO {
    @IsArray()
    files: string
}

export class FolderParamDTO {
    @IsString()
    folderId: string
}

export class RemoveFileParam extends FolderParamDTO {
    @IsString()
    fileId: string
}

export class ReviewFileDTO {
    @IsString()
    @IsOptional()
    comment: string
}
