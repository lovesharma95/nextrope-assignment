import { Project } from 'entity';

export interface ILogStartTimeResponse {
  id: number;
  description: string;
  startTime: Date;
  endTime: Date | null;
  project: Project;
}

export interface ILogStopTimeResponse {
  id: number;
  description: string;
  startTime: Date;
  endTime: Date;
}

export interface IWorkTimeByDay {
  [date: string]: {
    hours: number;
    descriptions: string[];
  };
}
