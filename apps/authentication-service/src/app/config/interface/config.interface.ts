interface DBConfigProps {
  type: string;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  synchronize: boolean;
  autoLoadEntities: boolean;
}

export interface JWT {
  jwtSecret: string;
  jwtSecretAccessTokenExpireTime: string;
}

export interface BaseUrl {
  authService: string;
}

export interface ConfigProps {
  nodeEnv: string;
  port: number;
  logLevel: string;
  corsOrigin: string;
  db: DBConfigProps;
  jwt: JWT;
}

export enum EnvironmentKeyName {
  LOG_LEVEL = 'LOG_LEVEL',
  NODE_ENV = 'NODE_ENV',
  PORT = 'PORT',
  CORS_ORIGIN = 'CORS_ORIGIN',
  DB_TYPE = 'DB_TYPE',
  DB_HOST = 'DB_HOST',
  DB_PORT = 'DB_PORT',
  DB_USERNAME = 'DB_USERNAME',
  DB_PASSWORD = 'DB_PASSWORD',
  DB_DATABASE = 'DB_DATABASE',
  DB_SYNCHRONIZE = 'DB_SYNCHRONIZE',
  DB_AUTOLOADENTITIES = 'DB_AUTOLOADENTITIES',
  JWT_SECRET = 'JWT_SECRET',
  JWT_SECRET_ACCESS_TOKEN_EXPIRE_TIME = 'JWT_SECRET_ACCESS_TOKEN_EXPIRE_TIME',
}
