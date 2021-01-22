import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { User } from '../entities';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  serializeUser(user: User, done: (error: Error, user: User) => void): void {
    done(null, user);
  }

  deserializeUser(
    payload: string,
    done: (error: Error, payload: string) => void,
  ): void {
    done(null, payload);
  }
}
