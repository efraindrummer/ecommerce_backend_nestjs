import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { RegisterUserDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';

import { User } from 'src/users/user.entity';
import { Rol } from 'src/roles/entities/role.entity';

import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  private readonly logger = new Logger('AuthService');

  constructor(
    @InjectRepository(User) 
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Rol) 
    private readonly rolesRepository: Repository<Rol>,
    private readonly jwtService: JwtService,
  ){}

  async register(user: RegisterUserDto) {

    await this.checkAndThrowError(this.usersRepository, 'email', user.email, 'El email ya está registrado', HttpStatus.CONFLICT);
    await this.checkAndThrowError(this.usersRepository, 'phone', user.phone, 'El teléfono ya existe', HttpStatus.CONFLICT);

    const newUser = this.usersRepository.create(user);

    const rolesIds = user.rolesIds;

    const roles = await this.rolesRepository.findBy({ id: In(rolesIds)});

    newUser.roles = roles;
    
    const userSaved = await this.usersRepository.save(newUser);
    const rolesString = userSaved.roles.map(rol => rol.id);

    const payload = { 
      id: userSaved.id, 
      name: userSaved.name,
      roles: rolesString
    };
    const token = this.jwtService.sign(payload);
    const data = {
       user: userSaved,
       token: 'Bearer ' + token,
    }

    delete data.user.password;
    return data;
  }

  async login(loginData: LoginAuthDto){

    const {email, password} = loginData;
    const userFound = await this.usersRepository.findOne({
      where: {email: email},
      relations: ['roles']
    });
    
    await this.checkAndThrowError(this.usersRepository, 'email', email, 'El email no fue encontrado', HttpStatus.NOT_FOUND);

    const isPasswordValid = await compare(password, userFound.password);
    if(!isPasswordValid){
      await this.checkAndThrowError(this.usersRepository, 'password', password, 'La contraseña no es correcta', HttpStatus.FORBIDDEN);
    }

    const rolesIds = await userFound.roles.map(rol => rol.id); //['CLIENTE', 'ADMIN']

    const payload = { id: userFound.id, name: userFound.name, roles: rolesIds };
    const token = this.jwtService.sign(payload);
    const data = {
      user: userFound,
      token: 'Bearer ' + token,
    }

    delete data.user.password;

    return data;
    
  }

  private async checkAndThrowError(repository, field, value, errorMessage, httpStatus) {

    const exists = await repository.findOneBy({ [field]: value });

    if ((httpStatus === HttpStatus.CONFLICT && exists) || (httpStatus === HttpStatus.NOT_FOUND && !exists) || (httpStatus === HttpStatus.FORBIDDEN && !exists)) {
      throw new HttpException(errorMessage, httpStatus);
    }
  }

}
