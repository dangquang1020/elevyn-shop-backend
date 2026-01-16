import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from '../../common/decorators';
import { AuthGuard } from '@nestjs/passport'; // Or LocalAuthGuard if implemented

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      return { error: 'Invalid credentials' };
    }
    return this.authService.login(user); // Should return tokens directly
  }

  @Public()
  @Post('register')
  async register(@Body() body: { email: string; password: string }) {
    return this.authService.register(body.email, body.password);
  }

  @Public()
  @Post('refresh')
  async refresh(@Body() body: { refreshToken: string }) {
    return this.authService.refreshToken(body.refreshToken);
  }

  @Post('logout')
  async logout(@Body() body: { refreshToken: string }) {
    // TODO: Revoke refresh token in DB
    return { message: 'Logged out successfully' };
  }

  @Get('profile')
  getProfile(@Request() req: any) {
    return req.user;
  }
}
