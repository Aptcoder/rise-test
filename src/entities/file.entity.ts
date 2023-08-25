import {
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    Column,
    DeleteDateColumn,
    OneToMany,
} from "typeorm"
import { Review } from "./review.entity"

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

    @OneToMany(() => Review, (review) => review.file)
    reviews: Review[]

    @DeleteDateColumn({ type: "timestamptz", nullable: true })
    deletedAt: Date

    @Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date
}
