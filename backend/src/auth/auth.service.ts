import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { ConfigService } from '@nestjs/config';
import { IUser } from 'src/users/users.interface';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { Response } from 'express';
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
    const refresh_token = this.createRefreshToken(payload)
    //update user with refresh token
    await this.usersService.updateUserToken(refresh_token, _id);

    //set refresh_token as cookies
    response.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      maxAge: ms(this.configService.get<string>("JWT_REFRESH_EXPIRE"))
    })
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


  createRefreshToken = (payload: any) => {
    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET"),
      expiresIn: this.configService.get<string>("JWT_REFRESH_EXPIRE")
    })
    return refresh_token
  }


  processNewToken = async (refreshToken: string, response: Response) => {
    try {
      this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET"),
      })
      //todo
      let user = await this.usersService.findUserByToken(refreshToken)
      if (user) {
        const { _id, name, email } = user;
        const payload = {
          sub: "token refresh",
          iss: "from server",
          _id,
          name,
          email,
        }
        const refresh_token = this.createRefreshToken(payload)
        //update user with refresh token
        await this.usersService.updateUserToken(refresh_token, _id.toString());

        //set refresh_token as cookies
        response.clearCookie("refresh_token")
        response.cookie("refresh_token", refresh_token, {
          httpOnly: true,
          maxAge: ms(this.configService.get<string>("JWT_REFRESH_EXPIRE"))
        })
        return {
          access_token: this.jwtService.sign(payload),
          user: {
            _id,
            name,
            email
          }

        };
      } else {
        throw new BadRequestException(`Refresh token không hợp lệ. Vui lòng login.`)
      }
    } catch (error) {
      throw new BadRequestException(`Refresh token không hợp lệ. Vui lòng login.`)
    }
  }


}
