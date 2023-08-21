import { Service, Inject } from 'typedi';
import * as bcrypt from 'bcrypt';
import { IUser } from '../utils/interfaces/entities.interfaces';
import { IUserRepository } from '../utils/interfaces/repos.interfaces';
import { ConflictError } from '../utils/errors';
import { CreateUserDTO } from '../utils/dtos/user.dtos';
import { IUserService } from 'src/utils/interfaces/services.interfaces';

@Service('user_service')
export default class UserService implements IUserService {
  constructor(@Inject('user_repository') public userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  private async hashPassword(password: string): Promise<string> {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }

  async createUser(createUserDto: CreateUserDTO): Promise<IUser> {
    const existingUser = await this.userRepository.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictError('User with this email already exists');
    }
    const hashedPassword = await this.hashPassword(createUserDto.password);
    return this.userRepository.create({
      ...createUserDto,
      password: hashedPassword
    });
  }

  async getUsers(): Promise<IUser[]> {
    return this.userRepository.findAll();
  }

}
