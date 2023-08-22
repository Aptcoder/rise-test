import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    BaseEntity,
    OneToMany,
} from "typeorm"

export enum UserRole {
    GUEST = "guest",
    ADMIN = "admin",
}

@Entity()
export default class User extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @Column({
        type: "varchar",
        nullable: false,
    })
    firstName!: string

    @Column({
        type: "varchar",
        nullable: false,
    })
    lastName!: string

    @Column({
        type: "varchar",
        nullable: false,
    })
    password!: string

    @Column({
        type: "varchar",
        unique: true,
        nullable: false,
        transformer: {
            to: (value: string) => value.toLowerCase(),
            from: (value) => value,
        },
    })
    email!: string

    @Column({
        type: "enum",
        enum: UserRole,
        default: UserRole.GUEST,
    })
    role!: UserRole

    @Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
    dateJoined!: Date
}
