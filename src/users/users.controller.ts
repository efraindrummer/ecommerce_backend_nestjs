import { Body, Controller, Post } from '@nestjs/common';
import { CreateUsertDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {

    constructor(
        private readonly usersService: UsersService
    ){}

    @Post() //http://localhost/users
    create(@Body() user: CreateUsertDto){
        return this.usersService.create(user);
    }
}
