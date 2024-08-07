import { ProcessEnvAdapterService } from './adapter/process-env.adapter';

export interface IConfigServiceAdapter {
  getInstance(): ProcessEnvAdapterService;
  getList(
    keyList: string[]
  ): Promise<Record<string, string | boolean | number>>;
}
