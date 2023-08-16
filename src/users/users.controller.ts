import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreateUsertDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';

@Controller('users')
export class UsersController {

    constructor(
        private readonly usersService: UsersService
    ){}

    @UseGuards(JwtAuthGuard)
    @Get() //http://localhost/users
    findAll(): Promise<User[]> {
        return this.usersService.findAll();
    }

    @Post() //http://localhost/users
    create(@Body() user: CreateUsertDto){
        return this.usersService.create(user);
    }

}
