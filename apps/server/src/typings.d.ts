import { User } from '@prisma/client';

declare namespace session {
  interface SessionData {
    passport?: { user?: User };
  }
}
