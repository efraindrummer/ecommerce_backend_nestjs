import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUsertDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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

    findAll(){
        return this.usersRepository.find();
    }

    async update(id: number, user: UpdateUserDto){
        const userFound = await this.usersRepository.findOneBy({ id: id });

        if(!userFound){
            return new HttpException('Usuario no existe', HttpStatus.NOT_FOUND)
        }

        const updatedUser = Object.assign(userFound, user);
        return this.usersRepository.save(updatedUser);
    }

    async updatedWithImage(image: Express.Multer.File){
        
    }
}
