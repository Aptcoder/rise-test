import User from "../../entities/user.entity"
import { faker, Faker } from "@faker-js/faker"
import { setSeederFactory } from "typeorm-extension"

export const userFactory = setSeederFactory(User, (faker: Faker) => {
    const user = new User()
    user.firstName = faker.person.firstName()
    user.lastName = faker.person.lastName()
    user.email = faker.internet.email({
        firstName: user.firstName,
        lastName: user.lastName,
    })

    user.password = faker.word.sample(8)
    return user
})
