import { IsArray, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class FindUserDTO {
    @IsOptional()
    @IsNumber()
    @ApiProperty({ required: false })
    @Type(() => Number)
    @Min(1)
    pageIndex: number;

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    @ApiProperty({ required: false })
    provinceId: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    @ApiProperty({ required: false })
    @Min(1)
    perPage: number;
}
