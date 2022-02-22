import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { Observable } from 'rxjs';
import { CreateUserDto } from './models/dto/CreateUser.dto';
import { LoginUserDto } from './models/dto/LoginUser.dto';
import { IUser } from './models/user.interface';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  add(@Body() createdUserDto: CreateUserDto): Observable<IUser> {
    return this.userService.create(createdUserDto);
  }

  @Post('login')
  @HttpCode(200)
  login(@Body() loginUserDto: LoginUserDto): Observable<string> {
    return this.userService.login(loginUserDto);
  }

  @Get()
  findAll(): Observable<IUser[]> {
    return this.userService.findAll();
  }
}
