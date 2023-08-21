import { sampleUser } from "./user.repo"

export const mockUserService = {
    createUserCall: 0,

    createUser(){
        this.createUserCall = this.createUserCall + 1
        return Promise.resolve(sampleUser)
    },

    getUsers() {
        return Promise.resolve([sampleUser])
    },
}

