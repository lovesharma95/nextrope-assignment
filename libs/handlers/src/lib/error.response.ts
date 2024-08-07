import {
  NotFoundException,
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common/exceptions';

export class ParamsNotFoundException extends NotFoundException {
  constructor(private param: string) {
    super(param);
  }
}

export class ParamsFoundException extends ConflictException {
  constructor(private param: string) {
    super(param);
  }
}

export class ParamsBadReqException extends BadRequestException {
  constructor(private param: string) {
    super(param);
  }
}

export class ForbiddenError extends ForbiddenException {
  constructor(private param: string) {
    super(param);
  }
}

export class SomeThingWentWrong extends InternalServerErrorException {
  constructor(private param: string) {
    super(param);
  }
}

export class UnAuthorizedException extends UnauthorizedException {
  constructor(private param: string) {
    super(param);
  }
}

export class BadRequest extends BadRequestException {
  constructor(private param: string) {
    super(param);
  }
}
