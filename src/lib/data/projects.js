// Project data, locale-keyed.
// `featured` projects render as full case studies; `other` as compact list.

export const projects = {
  featured: [
    {
      id: 'rsu-nirwana-web',
      slug: 'rsu-nirwana',
      client: 'RSU Nirwana',
      year: '2025',
      status: 'live',
      site: 'https://rsunirwana.id',
      sector: { id: 'Healthcare', en: 'Healthcare' },
      image: '/assets/img/rme.png',
      screenshots: [
        // TODO: replace with real captures from rsunirwana.id
        '/assets/img/rme.png',
      ],
      title: {
        id: 'Website RSU Nirwana — Pendaftaran OCR',
        en: 'RSU Nirwana — OCR Hospital Registration',
      },
      summary: {
        id: 'Mendisain ulang pendaftaran online RS dengan OCR KTP dan integrasi langsung ke sistem internal.',
        en: 'Redesigned hospital online registration with KTP OCR scanning and direct integration into the internal system.',
      },
      tech: ['Laravel', 'MySQL', 'Google Vision API', 'REST API'],
      problem: {
        id: 'Pendaftaran online hanya mengamankan kuota — pasien tetap antri panjang di loket untuk daftar ulang. Form pendaftaran panjang dan rawan typo, terutama untuk lansia. Data web tidak terintegrasi ke sistem internal, jadi resepsionis input ulang.',
        en: 'Online pre-registration only reserved a queue slot — patients still queued at the counter to re-register. The long form was error-prone, especially for elderly patients. Web data lived in isolation from the internal hospital system, forcing receptionists to duplicate entry.',
      },
      approach: {
        id: 'Bangun ulang alur pendaftaran dengan OCR KTP via Google Cloud Vision API, lalu hubungkan langsung ke sistem internal RS. Pasien yang sudah daftar online cukup tunjukkan bukti di loket.',
        en: 'Rebuilt the registration flow with KTP (Indonesian ID) OCR via Google Cloud Vision API, then bridged directly into the internal hospital system. Pre-registered patients only show a confirmation slip at the counter.',
        bullets: {
          id: [
            'OCR KTP otomatis isi nama, NIK, alamat',
            'Sinkronisasi data pendaftaran ke SIMRS internal',
            'Bukti pendaftaran QR untuk verifikasi loket',
            'Validasi field sisi server untuk konsistensi data',
          ],
          en: [
            'KTP OCR auto-fills name, NIK, address',
            'Registration data syncs into internal SIMRS',
            'QR registration receipt for counter verification',
            'Server-side validation for data consistency',
          ],
        },
      },
      outcome: {
        id: 'Antrian loket berkurang drastis, completion rate pendaftaran lansia naik, double-entry resepsionis hilang. Live di rsunirwana.id.',
        en: 'Counter queues dropped significantly, elderly registration completion rate rose, receptionist double-entry was eliminated. Live at rsunirwana.id.',
      },
      hard: {
        id: 'Tuning akurasi OCR untuk foto KTP dengan pencahayaan dan sudut yang sangat variatif, dan menyelaraskan dua skema data milik pihak berbeda (web app dan SIMRS vendor) tanpa membuat ekspektasi vendor pecah.',
        en: 'Tuning OCR accuracy on KTP photos taken in highly variable lighting and skew, and aligning two separately-owned data schemas (web app and vendor SIMRS) without breaking the vendor\'s expectations.',
      },
    },
    {
      id: 'idrg-bridging',
      slug: 'idrg-bridging',
      client: 'RSU Nirwana',
      year: '2025',
      status: 'internal',
      site: null,
      sector: { id: 'Healthcare', en: 'Healthcare' },
      image: '/assets/img/eklaim.png',
      screenshots: [
        // TODO: internal — Utsman to provide
        '/assets/img/eklaim.png',
      ],
      title: {
        id: 'Bridging IDRG/INA-CBGs untuk Klaim BPJS',
        en: 'IDRG / INA-CBGs Full Bridging for BPJS Claims',
      },
      summary: {
        id: 'Membangun layanan integrasi sendiri untuk menyelamatkan akses bridging BPJS rumah sakit di bawah deadline Kemenkes.',
        en: 'Built a custom integration service to rescue the hospital\'s BPJS bridging access under a Ministry of Health deadline.',
      },
      tech: ['Laravel', 'REST API', 'MySQL', 'BPJS API', 'INA-CBGs'],
      problem: {
        id: 'Surat edaran Kemenkes menuntut update patch IDRG dan integrasi data diagnosa SIMRS ke SatuSehat. Vendor SIMRS punya bridging IDRG, tapi syarat komponennya tidak sesuai. Uji coba ditolak, akses bridging terancam diputus — yang artinya klaim BPJS tidak bisa dikirim sama sekali.',
        en: 'A Ministry of Health (Kemenkes) circular required IDRG patch updates and integration of SIMRS diagnostic data into SatuSehat. The vendor SIMRS had IDRG bridging, but the component layout did not meet the new requirements. The compliance test failed and bridging access — the channel for submitting BPJS claims — was about to be revoked.',
      },
      approach: {
        id: 'Bangun web service kustom dari nol untuk integrasi data klaim sesuai spesifikasi Kemenkes baru, langsung dari dokumentasi API BPJS. Service mediator antara data SIMRS internal dan endpoint BPJS, memaksakan skema yang vendor tidak bisa.',
        en: 'Built a custom web service from scratch to integrate claim data per the new Kemenkes specification, working from BPJS API documentation directly. The service mediates between internal SIMRS data and BPJS endpoints, enforcing the schema the vendor tool didn\'t.',
        bullets: {
          id: [
            'Integrasi endpoint eligibility, klaim, status, IDRG grouping',
            'Mapping kode diagnosa internal ke INA-CBGs',
            'Logging dan retry untuk request gagal',
            'Dashboard monitoring status klaim per batch',
          ],
          en: [
            'Integrated eligibility, claim submission, status, IDRG grouping endpoints',
            'Mapped internal diagnosis codes to INA-CBGs',
            'Logging and retry for failed requests',
            'Per-batch claim status monitoring dashboard',
          ],
        },
      },
      outcome: {
        id: 'Lulus uji kepatuhan Kemenkes, akses bridging dipulihkan, klaim mengalir lancar ke BPJS dan sistem internal.',
        en: 'Passed the Kemenkes compliance test, restored bridging access, claims now flow correctly to both BPJS and the internal system.',
      },
      hard: {
        id: 'Mengoordinasikan banyak endpoint BPJS (eligibility, submit klaim, status, IDRG grouping) di bawah deadline regulator eksternal, tanpa margin untuk retry — kalau bridging tetap diputus, RS tidak bisa kirim klaim sama sekali.',
        en: 'Coordinating multiple BPJS API endpoints (eligibility, claim submission, status, IDRG grouping) under a deadline imposed by an external regulator, with no margin for retries — if bridging access stayed revoked, the hospital couldn\'t submit claims at all.',
      },
    },
    {
      id: 'rme',
      slug: 'rme',
      client: 'RSU Nirwana',
      year: '2025',
      status: 'internal',
      site: null,
      sector: { id: 'Healthcare', en: 'Healthcare' },
      image: '/assets/img/rme.jpg',
      screenshots: [
        // TODO: internal — Utsman to provide
        '/assets/img/rme.jpg',
      ],
      title: {
        id: 'Rekam Medis Elektronik (RME)',
        en: 'Electronic Medical Records (EMR)',
      },
      summary: {
        id: 'RME paralel di atas SIMRS vendor 1.168 tabel — UI yang akhirnya dokter mau pakai.',
        en: 'A parallel EMR on top of a 1,168-table vendor SIMRS — a UI doctors actually use.',
      },
      tech: ['Laravel', 'MySQL', 'Livewire', 'Blade'],
      problem: {
        id: 'Permenkes mewajibkan RME, ancamannya SIP dokter dicabut dan akreditasi RS turun. Modul RME vendor SIMRS sudah ada, tapi UI-nya canggung — dokter diam-diam balik catat manual di kertas: SOAP, permintaan lab, resep, radiologi.',
        en: 'A Permenkes regulation mandated electronic medical records, with non-compliance threatening doctors\' practice licenses (SIP) and the hospital\'s accreditation. The vendor SIMRS EMR module existed but the UI was awkward — doctors quietly went back to paper for SOAP notes, lab requests, prescriptions, and radiology orders.',
      },
      approach: {
        id: 'Bangun lapisan RME paralel dengan UI yang dibentuk dari kemauan dokter, di atas database SIMRS vendor yang sama. SOAP, lab, resep, radiologi semua tetap nulis ke tabel kanonik SIMRS supaya laporan existing tidak rusak.',
        en: 'Built a parallel EMR layer with a UI shaped by what doctors actually wanted, sitting on top of the same vendor SIMRS database. SOAP notes, lab requests, prescriptions, and radiology orders all flow back into the canonical SIMRS tables so existing reports keep working.',
        bullets: {
          id: [
            'Form SOAP cepat dengan template per spesialisasi',
            'Permintaan lab/radiologi sekali klik',
            'Resep dengan autocomplete obat dari master',
            'Tetap menulis ke tabel kanonik SIMRS',
          ],
          en: [
            'Fast SOAP form with per-specialty templates',
            'One-click lab/radiology requests',
            'Prescription autocomplete from drug master',
            'Writes back to canonical SIMRS tables',
          ],
        },
      },
      outcome: {
        id: 'Dokter mulai input RME secara digital, paparan regulasi RS berkurang. Adopsi sebagian tapi nyata.',
        en: 'Doctors started using the EMR digitally instead of paper. Partial but real adoption, hospital regulatory exposure reduced.',
      },
      hard: {
        id: 'Database SIMRS vendor punya 1.168 tabel. Memetakan tabel mana yang punya data klinis mana, relasinya bagaimana, constraint mana yang akan rusak kalau saya tulis — itu reverse-engineering sistem yang tidak ada dokumentasinya. Sebagian besar pekerjaan bukan UI, tapi arkeologi data di database orang lain.',
        en: "The vendor SIMRS database has 1,168 tables. Mapping out which ones owned which clinical data, what their relationships were, and which constraints would break if I wrote into them required reverse-engineering a system I had no documentation for. Most of the work wasn’t UI — it was patient archaeology in a database designed by someone else.",
      },
    },
  ],

  other: [
    {
      id: 'sigap-bpn',
      year: '2025',
      client: 'BPN Banjarbaru',
      title: {
        id: 'Sistem Kepegawaian & Absensi Geolocation',
        en: 'Personnel & Geolocation Attendance System',
      },
      desc: {
        id: 'Manajemen kepegawaian dan absensi berbasis lokasi untuk memastikan kehadiran pegawai sesuai lokasi kerja.',
        en: 'Personnel management and geolocation-based attendance to verify presence at the assigned work location.',
      },
      tech: ['Laravel', 'Livewire', 'MySQL', 'Geolocation API'],
      image: '/assets/img/sigap.jpg',
      features: {
        id: ['Absensi geolocation', 'Manajemen cuti & izin', 'Laporan kehadiran', 'Dashboard pegawai'],
        en: ['Geolocation attendance', 'Leave & permission management', 'Attendance reports', 'Personnel dashboard'],
      },
    },
    {
      id: 'aset-kphl',
      year: '2025',
      client: 'UPT-KPHL Kapuas Kahayan',
      title: {
        id: 'Sistem Manajemen Aset & Inventaris',
        en: 'Asset & Inventory Management System',
      },
      desc: {
        id: 'Pengelolaan aset dan inventaris organisasi dengan tracking, maintenance, dan reporting.',
        en: 'Organization-wide asset and inventory management with tracking, maintenance, and reporting.',
      },
      tech: ['Laravel', 'Blade', 'MySQL'],
      image: '/assets/img/aset.jpg',
      features: {
        id: ['Pencatatan aset', 'Tracking lokasi & kondisi', 'Jadwal maintenance', 'Laporan & dokumentasi'],
        en: ['Asset cataloging', 'Location & condition tracking', 'Maintenance schedule', 'Reports & documentation'],
      },
    },
    {
      id: 'sertifikasi-benih',
      year: '2025',
      client: 'BPSPTPH Banjarbaru',
      title: {
        id: 'Aplikasi Sertifikasi Benih',
        en: 'Seed Certification System',
      },
      desc: {
        id: 'Pendaftaran dan monitoring sertifikasi benih tanaman untuk proses sertifikasi yang efisien dan transparan.',
        en: 'Plant seed certification registration and monitoring for efficient, transparent certification.',
      },
      tech: ['Laravel', 'Livewire', 'MySQL'],
      image: '/assets/img/sertifikasi.png',
      features: {
        id: ['Pendaftaran online', 'Monitoring status', 'Notifikasi progres', 'Sertifikat digital'],
        en: ['Online registration', 'Status monitoring', 'Progress notifications', 'Digital certificates'],
      },
    },
  ],

  soon: [
    {
      id: 'ppdb-cbt',
      title: {
        id: 'PPDB Online dengan Computer-Based Test',
        en: 'Online School Admissions with Computer-Based Test',
      },
      tech: ['Laravel'],
    },
  ],
};
