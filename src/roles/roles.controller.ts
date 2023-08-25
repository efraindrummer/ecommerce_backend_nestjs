import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { JwtRolesGuard } from 'src/auth/jwt/jwt-roles-.guard';
import { HasRoles } from '../auth/jwt/has-roles';
import { JwtRole } from '../auth/jwt/jwt-role';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @HasRoles(JwtRole.ADMIN)
  @UseGuards(JwtAuthGuard, JwtRolesGuard)
  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }
}
