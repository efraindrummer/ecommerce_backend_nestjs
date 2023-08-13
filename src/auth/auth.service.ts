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
    //const emailExists = await this.usersRepository.findOneBy({ email: user.email });
    //const phoneExists = await this.usersRepository.findOneBy({ phone: user.phone });
    //if(emailExists) { return new HttpException('El email ya esta registrado', HttpStatus.CONFLICT);}
    //if(phoneExists) { return new HttpException('EL telefono ya existe', HttpStatus.CONFLICT) }
    
    //await this.checkAndThrowIfExists(Repository, 'email', user.email, 'El email ya está registrado');
    await this.checkAndThrowError(this.usersRepository, 'email', user.email, 'El email ya está registrado', HttpStatus.CONFLICT);
    await this.checkAndThrowError(this.usersRepository, 'phone', user.phone, 'El teléfono ya existe', HttpStatus.CONFLICT);
    //await this.checkAndThrowIfExists(Repository, 'phone', user.phone, 'El teléfono ya existe');

    const newUser = this.usersRepository.create(user);
    return this.usersRepository.save(newUser);
  }

  async login(loginData: LoginAuthDto){

    const {email, password} = loginData;
    const userFound = await this.usersRepository.findOneBy({ email: email });
    
    //await this.checkAndThrowIfNotExists(Repository, 'email', email, 'El email no existe');
    await this.checkAndThrowError(this.usersRepository, 'email', email, 'El email no fue encontrado', HttpStatus.NOT_FOUND);

    const isPasswordValid = await compare(password, userFound.password);
    if(!isPasswordValid){
      //await this.checkAndThrowIfCorrectPassword(Repository, 'password', password, 'La contraseña es incorrecta');
      await this.checkAndThrowError(this.usersRepository, 'password', password, 'La contraseña no es correcta', HttpStatus.FORBIDDEN);
    }

    return userFound;
    
  }

  async checkAndThrowIfExists(repository, field, value, errorMessage) {
    const exists = await this.usersRepository.findOneBy({ [field]: value });
    if (exists) {
      throw new HttpException(errorMessage, HttpStatus.CONFLICT);
    }
  }

  async checkAndThrowIfNotExists(repository, field, value, errorMessage) {
    const exists = await this.usersRepository.findOneBy({ [field]: value });
    if (!exists) {
      throw new HttpException(errorMessage, HttpStatus.NOT_FOUND);
    }
  }

  async checkAndThrowIfCorrectPassword (repository, field, value, errorMessage) {
    const exists = await this.usersRepository.findOneBy({ [field]: value });
    if (!exists) {
      throw new HttpException(errorMessage, HttpStatus.FORBIDDEN);
    }
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
