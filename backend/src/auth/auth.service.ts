import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { ConfigService } from '@nestjs/config';
import { IUser } from 'src/users/users.interface';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';
import * as ms from 'ms';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,


  ) { }
  //username/ pass là 2 tham số thư viện passport ném về
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);
    if (user) {
      const isValid = this.usersService.isValidPassword(pass, user.password);
      if (isValid === true) {
        return user
      }
    }
    return null;
  }


  async login(user: IUser, response: Response) {
    const { _id, name, email } = user;

    const payload = {
      sub: "token login",
      iss: "from server",
      _id,
      name,
      email, 
    }

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        _id,
        name,
        email, 
      }

    };
  }
  async register(user: RegisterUserDto) {
    let newUser = await this.usersService.register(user);
    return {
      _id: newUser?._id,
      createdAt: newUser?.createdAt
    }
  }

}
