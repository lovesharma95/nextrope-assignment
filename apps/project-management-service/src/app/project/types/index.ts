export interface ICreateProjectResponse {
  id: number;
  name: string;
  description: string;
}

export enum GetProjectsSortByEnum {
  Id = 'id',
  Name = 'name',
}
