// Every project, flat. Each entry carries its own canvas position, so the
// canvas and the reading pages are two views over one source.
//
// tier   'full'   -> big node, gets a /kerja/[slug] page
//        'brief'  -> small node, preview panel only
// access 'public'   -> anyone can open `site`
//        'internal' -> `site` exists but needs a login
//        'none'     -> no live URL at all

export const projects = [
  {
    slug: 'rsu-nirwana-web',
    client: 'RSU Nirwana',
    year: '2025',
    role: { id: 'Pengembang tunggal', en: 'Sole developer' },
    cluster: 'nirwana',
    tier: 'full',
    access: 'public',
    site: 'https://rsunirwana.id',
    position: { x: 560, y: 320 },
    related: ['rme', 'idrg-bridging'],
    image: '/assets/img/pendaftaran.png',
    tech: ['Laravel', 'Next.js', 'MySQL', 'Google Vision', 'REST API'],
    shortName: { id: 'Pendaftaran OCR', en: 'OCR Registration' },
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
    hard: {
      id: 'Akurasi OCR harus dijaga di foto KTP dengan pencahayaan dan sudut yang sangat beragam, sementara dua skema data milik pihak berbeda harus diselaraskan tanpa merusak ekspektasi vendor SIMRS.',
      en: 'Holding OCR accuracy across wildly inconsistent KTP photos, while aligning two separately-owned data schemas without breaking the vendor SIMRS contract.',
    },
  },
  {
    slug: 'idrg-bridging',
    client: 'RSU Nirwana',
    year: '2025',
    role: { id: 'Pengembang tunggal', en: 'Sole developer' },
    cluster: 'nirwana',
    tier: 'full',
    access: 'internal',
    site: null,
    position: { x: 760, y: 250 },
    related: ['rme'],
    image: '/assets/img/eklaim.png',
    tech: ['Laravel', 'MySQL', 'REST API', 'SOAP'],
    shortName: { id: 'IDRG Bridging', en: 'IDRG Bridging' },
    title: {
      id: 'Bridging IDRG / INA-CBGs untuk Klaim BPJS',
      en: 'IDRG / INA-CBGs Bridging for BPJS Claims',
    },
    context: {
      id: 'Surat edaran Kemenkes mewajibkan update IDRG dan integrasi diagnosa SIMRS ke SatuSehat. Bridging bawaan SIMRS Khanza saat itu tidak memenuhi komponen penilaian, dan akses bridging terancam diputus — artinya klaim BPJS tidak bisa dikirim sama sekali.',
      en: 'A Ministry of Health circular required an IDRG update and SIMRS-to-SatuSehat diagnosis integration. The bundled SIMRS Khanza bridging did not meet the assessment criteria, and bridging access was about to be cut — meaning no BPJS claims could be submitted at all.',
    },
    built: {
      id: [
        'Web service mediator antara SIMRS dan endpoint BPJS, ditulis dari dokumentasi resmi',
        'Pemetaan diagnosa dan prosedur ke grouper INA-CBG',
        'Antrian pengiriman klaim dengan penanganan gagal-kirim',
        'Pencatatan jejak permintaan untuk penelusuran saat klaim ditolak',
      ],
      en: [
        'A mediator web service between SIMRS and the BPJS endpoints, written from the official docs',
        'Diagnosis and procedure mapping into the INA-CBG grouper',
        'A claim submission queue with failure handling',
        'Request logging so rejected claims can be traced',
      ],
    },
    hard: {
      id: 'Mengoordinasikan banyak endpoint BPJS di bawah tenggat regulasi, dengan taruhan yang tidak bisa ditawar: kalau bridging benar-benar diputus, rumah sakit berhenti bisa mengirim klaim.',
      en: 'Coordinating many BPJS endpoints under a regulatory deadline, with a stake that allowed no slippage: if bridging was actually cut, the hospital could not submit claims at all.',
    },
  },
  {
    slug: 'hris-nirwana',
    client: 'RSU Nirwana',
    year: '2026',
    role: { id: 'Pengembang tunggal', en: 'Sole developer' },
    cluster: 'nirwana',
    tier: 'full',
    access: 'internal',
    site: null,
    position: { x: 520, y: 640 },
    related: ['rsu-nirwana-web'],
    image: null,
    tech: ['Laravel', 'Livewire', 'Alpine.js', 'MySQL', 'MediaPipe'],
    shortName: { id: 'HRIS', en: 'HRIS' },
    title: {
      id: 'Sistem Kepegawaian Rumah Sakit',
      en: 'Hospital HR System',
    },
    context: {
      id: 'Rumah sakit belum punya sistem kepegawaian sama sekali. Absensi bergantung pada mesin absen, pengajuan cuti berjalan lewat surat, dan sisanya dicatat di Excel yang tersebar. HRIS dibangun untuk menyatukan semuanya ke satu tempat.',
      en: 'The hospital had no HR system at all. Attendance ran through a punch clock, leave requests moved on paper, and everything else lived in scattered Excel files. The HRIS was built to pull all of it into one place.',
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
    hard: {
      id: 'Bagian tersulitnya absensi, karena tiga hal harus benar sekaligus. Lokasi harus cukup akurat untuk memastikan pegawai benar-benar berada di rumah sakit, wajah harus diverifikasi supaya absen tidak bisa dititipkan, dan setiap absen harus dicocokkan dengan shift serta jadwal pegawai yang bersangkutan. Deteksi wajah dijalankan di browser lewat MediaPipe, geolokasi dipaksa ke mode akurasi tinggi, dan absen yang tidak cocok dengan jadwal aktif ditolak. Hasilnya yang tercatat bukan sekadar "hadir", tapi hadir pada shift yang benar, di tempat yang benar, oleh orang yang benar.',
      en: 'Attendance was the hard part, because three things had to be right at once. The location had to be accurate enough to confirm the employee was actually at the hospital, the face had to be verified so a check-in could not be done on someone\'s behalf, and every check-in had to be matched against that employee\'s shift and schedule. Face detection runs in the browser through MediaPipe, geolocation is forced into high-accuracy mode, and a check-in that does not match the active schedule is rejected. What gets recorded is not simply "present" — it is present on the right shift, in the right place, by the right person.',
    },
  },
  {
    slug: 'rme',
    client: 'RSU Nirwana',
    year: '2025',
    role: { id: 'Pengembang tunggal', en: 'Sole developer' },
    cluster: 'nirwana',
    tier: 'brief',
    access: 'internal',
    site: null,
    position: { x: 400, y: 480 },
    related: [],
    image: '/assets/img/rme1.png',
    tech: ['Laravel', 'MySQL', 'Livewire'],
    shortName: { id: 'RME', en: 'EMR' },
    title: { id: 'Rekam Medis Elektronik', en: 'Electronic Medical Records' },
    context: {
      id: 'Permenkes mewajibkan RME untuk akreditasi. Antarmuka sistem vendor tidak bisa dimodifikasi, jadi lapisan web terpisah dibangun di atas database SIMRS yang sama — tetap menulis ke sana supaya laporan yang ada tidak rusak.',
      en: "Ministry regulation made EMR mandatory for accreditation. The vendor system's interface could not be modified, so a separate web layer was built on top of the same SIMRS database, still writing back into it so existing reports kept working.",
    },
    built: { id: [], en: [] },
    hard: {
      id: 'Database SIMRS punya 1.168 tabel tanpa dokumentasi yang memadai, sehingga memetakan data klinis beserta relasi dan constraint-nya lebih mirip rekonstruksi struktur data daripada pekerjaan antarmuka.',
      en: 'The SIMRS database had 1,168 tables with no usable documentation, so mapping the clinical data with its relations and constraints was closer to reconstructing a schema than to interface work.',
    },
  },
  {
    slug: 'sigap-bpn',
    client: 'BPN',
    year: '2024',
    role: { id: 'Pengembang tunggal', en: 'Sole developer' },
    cluster: 'gov',
    tier: 'brief',
    access: 'none',
    site: null,
    position: { x: 1140, y: 400 },
    related: ['aset-kphl'],
    image: '/assets/img/sigap.jpg',
    tech: ['Laravel', 'Livewire', 'MySQL'],
    shortName: { id: 'SIGAP', en: 'SIGAP' },
    title: {
      id: 'Kepegawaian & Absensi Geolocation',
      en: 'Staffing & Geolocation Attendance',
    },
    context: {
      id: 'Manajemen kepegawaian dengan absensi berbasis lokasi, supaya kehadiran tercatat sesuai lokasi kerja.',
      en: 'Staff management with location-based attendance, so presence is recorded against the actual work site.',
    },
    built: { id: [], en: [] },
    hard: { id: '', en: '' },
  },
  {
    slug: 'aset-kphl',
    client: 'KPHL',
    year: '2024',
    role: { id: 'Pengembang tunggal', en: 'Sole developer' },
    cluster: 'gov',
    tier: 'brief',
    access: 'none',
    site: null,
    position: { x: 1220, y: 620 },
    related: ['sertifikasi-benih'],
    image: '/assets/img/aset.jpg',
    tech: ['Laravel', 'Livewire', 'MySQL'],
    shortName: { id: 'Aset KPHL', en: 'KPHL Assets' },
    title: { id: 'Manajemen Aset & Inventaris', en: 'Asset & Inventory Management' },
    context: {
      id: 'Pengelolaan aset organisasi dengan pelacakan lokasi dan kondisi, jadwal perawatan, dan pelaporan.',
      en: 'Organisational asset management with location and condition tracking, maintenance scheduling and reporting.',
    },
    built: { id: [], en: [] },
    hard: { id: '', en: '' },
  },
  {
    slug: 'sertifikasi-benih',
    client: 'Dinas Pertanian',
    year: '2024',
    role: { id: 'Pengembang tunggal', en: 'Sole developer' },
    cluster: 'gov',
    tier: 'brief',
    access: 'none',
    site: null,
    position: { x: 1060, y: 700 },
    related: [],
    image: '/assets/img/sertifikasi.png',
    tech: ['Laravel', 'Livewire', 'MySQL'],
    shortName: { id: 'Sertifikasi Benih', en: 'Seed Certification' },
    title: { id: 'Aplikasi Sertifikasi Benih', en: 'Seed Certification System' },
    context: {
      id: 'Pendaftaran dan pemantauan sertifikasi benih tanaman, dari pengajuan sampai sertifikat digital.',
      en: 'Plant seed certification registration and monitoring, from application through to a digital certificate.',
    },
    built: { id: [], en: [] },
    hard: { id: '', en: '' },
  },
  {
    slug: 'psb-walisongo',
    client: 'MTs WaliSongo Banjarbaru',
    year: '2026',
    role: { id: 'Pengembang tunggal', en: 'Sole developer' },
    cluster: 'edu',
    tier: 'full',
    access: 'none',
    site: null,
    position: { x: 830, y: 810 },
    related: [],
    image: null,
    tech: ['Laravel', 'JavaScript', 'MySQL', 'Fonnte'],
    shortName: { id: 'PSB Walisongo', en: 'Walisongo Admissions' },
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
    hard: {
      id: 'Tiga bagian yang sulitnya berbeda-beda. Skema ujian harus menampung bank soal, sesi, jawaban tiap peserta dan waktu pengerjaan dalam satu struktur yang tetap masuk akal saat banyak peserta mengerjakan bersamaan. Pengawasan tidak mungkin dilakukan manusia satu per satu, jadi perpindahan tab dipakai sebagai sinyal — begitu peserta meninggalkan halaman ujian, kejadian itu tercatat dan bisa ditinjau. Terakhir, notifikasi WhatsApp disambungkan lewat Fonnte di setiap tahapan supaya pendaftar tidak perlu menelepon sekolah hanya untuk bertanya sudah sampai mana.',
      en: "Three parts, each hard in a different way. The exam schema had to hold the question bank, sessions, each participant's answers and their timing in one structure that still made sense with many people sitting the exam at once. Invigilating each screen by hand was impossible, so a tab switch became the signal — the moment a participant leaves the exam page, it is recorded and can be reviewed. Finally, WhatsApp notifications were wired through Fonnte at every stage, so applicants did not have to phone the school just to ask where things stood.",
    },
  },
];

export const fullProjects = projects.filter((p) => p.tier === 'full');

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
