import { File } from "../../entities/file.entity"
import { faker, Faker } from "@faker-js/faker"
import { setSeederFactory } from "typeorm-extension"

export const fileFactory = setSeederFactory(File, (faker: Faker) => {
    const file = new File()
    file.location = faker.internet.url()
    file.key = faker.string.uuid()
    file.originalName = faker.internet.userName()
    file.mimeType = "video/mp4"
    file.size = 5432
    return file
})
