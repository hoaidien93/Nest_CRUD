import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Constants } from 'src/utils/constants';
import { Repository } from 'typeorm';
import { FindUserDTO } from './dto/find.dto';
import { RegisterDTO } from './dto/register.dto';
import { UpdateDTO } from './dto/update.dto';
import { ProvinceEntity } from './entites/province.entity';
import { UserEntity } from './entites/user.entity';
import { ListUser } from './interfaces/listUser.interface';


@Injectable()
export class UserRepository {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) { }

    async register(data: RegisterDTO, isAdmin: boolean): Promise<UserEntity> {
        const newUser = this.userRepository.create({
            email: data.email,
            password: data.password,
            fullName: data.fullName,
            province: new ProvinceEntity({
                id: data.provinceId
            }),
            role: isAdmin ? Constants.ADMIN_ROLE : Constants.USER_ROLE
        });
        try {
            const result = await this.userRepository.save(newUser);
            return result;
        } catch (e) {
            return null;
        }
    }

    async findUserByEmail(email: string): Promise<UserEntity> {
        return await this.userRepository.findOne({ email })
    }

    private async _findUserById(id: number): Promise<UserEntity> {
        return await this.userRepository.findOne({ id });
    }

    async update(data: UserEntity, userId: number): Promise<boolean> {
        const desUser = await this._findUserById(userId);
        if (desUser) {
            const newInfo = Object.assign({}, desUser, data);
            try {
                await this.userRepository.save(newInfo);
                return true;
            } catch (e) {
                return false;
            }
        }
        return false;
    }

    async deleteById(userId: number): Promise<boolean> {
        try {
            await this.userRepository.createQueryBuilder()
                .delete()
                .from(UserEntity)
                .where("id = :id", { id: userId })
                .execute();
            return true;
        }
        catch (e) {
            return false;
        }
    }

    async find(query: FindUserDTO): Promise<ListUser> {
        // get count
        let queryBuilder = this.userRepository.createQueryBuilder("user")
        if (query.provinceId) queryBuilder = queryBuilder.where("user.provinceId = :id", { id: query.provinceId });
        const [
            total,
            listUsers
        ] = await Promise.all([
            queryBuilder.getCount(),
            queryBuilder.take(query.perPage)
                .skip(query.perPage * (query.pageIndex - 1))
                .orderBy("user.id", "ASC")
                .getMany()
        ]);
        return {
            listUsers: listUsers.map(e => {
                e.password = null;
                return e;
            }),
            pageIndex: query.pageIndex,
            totalPage: Math.ceil(total / query.perPage)
        }
    }
}