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
      screenshots: ['/assets/img/rme.png'],
      shortName: {
        id: 'Pendaftaran OCR',
        en: 'OCR Registration',
      },
      title: {
        id: 'Pendaftaran Rumah Sakit Berbasis OCR',
        en: 'OCR-Powered Hospital Registration',
      },
      summary: {
        id: 'OCR KTP otomatis mengisi formulir pendaftaran. Data sinkron langsung ke SIMRS internal — antrian loket berkurang signifikan.',
        en: 'Indonesian ID-card OCR auto-fills the form, with data syncing straight into the internal SIMRS — counter queues dropped significantly.',
      },
      tech: ['Laravel', 'MySQL', 'Google Vision', 'REST API'],
      problem: {
        id: 'Pendaftaran online lama hanya mengamankan kuota; pasien tetap antri panjang di loket. Form panjang dan rawan typo, terutama untuk lansia. Resepsionis input ulang karena data web tidak masuk SIMRS.',
        en: 'The legacy pre-registration only secured a queue slot. Patients still queued at the counter, the long form was error-prone for elderly users, and receptionists re-entered data manually because the web flow never reached the internal SIMRS.',
      },
      approach: {
        id: 'Alur pendaftaran dirancang ulang dengan OCR KTP via Google Cloud Vision. Data sinkron langsung ke SIMRS, ditambah bukti pendaftaran QR untuk verifikasi loket.',
        en: 'Rebuilt the flow around KTP OCR via Google Cloud Vision, with data syncing directly into SIMRS and a QR confirmation slip for fast counter verification.',
        bullets: {
          id: [
            'OCR KTP isi otomatis nama, NIK, alamat',
            'Sinkronisasi data ke SIMRS internal',
            'Bukti pendaftaran QR untuk loket',
            'Validasi server-side untuk konsistensi data',
          ],
          en: [
            'OCR auto-fills name, NIK, address',
            'Direct data sync into internal SIMRS',
            'QR confirmation slip for counter verification',
            'Server-side validation across the form',
          ],
        },
      },
      outcome: {
        id: 'Antrian loket turun signifikan. Completion rate pendaftaran lansia naik. Double-entry resepsionis hilang.',
        en: 'Counter queues dropped significantly, elderly completion rate climbed, and receptionist double-entry was eliminated.',
      },
      hard: {
        id: 'Tuning akurasi OCR untuk foto KTP dengan pencahayaan dan sudut yang sangat variatif — sambil menyelaraskan dua skema data milik pihak berbeda tanpa merusak ekspektasi vendor.',
        en: 'Tuning OCR accuracy across wildly inconsistent KTP photos while aligning two separately-owned data schemas without breaking the vendor SIMRS contract.',
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
      screenshots: ['/assets/img/eklaim.png'],
      shortName: {
        id: 'IDRG Bridging',
        en: 'IDRG Bridging',
      },
      title: {
        id: 'Bridging IDRG / INA-CBGs untuk Klaim BPJS',
        en: 'IDRG / INA-CBGs Bridging for BPJS Claims',
      },
      summary: {
        id: 'Web service kustom dari nol untuk menyelamatkan akses bridging BPJS rumah sakit di bawah deadline Kemenkes.',
        en: 'A custom integration service built from scratch to rescue the hospital\'s BPJS bridging access under a Ministry of Health deadline.',
      },
      tech: ['Laravel', 'REST API', 'MySQL', 'BPJS API', 'INA-CBGs'],
      problem: {
        id: 'Surat edaran Kemenkes mewajibkan update IDRG dan integrasi diagnosa SIMRS ke SatuSehat. Bridging vendor SIMRS tidak lulus uji. Akses terancam diputus — klaim BPJS tidak bisa dikirim sama sekali.',
        en: 'A Ministry of Health circular required IDRG updates and SIMRS-to-SatuSehat diagnosis integration. The vendor bridging failed compliance, and access was about to be revoked — meaning the hospital could no longer submit BPJS claims at all.',
      },
      approach: {
        id: 'Web service kustom dibangun dari nol langsung dari dokumentasi BPJS — bertindak sebagai mediator antara SIMRS dan endpoint BPJS, memaksakan skema yang tools vendor tidak bisa.',
        en: 'A custom web service built from scratch directly against the BPJS documentation, acting as the mediator between SIMRS and BPJS endpoints and enforcing the schema the vendor tooling could not.',
        bullets: {
          id: [
            'Integrasi endpoint eligibility, klaim, status, IDRG grouping',
            'Mapping kode diagnosa internal ke INA-CBGs',
            'Logging dan retry untuk request gagal',
            'Dashboard monitoring status klaim per batch',
          ],
          en: [
            'Eligibility, claim, status, and IDRG grouping endpoints',
            'Internal diagnosis codes mapped to INA-CBGs',
            'Logging and retry for failed requests',
            'Per-batch claim status monitoring dashboard',
          ],
        },
      },
      outcome: {
        id: 'Lulus uji kepatuhan Kemenkes. Akses bridging dipulihkan. Klaim mengalir lancar ke BPJS dan sistem internal.',
        en: 'Passed Kemenkes compliance, restored bridging access, and claims now flow cleanly to both BPJS and the internal system.',
      },
      hard: {
        id: 'Mengoordinasi banyak endpoint BPJS di bawah deadline regulator eksternal — tanpa margin untuk retry. Kalau bridging tetap diputus, RS tidak bisa kirim klaim sama sekali.',
        en: 'Coordinating many BPJS endpoints under an external regulator deadline with zero margin for retries — if bridging stayed revoked, the hospital simply could not submit claims.',
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
      screenshots: ['/assets/img/rme.jpg'],
      shortName: {
        id: 'RME',
        en: 'EMR',
      },
      title: {
        id: 'Rekam Medis Elektronik (RME)',
        en: 'Electronic Medical Records (EMR)',
      },
      summary: {
        id: 'Lapisan RME paralel di atas SIMRS vendor 1.168 tabel — UI yang akhirnya dokter mau pakai.',
        en: 'A parallel EMR layer on top of a 1,168-table vendor SIMRS — finally a UI doctors actually use.',
      },
      tech: ['Laravel', 'MySQL', 'Livewire', 'Blade'],
      problem: {
        id: 'Permenkes mewajibkan RME — ancamannya SIP dokter dicabut dan akreditasi turun. Modul RME vendor SIMRS tersedia tapi UI-nya canggung; dokter diam-diam kembali catat manual di kertas.',
        en: 'A Permenkes regulation mandated EMR adoption — non-compliance threatened doctors\' practice licenses and hospital accreditation. The vendor EMR module existed but the UI was awkward, so doctors quietly went back to paper.',
      },
      approach: {
        id: 'Lapisan RME paralel dibangun dengan UI yang dibentuk dari kemauan dokter, di atas database SIMRS vendor yang sama. Tetap menulis ke tabel kanonik supaya laporan existing tidak rusak.',
        en: 'A parallel EMR layer built around what the doctors actually wanted, sitting on top of the same vendor SIMRS database. Everything still writes back to the canonical SIMRS tables so existing reports keep working.',
        bullets: {
          id: [
            'Form SOAP cepat dengan template per spesialisasi',
            'Permintaan lab/radiologi sekali klik',
            'Resep dengan autocomplete obat dari master',
            'Tetap menulis ke tabel kanonik SIMRS',
          ],
          en: [
            'Fast SOAP forms with per-specialty templates',
            'One-click lab and radiology requests',
            'Prescription autocomplete from drug master',
            'Writes back to canonical SIMRS tables',
          ],
        },
      },
      outcome: {
        id: 'Dokter mulai input RME secara digital. Paparan regulasi RS berkurang. Adopsi sebagian, tapi nyata.',
        en: 'Doctors started using the EMR digitally. Hospital regulatory exposure dropped. Partial adoption — but real.',
      },
      hard: {
        id: 'Database SIMRS punya 1.168 tabel tanpa dokumentasi. Memetakan tabel klinis, relasi, dan constraint adalah arkeologi data — bukan UI work.',
        en: 'The SIMRS database has 1,168 tables and no documentation. Mapping which tables owned which clinical data — and which constraints would break — was data archaeology, not UI work.',
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
