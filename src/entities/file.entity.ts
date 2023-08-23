import {
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BeforeInsert,
} from "typeorm"

@Entity()
export class File extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({
        nullable: false,
    })
    originalName: string

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

    @Column({ type: "timestamptz", nullable: true })
    deletedAt: Date

    @Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date

    @BeforeInsert()
    nameToLowerCase() {
        this.key = this.key.toLowerCase()
    }
}
