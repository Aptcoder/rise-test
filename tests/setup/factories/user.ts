import { useSeederFactory } from "typeorm-extension"
import User, { UserRole } from "../../../src/entities/user.entity"
import bcrypt from "bcrypt"

export async function createUsers() {
    const password = await bcrypt.hash("password", 10)
    const user = await useSeederFactory(User).make({
        email: "sample@sample.com",
        password: password,
        role: UserRole.ADMIN,
    })
    await user.save()

    const user2 = await useSeederFactory(User).make({
        email: "sample2@sample.com",
        password: password,
    })
    await user2.save()

    return [user, user2]
}
