import { Constants } from '../../../utils/constants';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { ProvinceEntity } from './province.entity';

@Entity({ name: 'users' })
@Unique("unq_user_email", ["email"])
export class UserEntity {
    constructor(partial?: Partial<UserEntity>) {
        Object.assign(this, partial);
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    fullName: string;

    @Column({
        default: Constants.USER_ROLE
    })
    role: string;

    @ManyToOne(type => ProvinceEntity, province => province.listUser)
    province: ProvinceEntity

    @Column()
    created_at: Date;

    @Column()
    updated_at: Date;
}
