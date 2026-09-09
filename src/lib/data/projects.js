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
    year: '2026',
    role: { id: 'Pengembang tunggal', en: 'Sole developer' },
    tier: 'full',
    access: 'public',
    site: 'https://rsunirwana.id',
    image: '/assets/img/pendaftaran.png',
    tech: ['Laravel', 'Next.js', 'MySQL', 'Google Vision', 'REST API'],
    shortName: { id: 'Web & Pendaftaran', en: 'Site & Registration' },
    // Halaman ini bercerita tentang situsnya, dengan pembacaan KTP sebagai
    // puncaknya — bukan tentang OCR sendirian. Fakta situs lamanya (statis,
    // isinya hardcoded, pendaftaran yang tidak membedakan pasien baru dan
    // lama, dan hasilnya tidak sampai ke SIMRS) datang dari Utsman.
    blurb: {
      id: 'Web rumah sakit beserta pendaftaran pasien baru yang datanya diisi dari hasil pembacaan foto KTP.',
      en: "A hospital website together with new patient registration, filled in from a scan of the patient's ID card.",
    },
    title: {
      id: 'Web Rumah Sakit dan Pendaftaran Pasien Baru',
      en: 'Hospital Website and New Patient Registration',
    },
    context: {
      id: 'Web rumah sakit sebelumnya bersifat statis dan modulnya belum lengkap, karena sebagian besar isinya ditulis langsung di dalam kode. Pendaftaran online yang ada juga belum membedakan pasien baru dan pasien lama, sehingga keduanya harus mengisi data diri dari awal pada setiap pendaftaran, dan data tersebut belum terhubung ke SIMRS. Web ini dibangun untuk menggantikannya. Halaman publiknya dapat diperbarui tanpa mengubah kode, pendaftarannya membedakan pasien baru dan pasien lama, data pasien baru diisi dari hasil pembacaan foto KTP, dan data pendaftaran dikirim ke registrasi SIMRS melalui API.',
      en: "The hospital's previous website was static and its modules were incomplete, because most of its content was written directly into the code. The online registration did not distinguish between new and returning patients, so both had to enter their personal details from scratch on every registration, and that data never reached the SIMRS. This site was built to replace it. Its public pages can be updated without changing code, registration separates new patients from returning ones, new patient data is filled in from a scan of the ID card, and registration data is sent to the SIMRS registration records through an API.",
    },
    built: {
      id: [
        'Beranda, Tentang Kami, dan Dokter Kami sebagai halaman perkenalan',
        'Klinik Spesialis, Layanan Unggulan, dan Layanan',
        'Informasi, tempat artikel dan pengumuman rumah sakit',
        'Pendaftaran yang membedakan pasien baru dan pasien lama',
        'Pendaftaran pasien baru dalam tiga langkah: identitas, data pasien, pendaftaran',
        'Pembacaan nama, NIK, dan alamat dari foto KTP melalui Google Cloud Vision',
        'Isian manual sebagai alternatif apabila foto KTP tidak terbaca',
        'Data pendaftaran ditampung di web, kemudian dikirim ke registrasi SIMRS melalui API lewat tombol sinkronkan',
        'Bukti pendaftaran untuk verifikasi di loket',
        'Validasi sisi server pada seluruh formulir',
      ],
      en: [
        'Home, About Us, and Our Doctors as introductory pages',
        'Specialist Clinics, Featured Services, and Services',
        'Information, holding hospital articles and announcements',
        'Registration that distinguishes new patients from returning ones',
        'New patient registration in three steps: identity, patient data, registration',
        'Name, NIK, and address read from a photo of the ID card through Google Cloud Vision',
        'Manual entry as an alternative when the ID card photo cannot be read',
        'Registration data held in the site, then sent to the SIMRS registration records through an API from a sync button',
        'A registration slip for verification at the counter',
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
    tech: ['Laravel', 'JavaScript', 'MySQL', 'REST API'],
    shortName: { id: 'IDRG Bridging', en: 'IDRG Bridging' },
    blurb: {
      id: 'Penghubung data klaim rumah sakit dengan sistem BPJS.',
      en: "A connector between the hospital's claim data and the BPJS system.",
    },
    title: {
      id: 'Bridging IDRG / INA-CBGs untuk Klaim BPJS',
      en: 'IDRG / INA-CBGs Bridging for BPJS Claims',
    },
    // SatuSehat didudukkan sesuai kenyataannya: pengirimannya lewat service
    // tersendiri, bukan dari layanan ini — tetapi data diagnosanya berasal
    // dari coding di sini, dan itulah keterkaitannya.
    context: {
      id: 'Klaim BPJS dikirim melalui bridging antara sistem rumah sakit dan sistem BPJS. Aturannya kemudian berubah. Sebelumnya klaim cukup melalui coding dan grouping INA-CBG, sedangkan sekarang klaim harus melalui coding dan grouping IDRG terlebih dahulu. Layanan ini menangani keduanya, kemudian mengirimkan klaimnya. Hasil coding diagnosa dari layanan ini juga dikirim otomatis ke SatuSehat melalui service tersendiri.',
      en: 'BPJS claims are submitted through a bridge between the hospital system and the BPJS system. The rules then changed. Claims previously only went through INA-CBG coding and grouping, whereas now they must go through IDRG coding and grouping first. This service handles both, then submits the claim. The diagnosis coding it produces is also sent automatically to SatuSehat through a separate service.',
    },
    built: {
      id: [
        'Layanan penghubung antara SIMRS dan endpoint BPJS, mengikuti dokumentasi resmi',
        'Coding dan grouping IDRG, kemudian pemetaannya ke grouper INA-CBG',
        'Antrian pengiriman klaim beserta penanganan kegagalan pengiriman',
        'Pencatatan riwayat permintaan untuk menelusuri klaim yang ditolak',
        'Hasil coding diagnosa dikirim otomatis ke SatuSehat melalui service tersendiri',
      ],
      en: [
        'A connecting service between the SIMRS and the BPJS endpoints, following the official documentation',
        'IDRG coding and grouping, then mapping into the INA-CBG grouper',
        'A claim submission queue with failure handling',
        'Request history logging so that rejected claims can be traced',
        'Diagnosis coding results sent automatically to SatuSehat through a separate service',
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
      id: 'Sebelumnya absensi menggunakan mesin absen, pengajuan cuti dilakukan melalui surat, dan data pegawai disimpan di Excel. Aplikasi ini menyatukan ketiganya. Absensinya menggunakan lokasi dan deteksi wajah, serta terhubung dengan jadwal shift setiap pegawai.',
      en: "Attendance previously ran on a punch clock, leave was requested on paper, and staff data was kept in Excel. This application brings the three together. Its attendance uses location and face detection, and is tied to each employee's shift.",
    },
    built: {
      id: [
        'Absensi dengan deteksi wajah dan lokasi yang terikat pada shift pegawai',
        'Pengajuan cuti dan izin',
        'Pengelolaan jadwal dan shift',
        'Data sumber daya manusia dan struktur organisasi',
        'Pencatatan inventaris',
        'Ticketing internal',
        'Notifikasi dan pengingat masa berlaku SIP/STR',
        'Pencatatan surat peringatan dan tindakan disiplin',
        'Berjalan sebagai PWA yang dapat dipasang di ponsel pegawai',
      ],
      en: [
        "Attendance with face detection and location, tied to the employee's shift",
        'Leave and permission requests',
        'Schedule and shift management',
        'Staff records and organisational structure',
        'Inventory records',
        'Internal ticketing',
        'Notifications and SIP/STR expiry reminders',
        'Warning letters and disciplinary records',
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
    tech: ['Laravel', 'JavaScript', 'MySQL', 'Livewire'],
    shortName: { id: 'RME', en: 'EMR' },
    blurb: {
      id: 'Pencatatan rekam medis elektronik untuk rawat jalan dan rawat inap.',
      en: 'Electronic medical records for outpatient and inpatient care.',
    },
    title: { id: 'Rekam Medis Elektronik', en: 'Electronic Medical Records' },
    // Nama SIMRS-nya tidak disebut. Ia memang open source dan dipakai apa
    // adanya, tetapi namanya tidak perlu berdiri di halaman ini.
    context: {
      id: 'Rekam medis elektronik untuk rawat jalan dan rawat inap, digunakan oleh dokter dan perawat asisten dokter. Rumah sakit sudah menggunakan SIMRS open source, sehingga rekam medis ini dibangun sebagai aplikasi web terpisah yang menulis ke basis data yang sama, agar pencatatan dan pelaporannya tetap menyatu.',
      en: 'Electronic medical records for outpatient and inpatient care, used by doctors and the nurses assisting them. The hospital already runs an open source SIMRS, so these records were built as a separate web application that writes into the same database, so that records and reports stay together.',
    },
    // "Pencatatan SOAP" di sini singkatan rekam medis — subjektif, objektif,
    // asesmen, plan. Bukan protokol SOAP yang sudah keluar dari stack IDRG.
    built: {
      id: [
        'Pencatatan SOAP untuk rawat jalan dan rawat inap',
        'Pencatatan tanda-tanda vital',
        'Penegakan diagnosa dengan kode ICD',
        'Permintaan pemeriksaan laboratorium',
        'Permintaan pemeriksaan radiologi',
        'Permintaan resep',
        'Penyusunan resume medis',
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
    // Naik dari 'brief' pada 2026-09-10. Absensi terikat lokasi, data SDM,
    // pengajuan lembur dan cuti, serta hitungan penggajian bulanan — isi
    // setingkat IDRG dan RME, dan satu baris blurb tidak cukup menampungnya.
    tier: 'full',
    access: 'none',
    site: null,
    image: '/assets/img/sigap.jpg',
    tech: ['Laravel', 'Filament', 'Livewire', 'MySQL', 'Tailwind CSS'],
    shortName: { id: 'SIGAP', en: 'SIGAP' },
    blurb: {
      id: 'Kepegawaian dengan absensi berbasis lokasi dan perhitungan gaji bulanan yang bersumber dari absensi, lembur, dan cuti.',
      en: 'Staff management with location-based attendance and a monthly pay calculation drawn from attendance, overtime, and leave.',
    },
    title: {
      id: 'Kepegawaian dan Absensi Berbasis Lokasi',
      en: 'Staffing and Location-Based Attendance',
    },
    // Kalimat terakhir menyebut batasnya sendiri. Larangan payroll yang
    // tertulis berlaku untuk HRIS RSU Nirwana; SIGAP sistem lain milik klien
    // lain, dan ia memang menghitung — tetapi tidak membayarkan.
    context: {
      id: 'Pengelolaan kepegawaian dengan absensi yang terikat pada lokasi kerja, sehingga kehadiran tercatat sesuai tempat pegawai bertugas. Data absensi, lembur, dan cuti digunakan sebagai dasar perhitungan gaji bulanan. Aplikasi ini mencatat dan menghitung komponennya, tetapi tidak menjalankan pembayaran.',
      en: 'Staff management with attendance tied to the work site, so presence is recorded against where the employee actually works. Attendance, overtime, and leave data are the basis for the monthly pay calculation. The application records and calculates the components, but does not carry out payment.',
    },
    built: {
      id: [
        'Absensi yang terikat pada titik lokasi kerja',
        'Pengelolaan data sumber daya manusia',
        'Pengajuan lembur',
        'Pengajuan cuti',
        'Pencatatan penggajian bulanan yang dihitung dari absensi, lembur, dan cuti',
      ],
      en: [
        'Attendance tied to the work site location',
        'Human resource records',
        'Overtime requests',
        'Leave requests',
        'Monthly pay records calculated from attendance, overtime, and leave',
      ],
    },
  },
  {
    slug: 'simaset',
    client: 'UPT-KPHL',
    clientKey: 'upt-kphl',
    year: '2025',
    role: { id: 'Pengembang tunggal', en: 'Sole developer' },
    // Naik dari 'brief' pada 2026-09-10, bersama SIGAP. Kode QR per unit dan
    // depresiasi yang terhitung sendiri tidak muat di satu baris blurb.
    tier: 'full',
    access: 'none',
    site: null,
    image: '/assets/img/aset.jpg',
    tech: ['Laravel', 'JavaScript', 'MySQL'],
    shortName: { id: 'SIMASET', en: 'SIMASET' },
    blurb: {
      id: 'Pengelolaan aset dengan kode QR per unit, pelacakan lokasi dan kondisi, jadwal perawatan, serta perhitungan depresiasi.',
      en: 'Asset management with a QR code per unit, location and condition tracking, maintenance scheduling, and depreciation calculation.',
    },
    title: { id: 'Manajemen Aset dan Inventaris', en: 'Asset and Inventory Management' },
    context: {
      id: 'Pengelolaan aset milik UPT-KPHL Kapuas Kahayan, mencakup pencatatan lokasi dan kondisi setiap aset, penjadwalan perawatan, serta pelaporan. Setiap aset memiliki kode QR yang dapat dicetak dan ditempel pada unitnya, dan pemindaian kode tersebut membuka rincian aset yang bersangkutan.',
      en: 'Asset management for UPT-KPHL Kapuas Kahayan, covering location and condition records for each asset, maintenance scheduling, and reporting. Every asset has a QR code that can be printed and attached to the unit, and scanning that code opens the details of the asset concerned.',
    },
    built: {
      id: [
        'Pencatatan aset beserta lokasi dan kondisinya',
        'Kode QR per unit aset, dapat dicetak dan ditempel',
        'Pemindaian kode QR yang langsung membuka rincian aset',
        'Penjadwalan perawatan aset',
        'Perhitungan nilai depresiasi secara otomatis',
        'Pelaporan aset',
      ],
      en: [
        'Asset records with location and condition',
        'A QR code per asset unit, ready to print and attach',
        "QR scanning that opens the asset's details directly",
        'Maintenance scheduling',
        'Automatic depreciation calculation',
        'Asset reporting',
      ],
    },
  },
  {
    slug: 'sibenih',
    client: 'BPSBTPH',
    clientKey: 'bpsbtph',
    year: '2024',
    role: { id: 'Pengembang tunggal', en: 'Sole developer' },
    tier: 'brief',
    access: 'none',
    site: null,
    image: '/assets/img/sertifikasi.png',
    tech: ['Laravel', 'Filament', 'Livewire', 'MySQL'],
    shortName: { id: 'SIBENIH', en: 'SIBENIH' },
    blurb: {
      id: 'Sertifikasi benih tanaman, mulai dari pengajuan hingga penerbitan sertifikat digital.',
      en: 'Plant seed certification, from application through to a digital certificate.',
    },
    title: { id: 'Aplikasi Sertifikasi Benih', en: 'Seed Certification System' },
    // Nama panjang lembaganya hidup di sini, bukan di label plate: label itu
    // whitespace-nowrap dan plate-nya kecil.
    context: {
      id: 'Pendaftaran dan pemantauan sertifikasi benih tanaman pada Balai Pengawasan dan Sertifikasi Benih Tanaman Pangan dan Hortikultura (BPSBTPH) Kalimantan Selatan, mulai dari pengajuan hingga penerbitan sertifikat digital.',
      en: 'Registration and monitoring for plant seed certification at the South Kalimantan Seed Supervision and Certification Agency for Food Crops and Horticulture (BPSBTPH), from application through to a digital certificate.',
    },
    built: { id: [], en: [] },
  },
  {
    slug: 'simbas',
    client: 'Kecamatan Basarang',
    clientKey: 'kecamatan-basarang',
    year: '2025',
    role: { id: 'Pengembang tunggal', en: 'Sole developer' },
    tier: 'brief',
    access: 'none',
    site: null,
    image: null,
    tech: ['Laravel', 'JavaScript', 'MySQL'],
    shortName: { id: 'SIMBAS', en: 'SIMBAS' },
    blurb: {
      id: 'Pengelolaan bantuan sosial kecamatan, mulai dari pendataan penerima hingga pelaporan penyaluran.',
      en: 'Social assistance management for a subdistrict, from recipient records through to distribution reporting.',
    },
    title: { id: 'Manajemen Bantuan Sosial', en: 'Social Assistance Management' },
    context: {
      id: 'Pengelolaan bantuan sosial di Kecamatan Basarang, mencakup pendataan penerima, pengajuan, penyaluran, hingga pelaporan.',
      en: 'Social assistance management in Basarang subdistrict, covering recipient records, applications, distribution, and reporting.',
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
    shortName: { id: 'PSB & CBT', en: 'Admissions & CBT' },
    blurb: {
      id: 'Pendaftaran sampai ujian masuk berbasis browser, dengan notifikasi WhatsApp di tiap tahap.',
      en: 'Registration through a browser-based entrance exam, with WhatsApp notifications at every stage.',
    },
    title: {
      id: 'Penerimaan Siswa Baru dengan Ujian CBT',
      en: 'School Admissions with Computer-Based Testing',
    },
    context: {
      id: 'Pendaftaran dan ujian masuk sebelumnya dilakukan secara tatap muka dan menggunakan kertas. Seluruh tahapannya kemudian dipindahkan ke satu aplikasi. Calon siswa mendaftar secara online, mengerjakan ujian langsung di browser, dan menerima pemberitahuan melalui WhatsApp pada setiap tahap hingga hasil diumumkan.',
      en: 'Registration and the entrance exam were previously done face to face and on paper. All of the stages were then moved into one application. Prospective students register online, sit the exam directly in the browser, and receive notifications through WhatsApp at every stage until results are announced.',
    },
    built: {
      id: [
        'Pendaftaran calon siswa secara online',
        'Ujian CBT yang dikerjakan langsung di browser',
        'Deteksi perpindahan tab selama ujian berlangsung',
        'Notifikasi WhatsApp otomatis melalui Fonnte pada setiap tahap',
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
