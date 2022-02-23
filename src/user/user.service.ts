import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, map, Observable, OperatorFunction, switchMap } from 'rxjs';
import { AuthService } from 'src/auth/services/auth/auth.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from './models/dto/CreateUser.dto';
import { UserEntity } from './models/user.entity';
import { IUser } from './models/user.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private authService: AuthService,
  ) {}

  create(createdUserDto: CreateUserDto): Observable<IUser> {
    const userEntity = this.userRepository.create(createdUserDto);

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

      const savedUserFromRepo = this.userRepository.save(userEntity);

      const userWithoutPassword = map((savedUser: IUser) => {
        const { password, ...user } = savedUser;

        return user;
      });

      const userWithOmittedPassword =
        from(savedUserFromRepo).pipe(userWithoutPassword);

      return userWithOmittedPassword;
    });
  }

  findAll(): Observable<IUser[]> {
    return from(this.userRepository.find());
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
    return from(this.userRepository.findOne({ email })).pipe(
      map((user: IUser) => {
        if (user) {
          return true;
        }

        return false;
      }),
    );
  }
}
