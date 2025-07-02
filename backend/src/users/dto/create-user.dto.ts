import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import mongoose from 'mongoose';

export class CreateUserDto {
  @IsNotEmpty({
    message: 'Name can not be empty',
  })
  @ApiProperty({
    example: 'Minh',
    description: 'name',
  })
  name: string;

  @IsEmail({}, { message: 'Email can not be empty' })
  @IsNotEmpty({
    message: 'Email can not be empty',
  })
  @ApiProperty({
    example: 'aaa@gmail.com',
    description: 'email',
  })
  email: string;

  @IsNotEmpty({
    message: 'Password can not be empty',
  })
  @ApiProperty({
    example: '123456',
    description: 'password',
  })
  password: string;

}

export class RegisterUserDto {
  @IsNotEmpty({
    message: 'Name can not be empty',
  })
  @ApiProperty({
    example: 'Minh',
    description: 'name',
  })
  name: string;

  @IsEmail({}, { message: 'Email is not valid' })
  @IsNotEmpty({
    message: 'Email can not be empty',
  })
  @ApiProperty({
    example: 'aaa@gmail.com',
    description: 'email',
  })
  email: string;

  @IsNotEmpty({
    message: 'Password can not be empty',
  })
  @ApiProperty({
    example: '123456',
    description: 'password',
  })
  password: string;
 
}

export class UserLoginDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'admin@gmail.com', description: 'username' })
  readonly username: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '123456',
    description: 'password',
  })
  readonly password: string;
}
