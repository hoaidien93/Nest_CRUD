import { UserEntity } from "../entites/user.entity";

export interface ListUser{
    pageIndex: number,
    totalPage: number,
    listUsers: UserEntity[]
}