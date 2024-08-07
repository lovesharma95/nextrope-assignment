import { IConfigServiceAdapter } from '../config-service.adapter.interface';
import { EnvironmentKeyName } from '../interface/config.interface';

export class ProcessEnvAdapterService implements IConfigServiceAdapter {
  private instance: ProcessEnvAdapterService | undefined;

  public getInstance(): ProcessEnvAdapterService {
    if (!this.instance) {
      this.instance = new ProcessEnvAdapterService();
    }
    return this.instance;
  }

  public async getList(
    keyList: string[]
  ): Promise<Record<string, string | number | boolean>> {
    const keySet = new Set(keyList);
    const _env = {};
    for (const key of Object.keys(EnvironmentKeyName)) {
      if (!keySet.has(key)) continue;
      Object.assign(_env, { [key]: process.env[key] });
    }
    return _env;
  }
}
