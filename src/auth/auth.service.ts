import { BadRequestException, ConflictException, Injectable, Options, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/userSchema';
import { Model } from "mongoose";
import { CreateUserDto } from './dto/createUserDto';
import * as argon from "argon2";
import { JwtService } from '@nestjs/jwt';
import { loginDto } from './dto/loginDto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {

  }

  async create(user: CreateUserDto): Promise<{ message: string; user: User }> {
    try {
      // Check if the user already exists
      const userExists = await this.userModel.findOne({ email: user.email });
      if (userExists) {
        throw new ConflictException('User already exists');
      }

      // Hash the user's password
      const hashedPassword = await argon.hash(user.password);
      user.password = hashedPassword;

      // Create and save the new user
      const newUser = new this.userModel(user);
      const savedUser = await newUser.save();

      // Return a success message along with the saved user details
      return {
        message: 'User created successfully',
        user: savedUser,
      };

    } catch (error) {
      console.error(error);
      if (error instanceof ConflictException) {
        throw error;
      }

      // For other errors, throw a BadRequestException
      throw new BadRequestException('User creation failed');
    }
  }

  async login(loginDto: loginDto): Promise<{ token: string }> {
    const { email, password } = loginDto;

    // Find user by email
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if password matches
    const passwordMatches = await argon.verify(user.password, password);
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // Generate JWT token
    const token = this.jwtService.sign({ userId: user._id, email: user.email, role: user.role }, { secret: process.env.JWT_SECRET, expiresIn: "1h" });

    // Return the token and success message
    return {
      token,
    };
  }

  async validateUser(userId: string): Promise<User | null> {
    return this.userModel.findById(userId);
  }

}
