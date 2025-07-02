import { IsNotEmpty, IsMongoId, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import mongoose from 'mongoose'

export class CreateMessageDto {
  @ApiProperty({
    description: 'ID of the receiver',
    example: '64f8a78e23f42a92cd00ab57',
  })
  @IsMongoId({ message: 'ReceiverId must be a valid Mongo ID' })
  @IsNotEmpty({ message: 'ReceiverId can not be empty' })
  receiverId: mongoose.Types.ObjectId

  @ApiProperty({
    description: 'Message content',
    example: 'Hello, how are you?',
  })
  @IsString({ message: 'Message must be a string' })
  @IsNotEmpty({ message: 'Message can not be empty' })
  message: string
}
