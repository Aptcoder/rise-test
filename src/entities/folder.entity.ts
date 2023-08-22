import {
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    Column,
    JoinTable,
    ManyToMany,
} from "typeorm"
import { File } from "./file.entity"

@Entity()
export class Folder extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: string

    @Column({
        nullable: false,
    })
    name: string

    @ManyToMany(() => File)
    @JoinTable()
    files: File[]

    @Column({ type: "timestamptz", nullable: true })
    deletedAt: Date

    @Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date
}
