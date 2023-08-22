import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class File extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: string

    @Column({
        nullable: false,
    })
    originalName: string

    @Column({
        nullable: false,
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

    @Column({ type: "timestamptz", nullable: true })
    deletedAt: Date

    @Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date
}
