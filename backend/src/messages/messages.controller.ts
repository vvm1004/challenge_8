import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { ApiTags } from '@nestjs/swagger';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';

@ApiTags('messages')
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  // @Post()
  // @ResponseMessage("Send Message !")
  // sendMessage(@Body() createMessageDto: CreateMessageDto, @User() user: IUser) {
  //   return this.messagesService.sendMessage(createMessageDto, user);
  // }
  
  @Get(':receiverId')
  async getMessages(@User() user: IUser, @Param('receiverId') receiverId: string) {
    return this.messagesService.getMessages(user._id, receiverId)
  }
}
