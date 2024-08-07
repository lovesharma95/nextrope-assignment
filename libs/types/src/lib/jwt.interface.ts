import { JwtPayload } from 'jsonwebtoken';

export interface SessionJWT extends JwtPayload {
  exp: number;
  iat: number;
  userId: number;
}
