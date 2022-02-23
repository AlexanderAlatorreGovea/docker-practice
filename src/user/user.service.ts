import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, map, Observable, switchMap } from 'rxjs';
import { AuthService } from 'src/auth/services/auth/auth.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from './models/dto/CreateUser.dto';
import { LoginUserDto } from './models/dto/LoginUser.dto';
import { UserEntity } from './models/user.entity';
import { IUser } from './models/user.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private authService: AuthService,
  ) {}

  create(user: CreateUserDto): Observable<IUser> {
    const userEntity = this.userRepository.create(user);

    return this.mailExists(userEntity.email).pipe(
      switchMap((exists: boolean) => {
        if (!exists) {
          const { password } = userEntity;
          const userWithOmittedPassword = this.authService
            .hashPassword(password)
            .pipe<IUser>(this.overridePassword(userEntity));

          return userWithOmittedPassword;
        }

        throw new HttpException('Email already in use', HttpStatus.CONFLICT);
      }),
    );
  }

  private overridePassword(userEntity: UserEntity) {
    return switchMap((passwordHash: string) => {
      userEntity.password = passwordHash;

      const user = this.userRepository.save(userEntity);

      const userWithoutPassword = map((savedUser: IUser) => {
        const { password, ...user } = savedUser;

        return user;
      });

      const userWithOmittedPassword = from(user).pipe(userWithoutPassword);

      return userWithOmittedPassword;
    });
  }

  findAll(): Observable<IUser[]> {
    return from(this.userRepository.find());
  }

  login(loginUser: LoginUserDto): Observable<any> {
    return this.findUserByEmail(loginUser.email.toLowerCase()).pipe(
      switchMap((user: IUser) => {
        if (user) {
          return this.validatePassword(loginUser.password, user.password).pipe(
            this.generateJWTOrThrowError(user),
          );
        }

        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }),
    );
  }

  private generateJWTOrThrowError(user) {
    return switchMap((passwordsMatches: boolean) => {
      if (passwordsMatches) {
        // const JWT = this.findOne(user.id).pipe(
        //   switchMap((user: IUser) => this.authService.generateJwt(user)),
        // );

        // return JWT;
        return 'login was successful';
      }

      throw new HttpException(
        'Login was not Successfulll',
        HttpStatus.UNAUTHORIZED,
      );
    });
  }

  findOne(id: number): Observable<IUser> {
    return from(this.userRepository.findOne({ id }));
  }

  private findUserByEmail(email: string): Observable<IUser> {
    return from(
      this.userRepository.findOne(
        { email },
        { select: ['id', 'email', 'password'] },
      ),
    );
  }

  private validatePassword(
    password: string,
    storedPasswordHash: string,
  ): Observable<boolean> {
    return this.authService.comparePassword(password, storedPasswordHash);
  }

  private mailExists(email: string): Observable<boolean> {
    email = email.toLowerCase();
    const savedEmail = this.userRepository.findOne({ email });

    const hasUser = map((user: IUser) => {
      if (user) return true;

      return false;
    });

    return from(savedEmail).pipe(hasUser);
  }
}
