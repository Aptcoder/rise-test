import {
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    Column,
    JoinTable,
    ManyToMany,
    BeforeInsert,
} from "typeorm"
import { File } from "./file.entity"

@Entity()
export class Folder extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({
        nullable: false,
        unique: true,
    })
    name: string

    @ManyToMany(() => File)
    @JoinTable()
    files: File[]

    @Column({ type: "timestamptz", nullable: true })
    deletedAt: Date

    @Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date

    @BeforeInsert()
    nameToLowerCase() {
        this.name = this.name.toLowerCase()
    }
}
