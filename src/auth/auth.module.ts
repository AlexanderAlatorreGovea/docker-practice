import { Module } from '@nestjs/common';
import { AuthService } from './services/auth/auth.service';

@Module({
  imports: [],
  providers: [AuthService],
  exports: [AuthService]
})
export class AuthModule {}
