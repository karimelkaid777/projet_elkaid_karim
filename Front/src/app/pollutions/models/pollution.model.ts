export type PollutionType = 'Plastique' | 'Chimique' | 'Dépôt sauvage' | 'Eau' | 'Air' | 'Autre';

export interface Pollution {
  id: number;
  title: string;
  type: PollutionType;
  description: string;
  dateObservation: Date;
  location: string;
  latitude: number;
  longitude: number;
  photoUrl?: string;
}
