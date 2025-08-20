import { 
  Monitor, 
  Server, 
  Database,
  Globe,
  Code,
  Heart,
  Building,
  ShoppingCart,
  Users,
  FileText,
  Settings,
  Shield
} from 'lucide-react';

const categoryIcons = {
  healthcare: Monitor,
  government: Server,
  ecommerce: ShoppingCart,
  education: Users,
  finance: Shield,
  corporate: Building
};

export const projects = [
  {
    id: 1,
    title: 'Sistem Informasi Pendaftaran Pasien RS',
    description: 'Platform digital untuk mempermudah pendaftaran pasien berdasarkan jadwal dokter dengan pembatasan kuota otomatis. Meningkatkan produktivitas resepsionis dan memberikan kemudahan akses informasi jadwal praktik dokter bagi pasien.',
    features: [
      'Pendaftaran berdasarkan jadwal yang diatur',
      'Pembatasan kuota pasien otomatis',
      'Pengelolaan data jadwal dan pendaftaran',
      'Interface yang user-friendly untuk pasien'
    ],
    tech: ['Laravel', 'React JS', 'Tailwind CSS', 'MySQL'],
    category: 'Healthcare',
    impact: 'Mengurangi waktu pendaftaran manual dan meningkatkan akurasi data pasien',
    status: 'Completed',
    year: '2024',
    client: 'RSU Nirwana Banjarbaru',
    results: [
      { metric: 'Efficiency Increase', value: '70%' },
      { metric: 'Time Saved', value: '5 hours/day' },
      { metric: 'Error Reduction', value: '90%' }
    ],
    image: '/assets/img/pendaftaran-rs.jpg',
    color: 'from-blue-500 to-cyan-500',
    demoUrl: '#',
    codeUrl: '#'
  },
  {
    id: 2,
    title: 'Sistem Rekam Medik Elektronik',
    description: 'Fitur input rekam medik elektronik yang memudahkan dokter dalam melakukan input hasil pemeriksaan dan diagnosa pasien secara digital dan terstruktur.',
    features: [
      'Input hasil pemeriksaan digital',
      'Diagnosa terstruktur',
      'Riwayat medis terintegrasi',
      'Interface dokter yang intuitif'
    ],
    tech: ['PHP Native', 'MySQL', 'HTML', 'CSS', 'JavaScript'],
    category: 'Healthcare',
    impact: 'Mempercepat proses dokumentasi medis dan meningkatkan akurasi data',
    status: 'Completed',
    year: '2025',
    client: 'RSU Nirwana Banjarbaru',
    results: [
      { metric: 'Documentation Speed', value: '3x faster' },
      { metric: 'Data Accuracy', value: '95%' },
      { metric: 'Doctor Satisfaction', value: '100%' }
    ],
    image: '/assets/img/rme.jpg',
    color: 'from-green-500 to-teal-500',
    demoUrl: '#',
    codeUrl: '#'
  },
  {
    id: 3,
    title: 'Sistem Download Berkas BPJS',
    description: 'Fitur download all untuk memudahkan tim JKN dalam mengumpulkan seluruh berkas pasien untuk klaim BPJS dengan sekali klik, menggantikan proses manual yang memakan waktu.',
    features: [
      'Download batch seluruh berkas',
      'Organisasi berkas otomatis',
      'Filter berdasarkan periode',
      'Kompresi file otomatis'
    ],
    tech: ['PHP Native', 'MySQL', 'JavaScript'],
    category: 'Healthcare',
    impact: 'Menghemat waktu pengumpulan berkas dari jam menjadi menit',
    status: 'Completed',
    year: '2025',
    client: 'RSU Nirwana Banjarbaru',
    results: [
      { metric: 'Time Reduction', value: '95%' },
      { metric: 'Files Processed', value: '1000+/day' },
      { metric: 'Staff Efficiency', value: '80%' }
    ],
    image: '/assets/img/jkn.jpg',
    color: 'from-purple-500 to-pink-500',
    demoUrl: '#',
    codeUrl: '#'
  },
  {
    id: 4,
    title: 'Sistem Manajemen Aset & Inventaris',
    description: 'Platform komprehensif untuk pencatatan, pelacakan, dan pemeliharaan aset menggunakan teknologi QR Code. Dikembangkan untuk UPPD Samsat Banjarmasin 2 dan UPT-KPHL Kapuas Kahayan.',
    features: [
      'Pencatatan aset dengan QR Code',
      'Pelacakan lokasi aset real-time',
      'Pengajuan pemeliharaan otomatis',
      'Laporan inventaris komprehensif'
    ],
    tech: ['Laravel Blade', 'MySQL', 'QR Code Technology'],
    category: 'Government',
    impact: 'Meningkatkan akurasi inventaris dan efisiensi pemeliharaan aset',
    status: 'Completed',
    year: '2025',
    client: 'Government Agencies',
    results: [
      { metric: 'Asset Tracking', value: '100%' },
      { metric: 'Inventory Accuracy', value: '99%' },
      { metric: 'Maintenance Efficiency', value: '75%' }
    ],
    image: '/assets/img/aset.jpg',
    color: 'from-orange-500 to-red-500',
    demoUrl: '#',
    codeUrl: '#'
  },
  {
    id: 5,
    title: 'Sistem Kepegawaian & Absensi Geolocation',
    description: 'Sistem manajemen kepegawaian dengan absensi berbasis lokasi, pengajuan cuti, lembur, dan penggajian otomatis untuk BPN Banjarbaru.',
    features: [
      'Absensi berbasis geolocation',
      'Pengajuan cuti dan lembur digital',
      'Penggajian otomatis',
      'Dashboard manajemen SDM'
    ],
    tech: ['Laravel Filament', 'Livewire', 'MySQL', 'Geolocation API'],
    category: 'Government',
    impact: 'Mengurangi fraud absensi dan mengotomatisasi proses penggajian',
    status: 'Completed',
    year: '2025',
    client: 'BPN Banjarbaru',
    results: [
      { metric: 'Attendance Accuracy', value: '100%' },
      { metric: 'Payroll Automation', value: '100%' },
      { metric: 'Time Savings', value: '60%' }
    ],
    image: '/assets/img/sigap.jpg',
    color: 'from-indigo-500 to-purple-500',
    demoUrl: '#',
    codeUrl: '#'
  }
];

