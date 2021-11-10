import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcrypt';
import { Checker } from 'src/interfaces/checker.interface';
import { Constants } from '../../utils/constants';
import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';
import { UpdateDTO } from './dto/update.dto';
import { UserEntity } from './entites/user.entity';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcrypt';
import { ProvinceEntity } from './entites/province.entity';
import { FindUserDTO } from './dto/find.dto';

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly jwtService: JwtService,
    ) { }

    async register(data: RegisterDTO, isAdmin: boolean = false): Promise<Checker> {
        const result = await this.userRepository.register(data, isAdmin);
        if (result) {
            const data = {
                id: result.id,
                email: result.email,
                role: result.role
            };
            return {
                isSuccess: true,
                data: {
                    token: this.jwtService.sign(data, {
                        expiresIn: '30d',
                    }),
                    email: result.email,
                },
            };
        }
        return Constants.FAIL_CHECK
    }

    verifyAccount(token: string): Checker {
        try {
            const validToken = this.jwtService.verify(token);
            return {
                isSuccess: true,
                data: validToken,
            };
        } catch (e) {
            return {
                isSuccess: false,
                data: null,
            };
        }

    }

    async login(data: LoginDTO): Promise<Checker> {
        const user = await this.userRepository.findUserByEmail(data.email);
        if (user) {
            const hashPassword = user.password;
            const isCorrectPassword = compareSync(data.password, hashPassword);
            if (isCorrectPassword) {
                const data = {
                    id: user.id,
                    email: user.email,
                    role: user.role
                };
                return {
                    isSuccess: true,
                    data: {
                        token: this.jwtService.sign(data, {
                            expiresIn: '30d',
                        }),
                        email: user.email,
                    },
                };
            }
        }
        return Constants.FAIL_CHECK
    }

    async update(data: UpdateDTO, userId: number): Promise<Checker> {
        const formatedData = this._convertToEntity(data);
        const result = await this.userRepository.update(formatedData, userId);
        if (result) {
            return Constants.SUCCESS_CHECK;
        }
        return Constants.FAIL_CHECK
    }

    private _convertToEntity(data: UpdateDTO): UserEntity {
        const userEntity = new UserEntity({
            ...data,
        });
        if (data.password) {
            userEntity.password = bcrypt.hashSync(data.password, Constants.SALT_OR_ROUNDS);
        }
        if (data.provinceId) {
            userEntity.province = new ProvinceEntity({
                id: data.provinceId
            })
        }
        return userEntity;
    }

    async delete(userId: number): Promise<Checker> {
        const result = await this.userRepository.deleteById(userId);
        if (result) {
            return Constants.SUCCESS_CHECK;
        }
        return Constants.FAIL_CHECK
    }

    async find(query: FindUserDTO): Promise<Checker> {
        const defaultValue = {
            pageIndex: 1,
            provinceId: null,
            perPage: 10
        }
        const result = await this.userRepository.find({
            ...defaultValue,
            ...query
        });
        if (result) {
            return {
                isSuccess: true,
                data: result
            };
        }
        return Constants.FAIL_CHECK
    }

    async getListProvinces(): Promise<Checker>{
        const listProvinces = await this.userRepository.getListProvinces();
        return {
            isSuccess: true,
            data: listProvinces
        }
    }
}
