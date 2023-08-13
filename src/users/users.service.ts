import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUsertDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User) 
        private readonly usersRepository: Repository<User>
    ){}

    create(user: CreateUsertDto){
        const newUser = this.usersRepository.create(user);
        return this.usersRepository.save(newUser);
    }
}
