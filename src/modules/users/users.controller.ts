import { Controller, Get } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get('me')
  getProfile() {
    // TODO: Implement with auth guard
    return { message: 'User profile endpoint' };
  }
}
