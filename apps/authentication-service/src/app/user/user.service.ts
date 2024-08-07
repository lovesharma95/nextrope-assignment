import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'entity';
import { RegisterUserDto } from './dto/user.dto';
import { AuthTypeEnum } from 'types';
import { ErrorResponse } from 'handlers';
import { error } from 'constant';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async save(data: RegisterUserDto) {
    try {
      const { email, password } = data;

      const user = new User({
        email,
        password,
        auth_type: AuthTypeEnum.Email,
      });

      return this.userRepository.save(user);
    } catch (err) {
      this.logger.error(`Error in save function in UserService: ${err}`);
      throw new ErrorResponse.SomeThingWentWrong(error.somethingWentWrong);
    }
  }

  async getByEmail(email: string) {
    try {
      return this.userRepository.findOneBy({
        email: email.toLowerCase(),
      });
    } catch (err) {
      this.logger.error(`Error in getByEmail function in UserService: ${err}`);
      throw new ErrorResponse.SomeThingWentWrong(error.somethingWentWrong);
    }
  }

  async getById(id: number) {
    try {
      return this.userRepository.findOneBy({
        id: id,
      });
    } catch (err) {
      this.logger.error(`Error in getById function in UserService: ${err}`);
      throw new ErrorResponse.SomeThingWentWrong(error.somethingWentWrong);
    }
  }

  async verifyEmail(user: User) {
    try {
      user.is_email_verified = true;
      return this.userRepository.save(user);
    } catch (err) {
      this.logger.error(`Error in verifyEmail function in UserService: ${err}`);
      throw new ErrorResponse.SomeThingWentWrong(error.somethingWentWrong);
    }
  }
}
