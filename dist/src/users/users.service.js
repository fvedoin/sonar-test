"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var UsersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
const crypto_1 = require("crypto");
const aws_s3_manager_service_1 = require("../aws-s3-manager/aws-s3-manager.service");
const rabbit_mq_service_1 = require("../rabbit-mq/rabbit-mq.service");
const users_repository_1 = require("./users.repository");
let UsersService = UsersService_1 = class UsersService {
    constructor(userRepository, rabbitMQService, awsS3ManagerService) {
        this.userRepository = userRepository;
        this.rabbitMQService = rabbitMQService;
        this.awsS3ManagerService = awsS3ManagerService;
        this.logger = new common_1.Logger(UsersService_1.name);
        this.getBucket = () => {
            return process.env.AWS_BUCKET_FILES;
        };
    }
    async sanitizeUserData(user) {
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
    async create(createUserDto) {
        const password = await bcrypt.hash(createUserDto.password, 10);
        const user = await this.userRepository.create({
            ...createUserDto,
            password,
        });
        return this.sanitizeUserData(user);
    }
    async verifyCode(code, userId) {
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
    async getProfile(userId) {
        const user = await this.userRepository.findById(userId);
        if (user?.image) {
            const bucket = this.getBucket();
            const image = await this.awsS3ManagerService.fetchFromBucket(bucket, user.image);
            user.image = image;
        }
        return this.sanitizeUserData(user);
    }
    async updateProfile({ name, phone, oldImage, username, userId, newImage, }) {
        const newData = {
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
            }
            catch (error) {
                this.logger.warn(`Error uploading ${error.message}`);
                throw new Error();
            }
        }
        const userFromData = await this.userRepository.findByIdAndUpdate(userId, newData);
        common_1.Logger.log('info', {
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
    async generateCode(userId) {
        const generatedCode = (0, crypto_1.randomInt)(0, 1000000);
        const date = new Date();
        const codeExpiredAt = new Date();
        codeExpiredAt.setMinutes(date.getMinutes() + 30);
        const newData = {
            codeExpiredAt,
            generatedCode,
        };
        const currentUser = await this.userRepository.findByIdAndUpdate(userId, newData);
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
    findWhere(where) {
        return this.userRepository.find(where);
    }
    findOne(id) {
        return this.userRepository.findById(id);
    }
    findCompleteByUsername(username) {
        return this.userRepository.findOne({ username });
    }
    async update(id, updateUserDto) {
        if (updateUserDto.password) {
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
        }
        return this.userRepository.findByIdAndUpdate(id, updateUserDto);
    }
    remove(userId) {
        return this.userRepository.delete(userId);
    }
};
UsersService = UsersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_repository_1.UsersRepository,
        rabbit_mq_service_1.RabbitMQService,
        aws_s3_manager_service_1.AwsS3ManagerService])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map