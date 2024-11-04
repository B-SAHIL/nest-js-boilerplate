import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/createUserDto';
import { AuthService } from './auth.service';
import { loginDto } from './dto/loginDto';

@Controller('auth')
export class AuthController {
   constructor(private readonly authService: AuthService) {
   }
   @Post()
   async create(@Body() user: CreateUserDto) {
      await this.authService.create(user);
   }

   // login 
   @Post('login')
   async login(@Body() user: loginDto) {
      return await this.authService.login(user);
   }
}
