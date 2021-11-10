import { Test } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserEntity } from './entites/user.entity';
import { ProvinceEntity } from './entites/province.entity';
import { handleChecker } from '../../utils/helpers';
import * as bcrypt from 'bcrypt';
import { Constants } from '../../utils/constants';

describe('UserController', () => {
    let userController: UserController;
    let userService: UserService;
    let userRepository: UserRepository;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot({
                    type: 'mysql',
                    host: '127.0.0.1',
                    port: 3306,
                    username: 'root',
                    password: '1',
                    database: 'interview',
                    synchronize: true,
                    entities: [UserEntity, ProvinceEntity],
                }),
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
                ConfigModule.forRoot({
                    isGlobal: true,
                    envFilePath: ".env"
                }),
            ],
            controllers: [UserController],
            providers: [UserService, UserRepository],
        }).compile();

        userService = moduleRef.get<UserService>(UserService);
        userController = moduleRef.get<UserController>(UserController);
        userRepository = moduleRef.get<UserRepository>(UserRepository);
    });

    describe('List Provinces', () => {
        it('should return all provinces', async () => {
            const result = {
                isSuccess: true,
                data: [
                    {
                        id: 1,
                        name: "Hà Nội"
                    }
                ]
            };

            const restfulResult = handleChecker(result)
            jest.spyOn(userService, 'getListProvinces').mockImplementation(() => Promise.resolve(result));

            expect(await userController.getListProvinces()).toStrictEqual(restfulResult);
        });
    });
    describe('Login', () => {
        it('should login successfull', async () => {
            const request = {
                email: "hoaidien93@gmail.com",
                password: "hoaidien93@gmail.com"
            }
            const result = new UserEntity({
                created_at: new Date(),
                id: 1,
                password: bcrypt.hashSync(request.password, Constants.SALT_OR_ROUNDS),
                province: new ProvinceEntity({
                    id: 1
                }),
                fullName: "Testing",
                role: Constants.USER_ROLE,
                email: request.email,
                updated_at: new Date()
            })

            jest.spyOn(userRepository, 'findUserByEmail').mockImplementation(() => Promise.resolve(result));
            expect((await userController.postLogin(request)).code).toBe(Constants.SUCCESS_CODE)
        });
        it('should login failed', async () => {
            const request = {
                email: "hoaidien93@gmail.com",
                password: "hoaidien93@gmail.com"
            }
            const result = null;
            jest.spyOn(userRepository, 'findUserByEmail').mockImplementation(() => Promise.resolve(result));
            expect((await userController.postLogin(request)).code).toBe(Constants.FAIL_CODE)
        });
    })

    describe('Register', () => {
        it('should register successfull', async () => {
            const request = {
                email: "hoaidien93@gmail.com",
                password: "hoaidien93@gmail.com",
                fullName: "Hoài Diễn",
                provinceId: 1,
            }
            const result = new UserEntity({
                created_at: new Date(),
                id: 1,
                password: bcrypt.hashSync(request.password, Constants.SALT_OR_ROUNDS),
                province: new ProvinceEntity({
                    id: 1
                }),
                fullName: "Testing",
                role: Constants.USER_ROLE,
                email: request.email,
                updated_at: new Date()
            })
            jest.spyOn(userRepository, 'register').mockImplementation(() => Promise.resolve(result));
            expect((await userController.postRegister(request)).code).toBe(Constants.SUCCESS_CODE)
        });

        it('should register failed', async () => {
            const request = {
                email: "hoaidien93@gmail.com",
                password: "hoaidien93@gmail.com",
                fullName: "Hoài Diễn",
                provinceId: 1,
            }
            const result = null
            jest.spyOn(userRepository, 'register').mockImplementation(() => Promise.resolve(result));
            expect((await userController.postRegister(request)).code).toBe(Constants.FAIL_CODE)
        });
    })

    describe('Update', () => {
        it('should update successfull', async () => {
            const request = {
                email: "hoaidien93@gmail.com",
                password: "hoaidien93@gmail.com",
                fullName: "Hoài Diễn",
                provinceId: 1,
            }
            const userId = 1;
            jest.spyOn(userRepository, 'update').mockImplementation(() => Promise.resolve(true));
            expect((await userService.update(request, userId)).isSuccess).toBe(true)
        });
        it('should update failed', async () => {
            const request = {
                email: "hoaidien93@gmail.com",
                password: "hoaidien93@gmail.com",
                fullName: "Hoài Diễn",
                provinceId: 1,
            }
            const userId = 1;
            jest.spyOn(userRepository, 'update').mockImplementation(() => Promise.resolve(false));
            expect((await userService.update(request, userId)).isSuccess).toBe(false)
        });
    })

    describe('Delete', () => {
        it('should delete successfull', async () => {
            const userId = 1;
            jest.spyOn(userRepository, 'deleteById').mockImplementation(() => Promise.resolve(true));
            expect((await userService.delete(userId)).isSuccess).toBe(true)
        });
        it('should delete failed', async () => {
            const userId = 1;
            jest.spyOn(userRepository, 'deleteById').mockImplementation(() => Promise.resolve(false));
            expect((await userService.delete(userId)).isSuccess).toBe(false)
        });
    })

    describe('Find User', () => {
        it('find user successfull', async () => {
            const result = {
                listUsers: [new UserEntity({
                    email: "hoaidien93@gmail.com",
                    password: null,
                    fullName: "Hoài Diễn",
                    province: new ProvinceEntity({
                        id: 1
                    }),
                })],
                pageIndex: 1,
                totalPage: 1
            }
            jest.spyOn(userRepository, 'find').mockImplementation(() => Promise.resolve(result));
            expect((await userService.find({
                pageIndex: 1,
                perPage: 10,
                provinceId: 1
            })).data).toBe(result)
        });
    })
});