import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  Matches,
  MinLength,
  IsEmail,
} from 'class-validator';
import { Builder } from 'builder-pattern';
import { regex } from 'constant';
import { IRegisterUserResponse } from '../types';
import { User } from 'entity';

export class RegisterUserDto {
  @ApiProperty({
    type: String,
    description: 'email of user',
  })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value.trim().toLowerCase())
  email: string;

  @ApiProperty({
    type: String,
    description: 'password of user',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(regex.oneCapitalLetterOneNumberOneSpecialChar, {
    message:
      'Password must contain at least one capital letter and one number and one special character',
  })
  @Transform(({ value }: TransformFnParams) => value.trim())
  password: string;

  static intoRegisterUserResponse(data: User, accessToken: string) {
    return Builder<IRegisterUserResponse>()
      .id(data.id)
      .email(data.email)
      .emailConfirmationEndpoint(
        `http:localhost:3000/authentication/v1/api/confirm-email/${accessToken}`
      )
      .build();
  }
}

export class VerifyEmailDto {
  @ApiProperty({
    type: String,
    description: 'token',
  })
  @IsString()
  @IsNotEmpty()
  token: string;
}

export class LoginUserDto {
  @ApiProperty({
    type: String,
    description: 'email of user',
  })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    type: String,
    description: 'password of user',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  static intoLoginWithEmail(data: User, accessToken: string) {
    return Builder<any>()
      .id(data.id)
      .email(data.email)
      .accessToken(accessToken)
      .build();
  }
}
