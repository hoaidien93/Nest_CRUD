import { Body, Controller, Delete, Get, ParseArrayPipe, Post, Put, Query, Req } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { JSONResponse } from 'src/interfaces/response.interface';
import { Constants } from '../../utils/constants';
import { handleChecker } from '../../utils/helpers';
import { FindUserDTO } from './dto/find.dto';
import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';
import { UpdateDTO } from './dto/update.dto';
import { Roles } from './role.decorator';
import { UserService } from './user.service';

@Controller("/user")
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Put("register")
    async postRegister(@Body() data: RegisterDTO): Promise<JSONResponse>{
        const result = await this.userService.register(data);
        return handleChecker(result);
    }

    @Post("login")
    async postLogin(@Body() data: LoginDTO): Promise<JSONResponse>{
        const result = await this.userService.login(data);
        return handleChecker(result);
    }

    @Post("update")
    @ApiBearerAuth("access-token")
    async postUpdate(@Body() data: UpdateDTO, @Req() request: Request): Promise<JSONResponse>{
        const result = await this.userService.update(data, request.user.id);
        return handleChecker(result);
    }

    @Delete("delete")
    @ApiBearerAuth("access-token")
    async deleteAccount(@Req() request: Request): Promise<JSONResponse>{
        const result = await this.userService.delete(request.user.id);
        return handleChecker(result);
    }

    @Get("find")
    @ApiBearerAuth("access-token")
    @Roles(Constants.ADMIN_ROLE)
    async findUser(@Query() query: FindUserDTO): Promise<JSONResponse>{
        const result = await this.userService.find(query);
        return handleChecker(result);
    }

    @Put("register-admin")
    @ApiBearerAuth("access-token")
    @Roles(Constants.ADMIN_ROLE)
    async postRegisterAdmin(@Body() data: RegisterDTO): Promise<JSONResponse>{
        const result = await this.userService.register(data, true);
        return handleChecker(result);
    }

    @Get("list-provinces")
    async getListProvinces(): Promise<JSONResponse>{
        const result = await this.userService.getListProvinces();
        return handleChecker(result);
    }
}
