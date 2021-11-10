import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProvinceEntity } from './entites/province.entity';
import { UserEntity } from './entites/user.entity';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { UserSubscribe } from './user.subscribe';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity, ProvinceEntity]),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: (config: ConfigService) => {
                return {
                    secret: config.get<string>("JWT_SECRET")
                }
            },
            inject: [ConfigService]
        }),
    ],
    controllers: [UserController],
    providers: [UserService, UserRepository, UserSubscribe],
    exports: [UserService]
})
export class UserModule { }
