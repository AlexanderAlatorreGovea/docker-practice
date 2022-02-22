import { Injectable } from '@nestjs/common';
import { from, Observable } from 'rxjs';
const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
  hasPassword(password: string): Observable<string> {
    return from<string>(bcrypt.hash(password, 12));
  }

  comparePassword(
    password: string,
    storedPasswordHash: string,
  ): Observable<unknown> {
    return from(bcrypt.compare(password, storedPasswordHash));
  }
}
