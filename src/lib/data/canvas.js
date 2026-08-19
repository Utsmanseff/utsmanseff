// Canvas layout. Node positions live on the projects themselves;
// this file holds the shared world and the one node that isn't a project.

export const WORLD = { width: 1600, height: 1000 };

export const NODE_RADIUS = { center: 78, full: 58, brief: 42 };

export const CENTER_NODE = {
  slug: '__me',
  position: { x: 800, y: 500 },
  name: 'Utsman',
  role: { id: 'Fullstack Developer', en: 'Fullstack Developer' },
  blurb: {
    id: 'Membangun sistem rumah sakit dan pemerintahan di Kalimantan Selatan. Empat tahun terakhir sebagian besar di ruang klinis: pendaftaran, klaim, rekam medis.',
    en: 'I build hospital and public-sector systems in South Kalimantan. Most of the last four years has been clinical: registration, claims, medical records.',
  },
};
