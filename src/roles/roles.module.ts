import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rol } from './entities/role.entity';
import { User } from '../users/user.entity';
import { JwtStrategy } from 'src/auth/jwt/jwt.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([Rol, User])],
  controllers: [RolesController],
  providers: [RolesService, JwtStrategy],
})
export class RolesModule {}
