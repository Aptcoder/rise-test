import {
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BeforeInsert,
    DeleteDateColumn,
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

    @DeleteDateColumn()
    @Column({ type: "timestamptz", nullable: true })
    deletedAt: Date

    @Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date
}
