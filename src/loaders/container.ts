import UserRepository from '../repositories/user.repository';
import UserService from '../services/user.service';
import Container from 'typedi';

export const initContainer = async () => {
    Container.set({ id: 'user_repository', type: UserRepository})

    // services
    Container.set({ id: 'user_service', type: UserService })
    return Container
}