// Canvas layout. Node positions live on the projects themselves;
// this file holds the shared world and the one node that isn't a project.

export const WORLD = { width: 1600, height: 1000 };

export const NODE_RADIUS = { center: 78, full: 58, brief: 42, group: 50 };

// The map carries the four projects that earned a page, plus one node standing
// for the smaller internal builds. Eight near-identical circles read as filler;
// four with weight, and one door to the rest, reads as a shape. The small work
// is not hidden — it lives behind this node, and on phones it is still listed
// in full.
export const OTHERS_NODE = {
  slug: '__others',
  position: { x: 1150, y: 520 },
  name: { id: 'Project lain', en: 'Other work' },
  note: {
    id: 'Sistem internal untuk instansi pemerintah dan satu RME rumah sakit. Lingkupnya kecil, tidak ada halaman khusus.',
    en: 'Internal systems for public-sector bodies, plus a hospital EMR. Small in scope, no page of their own.',
  },
};

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
