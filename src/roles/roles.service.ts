import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Rol } from './entities/role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RolesService {
  
  constructor(
    @InjectRepository(Rol) private readonly rolesRepository: Repository<Rol>
  ){}

  create(role: CreateRoleDto){
    const newRole = this.rolesRepository.create(role);
    return this.rolesRepository.save(newRole);
  }
}
