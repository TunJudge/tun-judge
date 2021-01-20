import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: ('admin' | 'jury' | 'team' | 'judge-host')[]) =>
  SetMetadata('roles', roles);
