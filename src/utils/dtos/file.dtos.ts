import { IsArray, IsString } from "class-validator"

export class KeyDTO {
    @IsString()
    key: string
}

export class CreateFolderDTO {
    @IsString()
    name: string

    @IsArray({
        each: true,
    })
    files: Array<string>
}
