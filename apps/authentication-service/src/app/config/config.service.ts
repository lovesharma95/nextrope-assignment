import { ConfigProps, EnvironmentKeyName } from './interface/config.interface';
import { ProcessEnvAdapterService } from './adapter/process-env.adapter';

export class Config {
  public static async load(): Promise<ConfigProps> {
    const baseConfig = {
      nodeEnv: process.env.NODE_ENV || 'local',
      port: parseInt(process.env.PORT, 10) || 3000,
    };

    const keyList = Object.keys(EnvironmentKeyName);
    let env;
    switch (baseConfig.nodeEnv) {
      default:
        env = await new ProcessEnvAdapterService().getList(keyList);
        break;
    }

    return {
      ...baseConfig,
      logLevel: process.env.LOG_LEVEL,
      corsOrigin: env.CORS_ORIGIN,
      db: {
        type: env.DB_TYPE,
        host: env.DB_HOST,
        port: parseInt(env.DB_PORT, 10),
        username: env.DB_USERNAME,
        password: env.DB_PASSWORD,
        database: env.DB_DATABASE,
        synchronize: env.DB_SYNC as unknown as boolean,
        autoLoadEntities: env.DB_AUTOLOAD_ENTITIES as unknown as boolean,
      },
      jwt: {
        userJwtSecret: env.USER_JWT_SECRET,
        adminJwtSecret: env.ADMIN_JWT_SECRET,
        tokenJwtSecret: env.TOKEN_JWT_SECRET,
        jwtSecretAccessTokenExpireTime: env.JWT_SECRET_ACCESS_TOKEN_EXPIRE_TIME,
      },
    };
  }
}
