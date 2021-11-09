import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user-module/user.module';
import { UserData } from './interfaces/user_data.interface';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './role.guard';

declare module "express" {
  export interface Request {
    user: UserData
  }
}


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      password: '1',
      database: 'interview',
      synchronize: true,
      entities: ["dist/**/*.entity{.ts,.js}"],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env"
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_GUARD,
    useClass: RolesGuard
  }],
})
export class AppModule implements NestModule {
  configure(consume: MiddlewareConsumer) {
    consume.apply(AuthMiddleware).exclude(
      "user/login",
      "user/register",
    ).forRoutes("*")
  }
}
