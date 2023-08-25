import {
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    Column,
    DeleteDateColumn,
    ManyToOne,
    Index,
} from "typeorm"
import User from "./user.entity"
import { File } from "./file.entity"

@Entity()
@Index(["fileId", "reviewerId"], {
    unique: true,
})
export class Review extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({
        nullable: true,
    })
    comment: string

    @Column({
        nullable: false,
        default: false,
    })
    safe: boolean

    @Column()
    reviewerId: string

    @ManyToOne(() => User, (admin: User) => admin.reviews)
    reviewer: User

    @Column()
    fileId: string

    @ManyToOne(() => File, (file) => file.reviews)
    file: File

    @DeleteDateColumn({ type: "timestamptz", nullable: true })
    deletedAt: Date

    @Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date
}
