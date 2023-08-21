import { faker } from "@faker-js/faker";
import { CreateUserDTO } from "../../src/utils/dtos/user.dtos";
import { IUser } from "../../src/utils/interfaces/entities.interfaces";
import { IUserRepository } from "../../src/utils/interfaces/repos.interfaces";
import { UserRole } from "../../src/entities/user.entity";
const sampleUser: IUser = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    dateJoined: new Date(),
    role: UserRole.GUEST,
    id: faker.person.fullName(),

    save: jest.fn(),
    email: faker.internet.email(),
    password: faker.internet.password()
}
export const mockUserRepository: IUserRepository = {
    create: function (createUserDto: CreateUserDTO): Promise<IUser> {
        return Promise.resolve({
            ...createUserDto,
            dateJoined: new Date(),
            role: UserRole.GUEST,
            id: faker.person.fullName(),

            save: jest.fn()
        })
    },
    findAll: function (): Promise<IUser[]> {
        throw new Error("Function not implemented.");
    },
    findByEmail: function (email: string): Promise<IUser | null> {
        return Promise.resolve(sampleUser)
    }
}  
