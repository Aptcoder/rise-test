import { IsString } from "class-validator"

export class KeyDTO {
    @IsString()
    key: string
}
