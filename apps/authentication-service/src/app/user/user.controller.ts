import {
  Body,
  Controller,
  Post,
  Injectable,
  UseInterceptors,
  Scope,
  Logger,
  Param,
  Get,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { ConfigService } from '@nestjs/config';

import { UserService } from './user.service';
import { VerifyEmailDto, LoginUserDto, RegisterUserDto } from './dto/user.dto';
import {
  SuccessHandler,
  TransformationInterceptor,
  ErrorResponse,
} from 'handlers';
import { error } from 'constant';
import { bcrypt, JWT } from 'helpers';
import { RoleTypeEnum } from 'types';

@Injectable({ scope: Scope.REQUEST })
@UseInterceptors(TransformationInterceptor)
@Controller()
@ApiTags('User')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService
  ) {}

  @Post('register')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  async RegisterWithEmail(@Body() body: RegisterUserDto) {
    // check user exist
    const existingUser = await this.userService.getByEmail(body.email);
    if (existingUser !== null)
      throw new ErrorResponse.ForbiddenError(error.emailAlreadyExist);

    // create a user
    const user = await this.userService.save(body);

    // generate jwt access token
    // for simplicity using same jwt generate method for confirm email flow
    const jwtManager = new JWT(
      this.configService.get<string>('jwt.tokenJwtSecret')
    );
    const accessToken = await jwtManager.generateSessionJWT(
      this.configService.get<string>('jwt.jwtSecretAccessTokenExpireTime'),
      user.id
    );

    return {
      message: SuccessHandler.getSuccessMessage('DEFAULT', 'User registered'),
      data: RegisterUserDto.intoRegisterUserResponse(user, accessToken),
    };
  }

  @Get('confirm-email/:token')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  async VerifyEmail(@Param() param: VerifyEmailDto) {
    // verify jwt access token
    // for simplicity using same jwt verifier method for confirm email flow
    const tokenManager = new JWT(
      this.configService.get<string>('jwt.tokenJwtSecret')
    );
    const verifyToken = await tokenManager.verifySessionJWT(param.token);

    // check user exist
    const user = await this.userService.getById(verifyToken.userId);
    if (!user) throw new ErrorResponse.ParamsNotFoundException(error.notFound);

    if (user.is_email_verified)
      throw new ErrorResponse.BadRequest(error.userAlreadyVerified);

    // update DB
    await this.userService.verifyEmail(user);

    // generate jwt access token
    const jwtManager = new JWT(
      this.configService.get<string>('jwt.userJwtSecret')
    );
    const accessToken = await jwtManager.generateSessionJWT(
      this.configService.get<string>('jwt.jwtSecretAccessTokenExpireTime'),
      user.id
    );

    return {
      message: SuccessHandler.getSuccessMessage('DEFAULT', 'User verified'),
      data: LoginUserDto.intoLoginWithEmail(user, accessToken),
    };
  }

  @Post('login')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  async LoginWithEmail(@Body() body: LoginUserDto) {
    // check user exist
    const user = await this.userService.getByEmail(body.email);
    if (!user)
      throw new ErrorResponse.UnAuthorizedException(error.incorrectCredentials);

    // match encrypted password
    const verifyPassword = bcrypt.checkPassword(body.password, user.password);
    if (!verifyPassword)
      throw new ErrorResponse.UnAuthorizedException(error.incorrectCredentials);

    if (!user.is_email_verified)
      throw new ErrorResponse.BadRequest(error.userNotVerified);

    // assign secret based on login user role
    let secret = this.configService.get<string>('jwt.userJwtSecret');
    if (user.role === RoleTypeEnum.Administrator)
      secret = this.configService.get<string>('jwt.adminJwtSecret');

    // generate jwt access token
    const jwtManager = new JWT(secret);
    const accessToken = await jwtManager.generateSessionJWT(
      this.configService.get<string>('jwt.jwtSecretAccessTokenExpireTime'),
      user.id
    );

    return {
      message: SuccessHandler.getSuccessMessage('DEFAULT', 'User logged in'),
      data: LoginUserDto.intoLoginWithEmail(user, accessToken),
    };
  }
}
