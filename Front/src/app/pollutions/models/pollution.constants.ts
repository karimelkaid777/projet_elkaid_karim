import {PollutionType} from './pollution.model';

export const POLLUTION_TYPES: readonly PollutionType[] = [
  'Plastique',
  'Chimique',
  'Dépôt sauvage',
  'Eau',
  'Air',
  'Autre'
] as const;