export const projectCategories = [
  { 
    name: 'Healthcare', 
    color: 'from-blue-500 to-cyan-500', 
    count: projects.filter(p => p.category === 'Healthcare').length,
    icon: categoryIcons.healthcare,
    description: 'Medical and healthcare solutions'
  },
  { 
    name: 'Government', 
    color: 'from-green-500 to-teal-500', 
    count: projects.filter(p => p.category === 'Government').length,
    icon: categoryIcons.government,
    description: 'Government and public sector systems'
  },
  { 
    name: 'E-commerce', 
    color: 'from-purple-500 to-pink-500', 
    count: projects.filter(p => p.category === 'E-commerce').length,
    icon: categoryIcons.ecommerce,
    description: 'Online shopping and retail platforms'
  },
  { 
    name: 'Education', 
    color: 'from-yellow-500 to-orange-500', 
    count: projects.filter(p => p.category === 'Education').length,
    icon: categoryIcons.education,
    description: 'Educational and learning management systems'
  }
];

export const projectStats = {
  totalProjects: projects.length,
  completedProjects: projects.filter(p => p.status === 'Completed').length,
  inProgressProjects: projects.filter(p => p.status === 'In Progress').length,
  categories: projectCategories.length,
  technologies: [...new Set(projects.flatMap(p => p.tech))].length,
  clients: [...new Set(projects.map(p => p.client))].length
};

export const getProjectsByCategory = (category) => {
  return category === 'All' ? projects : projects.filter(p => p.category === category);
};

export const getProjectsByStatus = (status) => {
  return projects.filter(p => p.status === status);
};

export const getProjectsByYear = (year) => {
  return projects.filter(p => p.year === year);
};

export const getCategoryIcon = (category) => {
  switch (category) {
    case 'Healthcare':
      return Monitor;
    case 'Government':
      return Server;
    case 'E-commerce':
      return Globe;
    case 'Education':
      return Users;
    default:
      return Code;
  }
};

export default projects;