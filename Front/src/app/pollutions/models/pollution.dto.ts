import {PollutionType} from './pollution.model';

export interface CreatePollutionDto {
  title: string;
  type: PollutionType;
  description: string;
  dateObservation: Date | string;
  location: string;
  latitude: number;
  longitude: number;
  photoUrl?: string;
}

export interface UpdatePollutionDto {
  title?: string;
  type?: PollutionType;
  description?: string;
  dateObservation?: Date | string;
  location?: string;
  latitude?: number;
  longitude?: number;
  photoUrl?: string;
}

export interface PollutionFilterDto {
  type?: string;
  title?: string;
}
