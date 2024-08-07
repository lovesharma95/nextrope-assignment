import * as bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

export const hashPassword = async (password: string): Promise<string> =>
  bcrypt.hash(password, SALT_ROUNDS);

export const checkPassword = (
  passwordInput: string,
  bcryptHash: string
): boolean => bcrypt.compareSync(passwordInput, bcryptHash);
