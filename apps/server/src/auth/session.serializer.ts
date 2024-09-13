import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';

import { User } from '@prisma/client';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  serializeUser(user: User, done: (error: Error | null, user: User) => void): void {
    done(null, user);
  }

  deserializeUser(payload: string, done: (error: Error | null, payload: string) => void): void {
    done(null, payload);
  }
}
