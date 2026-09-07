// Every project, flat. One source behind every view: the map, the flat table,
// the phone document and the reading pages.
//
// blurb  one line, used wherever a system is listed rather than read: the rail,
//        the selected panel, the phone spine
//
// There is deliberately no "hard part" field and no scope-boundary field. Both
// read as defending a thesis rather than describing work; their texts are kept
// in docs/superpowers/notes/2026-09-03-arsip-bagian-sulit.md.
// tier   'full'   -> big plate, gets a /kerja/[slug] page
//        'brief'  -> small plate, selected panel only
// access 'public'   -> anyone can open `site`
//        'internal' -> `site` exists but needs a login
//        'none'     -> no live URL at all

export const projects = [
  {
    slug: 'rsu-nirwana-web',
    client: 'RSU Nirwana',
    clientKey: 'rsu-nirwana',
    year: '2025',
    role: { id: 'Pengembang tunggal', en: 'Sole developer' },
    tier: 'full',
    access: 'public',
    site: 'https://rsunirwana.id',
    image: '/assets/img/pendaftaran.png',
    tech: ['Laravel', 'Next.js', 'MySQL', 'Google Vision', 'REST API'],
    shortName: { id: 'Pendaftaran OCR', en: 'OCR Registration' },
    blurb: {
      id: 'KTP difoto dan dibaca OCR, hasilnya masuk ke SIMRS tanpa diketik ulang di loket.',
      en: 'A KTP is photographed and read by OCR, and the result reaches the SIMRS without being retyped at the counter.',
    },
    title: {
      id: 'Pendaftaran Rumah Sakit Berbasis OCR',
      en: 'OCR-Powered Hospital Registration',
    },
    context: {
      id: 'Pendaftaran online yang lama hanya mengamankan kuota — pasien tetap antri di loket. Formulirnya panjang dan rawan salah ketik, terutama untuk lansia, dan resepsionis harus mengetik ulang karena data web tidak pernah masuk SIMRS.',
      en: 'The legacy pre-registration only secured a queue slot; patients still queued at the counter. The long form was error-prone for elderly users, and receptionists retyped everything because the web flow never reached the internal SIMRS.',
    },
    built: {
      id: [
        'Ekstraksi nama, NIK dan alamat dari foto KTP lewat Google Cloud Vision',
        'Sinkronisasi data pendaftaran langsung ke SIMRS internal',
        'Bukti pendaftaran untuk verifikasi cepat di loket',
        'Validasi sisi server di seluruh formulir',
      ],
      en: [
        'Name, NIK and address extracted from a KTP photo via Google Cloud Vision',
        'Registration data synced straight into the internal SIMRS',
        'A confirmation slip for fast verification at the counter',
        'Server-side validation across the whole form',
      ],
    },
  },
  {
    slug: 'idrg-bridging',
    client: 'RSU Nirwana',
    clientKey: 'rsu-nirwana',
    year: '2025',
    role: { id: 'Pengembang tunggal', en: 'Sole developer' },
    tier: 'full',
    access: 'internal',
    site: null,
    // No line to `rme`: RSU already links to both, and a straight IDRG-RME
    // line passes through the RSU node, reading as a relation that isn't there.
    image: '/assets/img/eklaim.png',
    tech: ['Laravel', 'MySQL', 'REST API', 'SOAP'],
    shortName: { id: 'IDRG Bridging', en: 'IDRG Bridging' },
    blurb: {
      id: 'Menyambungkan data klaim rumah sakit ke sistem BPJS.',
      en: "Connects the hospital's claim data to the BPJS system.",
    },
    title: {
      id: 'Bridging IDRG / INA-CBGs untuk Klaim BPJS',
      en: 'IDRG / INA-CBGs Bridging for BPJS Claims',
    },
    context: {
      id: 'Klaim BPJS dikirim lewat bridging antara sistem rumah sakit dan BPJS. Ada pembaruan aturan IDRG dan integrasi diagnosa ke SatuSehat yang perlu dipenuhi, jadi saya membuat layanan penghubungnya supaya pengiriman klaim tetap berjalan.',
      en: 'BPJS claims are submitted through a bridge between the hospital system and BPJS. An IDRG update and a SatuSehat diagnosis integration had to be met, so I built the connecting service that keeps claims going out.',
    },
    built: {
      id: [
        'Layanan penghubung antara SIMRS dan endpoint BPJS, mengikuti dokumentasi resmi',
        'Pemetaan diagnosa dan prosedur ke grouper INA-CBG',
        'Antrian pengiriman klaim dengan penanganan gagal-kirim',
        'Pencatatan riwayat permintaan untuk menelusuri klaim yang ditolak',
      ],
      en: [
        'A connecting service between the SIMRS and the BPJS endpoints, following the official docs',
        'Diagnosis and procedure mapping into the INA-CBG grouper',
        'A claim submission queue with failure handling',
        'Request history logging so rejected claims can be traced',
      ],
    },
  },
  {
    slug: 'hris-nirwana',
    client: 'RSU Nirwana',
    clientKey: 'rsu-nirwana',
    year: '2026',
    role: { id: 'Pengembang tunggal', en: 'Sole developer' },
    tier: 'full',
    access: 'internal',
    site: null,
    image: null,
    tech: ['Laravel', 'Livewire', 'Alpine.js', 'MySQL', 'TensorFlow.js'],
    shortName: { id: 'HRIS', en: 'HRIS' },
    blurb: {
      id: 'Absensi, cuti, jadwal, dan data pegawai dalam satu aplikasi.',
      en: 'Attendance, leave, schedules and staff records in one app.',
    },
    title: {
      id: 'Sistem Kepegawaian Rumah Sakit',
      en: 'Hospital HR System',
    },
    context: {
      id: 'Sebelumnya absensi memakai mesin absen, pengajuan cuti lewat surat, dan data pegawai tersimpan di Excel. HRIS ini menyatukannya ke satu aplikasi, dengan absensi yang memakai lokasi dan deteksi wajah serta terhubung ke jadwal shift pegawai.',
      en: "Attendance used to run on a punch clock, leave requests on paper, and staff data in Excel. This HRIS brings them into one app, with attendance that uses location and face detection and is tied to each employee's shift.",
    },
    built: {
      id: [
        'Absensi dengan deteksi wajah dan lokasi, terikat pada shift pegawai',
        'Pengajuan cuti dan izin',
        'Pengelolaan jadwal dan shift',
        'Data SDM dan struktur organisasi',
        'Pencatatan inventaris',
        'Ticketing internal',
        'Notifikasi dan pengingat masa berlaku SIP/STR',
        'Pencatatan SP dan tindakan disiplin',
        'Berjalan sebagai PWA, bisa dipasang di ponsel pegawai',
      ],
      en: [
        "Attendance with face detection and location, tied to the employee's shift",
        'Leave and permission requests',
        'Schedule and shift management',
        'Staff records and org structure',
        'Inventory records',
        'Internal ticketing',
        'Notifications and SIP/STR expiry reminders',
        'Disciplinary records and warning letters',
        'Runs as a PWA, installable on staff phones',
      ],
    },
  },
  {
    slug: 'rme',
    client: 'RSU Nirwana',
    clientKey: 'rsu-nirwana',
    year: '2025',
    role: { id: 'Pengembang tunggal', en: 'Sole developer' },
    // Promoted from 'brief' on 2026-09-03. Its hard part — a 1,168-table schema
    // with no usable documentation — is the strongest technical evidence here,
    // and as a summary-only entry it never surfaced anywhere.
    tier: 'full',
    access: 'internal',
    site: null,
    image: '/assets/img/rme1.png',
    tech: ['Laravel', 'MySQL', 'Livewire'],
    shortName: { id: 'RME', en: 'EMR' },
    blurb: {
      id: 'Pencatatan rekam medis elektronik untuk rawat jalan dan rawat inap.',
      en: 'Electronic medical records for outpatient and inpatient care.',
    },
    title: { id: 'Rekam Medis Elektronik', en: 'Electronic Medical Records' },
    context: {
      id: 'Rekam medis elektronik untuk rawat jalan dan rawat inap, dipakai dokter dan perawat asisten dokter. Rumah sakit sudah memakai SIMRS Khanza, jadi RME ini dibuat sebagai aplikasi web terpisah yang menulis ke database yang sama supaya pencatatan dan laporannya tetap menyatu.',
      en: 'Electronic medical records for outpatient and inpatient care, used by doctors and the nurses assisting them. The hospital already runs SIMRS Khanza, so this was built as a separate web app that writes into the same database, keeping records and reports in one place.',
    },
    built: {
      id: [
        'Pencatatan SOAP untuk rawat jalan dan rawat inap',
        'Tanda-tanda vital',
        'Penegakan diagnosa dengan kode ICD',
        'Permintaan pemeriksaan laboratorium',
        'Permintaan pemeriksaan radiologi',
        'Permintaan resep',
        'Resume medis',
      ],
      en: [
        'SOAP notes for outpatient and inpatient care',
        'Vital signs',
        'Diagnosis with ICD coding',
        'Laboratory test requests',
        'Radiology examination requests',
        'Prescription requests',
        'Discharge summaries',
      ],
    },
  },
  {
    slug: 'sigap-bpn',
    client: 'BPN',
    clientKey: 'bpn',
    year: '2024',
    role: { id: 'Pengembang tunggal', en: 'Sole developer' },
    tier: 'brief',
    access: 'none',
    site: null,
    image: '/assets/img/sigap.jpg',
    tech: ['Laravel', 'Livewire', 'MySQL'],
    shortName: { id: 'SIGAP', en: 'SIGAP' },
    blurb: {
      id: 'Kepegawaian dengan absensi yang terikat pada lokasi kerja.',
      en: 'Staff management with attendance tied to the actual work site.',
    },
    title: {
      id: 'Kepegawaian & Absensi Geolocation',
      en: 'Staffing & Geolocation Attendance',
    },
    context: {
      id: 'Manajemen kepegawaian dengan absensi berbasis lokasi, supaya kehadiran tercatat sesuai lokasi kerja.',
      en: 'Staff management with location-based attendance, so presence is recorded against the actual work site.',
    },
    built: { id: [], en: [] },
  },
  {
    slug: 'aset-kphl',
    client: 'KPHL',
    clientKey: 'kphl',
    year: '2024',
    role: { id: 'Pengembang tunggal', en: 'Sole developer' },
    tier: 'brief',
    access: 'none',
    site: null,
    image: '/assets/img/aset.jpg',
    tech: ['Laravel', 'Livewire', 'MySQL'],
    shortName: { id: 'Aset KPHL', en: 'KPHL Assets' },
    blurb: {
      id: 'Aset organisasi dengan pelacakan lokasi, kondisi, jadwal perawatan, dan pelaporan.',
      en: 'Organisational assets with location and condition tracking, maintenance scheduling and reporting.',
    },
    title: { id: 'Manajemen Aset & Inventaris', en: 'Asset & Inventory Management' },
    context: {
      id: 'Pengelolaan aset organisasi dengan pelacakan lokasi dan kondisi, jadwal perawatan, dan pelaporan.',
      en: 'Organisational asset management with location and condition tracking, maintenance scheduling and reporting.',
    },
    built: { id: [], en: [] },
  },
  {
    slug: 'sertifikasi-benih',
    client: 'Dinas Pertanian',
    clientKey: 'dinas-pertanian',
    year: '2024',
    role: { id: 'Pengembang tunggal', en: 'Sole developer' },
    tier: 'brief',
    access: 'none',
    site: null,
    image: '/assets/img/sertifikasi.png',
    tech: ['Laravel', 'Livewire', 'MySQL'],
    shortName: { id: 'Sertifikasi Benih', en: 'Seed Certification' },
    blurb: {
      id: 'Pengajuan sampai sertifikat digital untuk sertifikasi benih tanaman.',
      en: 'Plant seed certification, from application through to a digital certificate.',
    },
    title: { id: 'Aplikasi Sertifikasi Benih', en: 'Seed Certification System' },
    context: {
      id: 'Pendaftaran dan pemantauan sertifikasi benih tanaman, dari pengajuan sampai sertifikat digital.',
      en: 'Plant seed certification registration and monitoring, from application through to a digital certificate.',
    },
    built: { id: [], en: [] },
  },
  {
    slug: 'psb-walisongo',
    client: 'MTs WaliSongo Banjarbaru',
    clientKey: 'mts-walisongo',
    year: '2026',
    role: { id: 'Pengembang tunggal', en: 'Sole developer' },
    tier: 'full',
    access: 'none',
    site: null,
    image: null,
    tech: ['Laravel', 'JavaScript', 'MySQL', 'Fonnte'],
    shortName: { id: 'PSB Walisongo', en: 'Walisongo Admissions' },
    blurb: {
      id: 'Pendaftaran sampai ujian masuk berbasis browser, dengan notifikasi WhatsApp di tiap tahap.',
      en: 'Registration through a browser-based entrance exam, with WhatsApp notifications at every stage.',
    },
    title: {
      id: 'Penerimaan Siswa Baru dengan Ujian CBT',
      en: 'School Admissions with Computer-Based Testing',
    },
    context: {
      id: 'Pendaftaran dan ujian masuk sebelumnya berjalan manual dan tatap muka. Sekolah ingin seluruh alurnya pindah ke digital, dari calon siswa mendaftar sampai hasil ujian keluar.',
      en: 'Registration and the entrance exam both ran manually and face to face. The school wanted the whole flow moved online, from a prospective student registering through to results.',
    },
    built: {
      id: [
        'Pendaftaran calon siswa secara online',
        'Ujian CBT penuh, dikerjakan langsung di browser',
        'Deteksi perpindahan tab selama ujian berlangsung',
        'Notifikasi WhatsApp otomatis lewat Fonnte di setiap tahapan',
      ],
      en: [
        'Online registration for prospective students',
        'A full computer-based exam, taken in the browser',
        'Tab-switch detection while the exam is running',
        'Automatic WhatsApp notifications through Fonnte at every stage',
      ],
    },
  },
];

export const fullProjects = projects.filter((p) => p.tier === 'full');
// Summary-only systems: they appear everywhere the others do, but have no
// reading page behind them.
export const briefProjects = projects.filter((p) => p.tier === 'brief');

export function bySlug(slug) {
  return projects.find((p) => p.slug === slug);
}

// Prev/next across full-tier projects only, wrapping at both ends.
export function siblings(slug) {
  const i = fullProjects.findIndex((p) => p.slug === slug);
  if (i === -1) return { prev: null, next: null };
  const n = fullProjects.length;
  return {
    prev: fullProjects[(i - 1 + n) % n],
    next: fullProjects[(i + 1) % n],
  };
}
