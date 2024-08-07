import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  Matches,
  MinLength,
  IsEmail,
  IsEnum,
  IsInt,
} from 'class-validator';
import { Builder } from 'builder-pattern';
import { regex, routes } from 'constant';
import {
  IGetUserResponse,
  ILoginUserResponse,
  IPatchUserResponse,
  IRegisterUserResponse,
} from '../types';
import { User } from 'entity';
import { RoleTypeEnum } from 'types';

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
        `${routes.authenticationRoutes.confirmEmail}${accessToken}`
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
    return Builder<ILoginUserResponse>()
      .id(data.id)
      .email(data.email)
      .accessToken(accessToken)
      .build();
  }
}

export class GetUserByIdDto {
  @ApiProperty({
    type: Number,
    description: 'ID of the user',
  })
  @IsInt()
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value, 10))
  id: number;

  static intoGetUserResponse(data: User) {
    return Builder<IGetUserResponse>()
      .id(data.id)
      .email(data.email)
      .role(data.role)
      .authType(data.auth_type)
      .isEmailVerified(data.is_email_verified)
      .build();
  }
}

export class PatchUserDto {
  @ApiProperty({
    type: 'enum',
    required: true,
    description: 'user role',
    enum: RoleTypeEnum,
    default: RoleTypeEnum.User,
  })
  @IsEnum(RoleTypeEnum)
  @IsString()
  @IsNotEmpty()
  role: RoleTypeEnum;

  static intoPatchUserResponse(data: User) {
    return Builder<IPatchUserResponse>()
      .id(data.id)
      .email(data.email)
      .role(data.role)
      .build();
  }
}
