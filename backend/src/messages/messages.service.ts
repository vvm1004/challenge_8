import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { Model } from 'mongoose';
import axios from 'axios';

import { Message, MessageDocument } from './schemas/message.schema';
import { CreateMessageDto } from './dto/create-message.dto';
import { IUser } from 'src/users/users.interface';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    private readonly configService: ConfigService,
  ) {}

  async sendMessage(createMessageDto: CreateMessageDto, user: IUser) {
    const newMessage = new this.messageModel({ ...createMessageDto, senderId: user._id });
    return newMessage.save();
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
      .exec();
  }

  @Cron('*/3 * * * *')
  async handleCronEvery() {
    const apiUrl = this.configService.get<string>('PING_URL');

    try {
      const response = await axios.get(apiUrl);
      console.log('Ping successful:', response.status);
    } catch (error) {
      console.error('API Request failed:', error.message);
    }
  }
}
