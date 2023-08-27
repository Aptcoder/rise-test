import {
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    Column,
    DeleteDateColumn,
    OneToMany,
    ManyToOne,
} from "typeorm"
import { File } from "./file.entity"

@Entity()
export class FileHistory extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({
        nullable: false,
    })
    originalName: string

    @Column({
        nullable: false,
    })
    fileId: string

    @ManyToOne(() => File)
    file: File

    @Column({
        nullable: false,
        unique: true,
    })
    key: string

    @Column({
        nullable: false,
    })
    mimeType: string

    @Column({
        nullable: false,
    })
    size: number

    @Column({
        nullable: false,
    })
    location: string

    @Column({
        nullable: false,
        default: true,
    })
    safe: boolean

    @DeleteDateColumn({ type: "timestamptz", nullable: true })
    deletedAt: Date

    @Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date
}
