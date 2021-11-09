import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'provinces' })
export class ProvinceEntity {
    constructor(partial: Partial<ProvinceEntity>) {
        Object.assign(this, partial);
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(type => UserEntity, user => user.province)
    listUser: UserEntity[]
}
