import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register-auth.dto';
import { User } from 'src/users/user.entity';
import { LoginAuthDto } from './dto/login-auth.dto';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ){}

  async register(user: RegisterUserDto) {
    
    await this.checkAndThrowError(this.usersRepository, 'email', user.email, 'El email ya está registrado', HttpStatus.CONFLICT);
    await this.checkAndThrowError(this.usersRepository, 'phone', user.phone, 'El teléfono ya existe', HttpStatus.CONFLICT);

    const newUser = this.usersRepository.create(user);
    return this.usersRepository.save(newUser);
  }

  async login(loginData: LoginAuthDto){

    const {email, password} = loginData;
    const userFound = await this.usersRepository.findOneBy({ email: email });
    
    await this.checkAndThrowError(this.usersRepository, 'email', email, 'El email no fue encontrado', HttpStatus.NOT_FOUND);

    const isPasswordValid = await compare(password, userFound.password);
    if(!isPasswordValid){
      await this.checkAndThrowError(this.usersRepository, 'password', password, 'La contraseña no es correcta', HttpStatus.FORBIDDEN);
    }

    return userFound;
    
  }

  async checkAndThrowError(repository, field, value, errorMessage, httpStatus) {
    const exists = await repository.findOneBy({ [field]: value });
    if ((httpStatus === HttpStatus.CONFLICT && exists) ||
        (httpStatus === HttpStatus.NOT_FOUND && !exists) ||
        (httpStatus === HttpStatus.FORBIDDEN && !exists)) {
      throw new HttpException(errorMessage, httpStatus);
    }
  }

}
