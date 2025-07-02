import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Message, MessageDocument } from './schemas/message.schema';
import { Model } from 'mongoose';
import { IUser } from 'src/users/users.interface';

@Injectable()
export class MessagesService {
  constructor(
      @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    ) {}

  async sendMessage(createMessageDto: CreateMessageDto, user: IUser) {
    const newMessage = new this.messageModel({ ...createMessageDto, senderId: user._id })
    return newMessage.save()
  }

  async getMessages(senderId: string, receiverId: string) {
  return this.messageModel
    .find({
      $or: [
        { senderId: senderId, receiverId: receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    })
    .sort({ createdAt: 1 }) 
    .exec()
}


  
}
