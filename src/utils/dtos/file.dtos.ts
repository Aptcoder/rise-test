import { IsArray, IsOptional, IsString } from "class-validator"

export class KeyDTO {
    @IsString()
    key: string
}

export class CreateFolderDTO {
    @IsString()
    name: string

    @IsArray()
    @IsOptional()
    files: string[] = []
}
