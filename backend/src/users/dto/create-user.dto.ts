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
    message: 'Name không được để trống',
  })
  @ApiProperty({
    example: 'ssss',
    description: 'name',
  })
  name: string;

  @IsEmail({}, { message: 'Email không đúng định dạng' })
  @IsNotEmpty({
    message: 'Email không được để trống',
  })
  @ApiProperty({
    example: 'aaa@gmail.com',
    description: 'email',
  })
  email: string;

  @IsNotEmpty({
    message: 'Password không được để trống',
  })
  @ApiProperty({
    example: '123456',
    description: 'password',
  })
  password: string;

}

export class RegisterUserDto {
  @IsNotEmpty({
    message: 'Name không được để trống',
  })
  @ApiProperty({
    example: 'ssss',
    description: 'name',
  })
  name: string;

  @IsEmail({}, { message: 'Email không đúng định dạng' })
  @IsNotEmpty({
    message: 'Email không được để trống',
  })
  @ApiProperty({
    example: 'aaa@gmail.com',
    description: 'email',
  })
  email: string;

  @IsNotEmpty({
    message: 'Password không được để trống',
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
