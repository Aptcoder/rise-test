import { IUserService } from "src/utils/interfaces/services.interfaces";
import { sampleUser } from "./user.repo";

export const mockUserService: IUserService = {
  createUser() {
    return Promise.resolve(sampleUser);
  },

  getUsers() {
    return Promise.resolve([sampleUser]);
  },
};
