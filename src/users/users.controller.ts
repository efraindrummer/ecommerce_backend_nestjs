import { Body, Controller, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, ParseIntPipe, Patch, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { CreateUsertDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';

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

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
        uploadFile(
            @UploadedFile(
                new ParseFilePipe({
                    validators: [
                      new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10}),
                      new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
                    ],
                }),
            ) file: Express.Multer.File,
        ) {
        console.log(file);
    }
}
