import { Pollution } from '../models/pollution.model';

export const MOCK_POLLUTIONS: Pollution[] = [
  {
    id: 1,
    title: 'Déversement de produits chimiques',
    type: 'Chimique',
    description: 'Des produits chimiques industriels ont été déversés dans la rivière, causant une pollution importante de l\'eau.',
    dateObservation: new Date('2025-10-15'),
    location: 'Rivière Seine, Paris 15ème',
    latitude: 48.8566,
    longitude: 2.3522,
    photoUrl: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800'
  },
  {
    id: 2,
    title: 'Émissions toxiques usine',
    type: 'Air',
    description: 'L\'usine rejette des fumées toxiques depuis plusieurs jours, affectant la qualité de l\'air du quartier.',
    dateObservation: new Date('2025-10-18'),
    location: 'Zone industrielle, Lyon',
    latitude: 45.764,
    longitude: 4.8357,
    photoUrl: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800'
  },
  {
    id: 3,
    title: 'Dépôt de déchets illégal',
    type: 'Dépôt sauvage',
    description: 'Découverte de déchets toxiques déposés illégalement sur un terrain vague.',
    dateObservation: new Date('2025-10-20'),
    location: 'Terrain vague, Marseille',
    latitude: 43.2965,
    longitude: 5.3698
  },
  {
    id: 4,
    title: 'Pollution de l\'eau par hydrocarbures',
    type: 'Eau',
    description: 'Présence d\'une nappe d\'hydrocarbures dans le canal, menaçant la faune aquatique.',
    dateObservation: new Date('2025-10-19'),
    location: 'Canal de l\'Ourcq, Paris',
    latitude: 48.8838,
    longitude: 2.3883,
    photoUrl: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=800'
  },
  {
    id: 5,
    title: 'Accumulation de déchets plastiques',
    type: 'Plastique',
    description: 'Une accumulation massive de déchets plastiques sur plusieurs kilomètres de côte après une tempête.',
    dateObservation: new Date('2025-10-12'),
    location: 'Côte Méditerranéenne, Nice',
    latitude: 43.7102,
    longitude: 7.2620,
    photoUrl: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=800'
  },
  {
    id: 6,
    title: 'Pollution atmosphérique urbaine',
    type: 'Air',
    description: 'Pic de pollution atmosphérique dû à la circulation automobile intense.',
    dateObservation: new Date('2025-10-21'),
    location: 'Centre-ville, Toulouse',
    latitude: 43.6047,
    longitude: 1.4442
  },
  {
    id: 7,
    title: 'Contamination chimique des sols',
    type: 'Chimique',
    description: 'Des pesticides interdits ont contaminé les sols agricoles de la région.',
    dateObservation: new Date('2025-10-17'),
    location: 'Plaine agricole, Bordeaux',
    latitude: 44.8378,
    longitude: -0.5792
  },
  {
    id: 8,
    title: 'Déchets plastiques sur la plage',
    type: 'Plastique',
    description: 'Accumulation de déchets plastiques sur la plage après une tempête.',
    dateObservation: new Date('2025-10-22'),
    location: 'Plage de Biarritz',
    latitude: 43.4832,
    longitude: -1.5586,
    photoUrl: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=800'
  }
];
