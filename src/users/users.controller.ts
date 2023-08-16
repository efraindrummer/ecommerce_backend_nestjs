import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { CreateUsertDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';

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


    @UseGuards(JwtAuthGuard)
    @Put(':id')
    update(
        @Param('id', ParseIntPipe) id: number, 
        @Body() user: UpdateUserDto
    ){
        return this.usersService.update(id, user);
    }
}
