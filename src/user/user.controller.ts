import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
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
  login(@Body() loginUserDto: LoginUserDto): Observable<Object> {
    const jtwPayload = map((jwt: string) => {
      return {
        access_token: jwt,
        token_type: 'JWT',
        expires_in: 10000,
      };
    });

    return this.userService.login(loginUserDto).pipe(jtwPayload);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Req() request): Observable<IUser[]> {
    return this.userService.findAll();
  }
}
