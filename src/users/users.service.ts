import { Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { randomInt } from 'crypto';
import { FilterQuery } from 'mongoose';

import { AwsS3ManagerService } from 'src/aws-s3-manager/aws-s3-manager.service';
import { RabbitMQService } from 'src/rabbit-mq/rabbit-mq.service';
import { CreateUserDto } from './dto/create-user.dto';
import { SanitizeUser } from './dto/sanitarize-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  private logger = new Logger(UsersService.name);

  constructor(
    private readonly userRepository: UsersRepository,
    private readonly rabbitMQService: RabbitMQService,
    private readonly awsS3ManagerService: AwsS3ManagerService,
  ) {}

  async sanitizeUserData(user: User): Promise<SanitizeUser> {
    return {
      _id: user._id.toString(),
      accessLevel: user.accessLevel,
      active: user.active,
      blocked: user.blocked,
      clientId: user.clientId.toString(),
      createdAt: user.createdAt,
      phone: user.phone,
      image: user.image || null,
      modules: user.modules || [],
      name: user.name,
      username: user.username,
    };
  }

  async create(createUserDto: CreateUserDto) {
    const password = await bcrypt.hash(createUserDto.password, 10);
    const user = await this.userRepository.create({
      ...createUserDto,
      password,
    });

    return this.sanitizeUserData(user);
  }

  async verifyCode(code: number, userId: string) {
    const date = new Date();

    const currentUser = await this.userRepository.findById(userId);

    const generatedCode = currentUser.generatedCode;
    const codeExpiredAt = currentUser.codeExpiredAt;

    const typedCode = code;

    if (typedCode !== generatedCode || date > codeExpiredAt) {
      throw { name: `ValidationError`, message: `Código inválido.` };
    }

    return { code: typedCode };
  }

  private getBucket = () => {
    return process.env.AWS_BUCKET_FILES;
  };

  async getProfile(userId: string) {
    const user = await this.userRepository.findById(userId);

    if (user?.image) {
      const bucket = this.getBucket();

      const image = await this.awsS3ManagerService.fetchFromBucket(
        bucket,
        user.image,
      );

      user.image = image;
    }

    return this.sanitizeUserData(user);
  }

  async updateProfile({
    name,
    phone,
    oldImage,
    username,
    userId,
    newImage,
  }: {
    name: string;
    phone: string;
    oldImage?: string;
    username: string;
    userId: string;
    newImage?: Express.Multer.File;
  }) {
    const newData: { [key: string]: unknown } = {
      name,
      phone,
      username,
    };

    if (newImage) {
      try {
        const imagePath = `${userId}/profile-${newImage.originalname}`;

        newData.image = imagePath;

        const bucket = this.getBucket();

        await this.awsS3ManagerService.uploadFile({
          Bucket: bucket,
          Key: imagePath,
          Body: newImage.buffer,
        });
      } catch (error) {
        this.logger.warn(`Error uploading ${error.message}`);
        throw new Error();
      }
    }

    const userFromData = await this.userRepository.findByIdAndUpdate(
      userId,
      newData,
    );

    Logger.log('info', {
      message: 'Atualizou o perfil',
      userId: userId,
    });

    const message = `Foram feitas alterações no seu perfil`;

    this.rabbitMQService.send('notification', {
      channels: {
        email: {
          type: 'updateProfile',
          receivers: [username],
          context: {
            message,
          },
        },
      },
    });

    return this.sanitizeUserData(userFromData);
  }

  async generateCode(userId: string) {
    const generatedCode = randomInt(0, 1000000);

    const date = new Date();
    const codeExpiredAt = new Date();
    codeExpiredAt.setMinutes(date.getMinutes() + 30);

    const newData = {
      codeExpiredAt,
      generatedCode,
    };

    const currentUser = await this.userRepository.findByIdAndUpdate(
      userId,
      newData,
    );

    const message = `${generatedCode}`;

    this.rabbitMQService.send('notification', {
      channels: {
        email: {
          type: 'createCode',
          receivers: [currentUser.username],
          context: {
            message,
          },
        },
      },
    });

    return this.sanitizeUserData(currentUser);
  }

  async updatePassword(userId, password) {
    const hash = await bcrypt.hash(password, 10);

    const user = await this.userRepository.findById(userId);

    user.password = hash;

    user.save();

    return this.sanitizeUserData(user);
  }

  findAll() {
    return this.userRepository.find({});
  }

  findWhere(where: FilterQuery<UserDocument>) {
    return this.userRepository.find(where);
  }

  findOne(id: string) {
    return this.userRepository.findById(id);
  }

  findCompleteByUsername(username: string) {
    return this.userRepository.findOne({ username });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    return this.userRepository.findByIdAndUpdate(id, updateUserDto);
  }

  remove(userId: string) {
    return this.userRepository.delete(userId);
  }
}
