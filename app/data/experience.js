import { 
  Calendar, 
  CheckCircle, 
  Code, 
  Star,
  Building,
  MapPin,
  Clock,
  Award,
  Target,
  TrendingUp,
  Users,
  Zap,
  Heart,
  Server,
  Database
} from 'lucide-react';

const companyIcons = {
  healthcare: '🏥',
  freelance: '💼',
  government: '🏛️',
  tech: '💻',
  startup: '🚀'
};

export const experiences = [
  {
    id: 1,
    title: 'Staf IT',
    company: 'RSU Nirwana Banjarbaru',
    period: '2024 - Present',
    duration: '1 year',
    type: 'Full-time',
    location: 'Banjarbaru, Kalimantan Selatan',
    description: 'Bertanggung jawab dalam pengembangan dan pemeliharaan berbagai sistem informasi yang mendukung layanan rumah sakit. Menangani perawatan perangkat keras, troubleshooting, serta pengelolaan jaringan.',
    achievements: [
      'Mengembangkan sistem pendaftaran pasien yang meningkatkan efisiensi',
      'Membuat fitur rekam medik elektronik untuk dokter',
      'Mengotomatisasi proses download berkas BPJS',
      'Maintenance sistem IT rumah sakit secara keseluruhan'
    ],
    technologies: ['Laravel', 'React JS', 'MySQL', 'PHP', 'JavaScript', 'Tailwind CSS'],
    projects: [
      {
        name: 'Patient Registration System',
        impact: '70% efficiency increase',
        description: 'Automated patient registration with doctor schedule integration'
      },
      {
        name: 'Electronic Medical Records',
        impact: '3x faster documentation',
        description: 'Digital medical record system for doctors'
      },
      {
        name: 'BPJS File Management',
        impact: '95% time reduction',
        description: 'Automated batch download system for insurance claims'
      }
    ],
    skills: ['Full-stack Development', 'System Integration', 'Database Design', 'Healthcare IT'],
    color: 'from-blue-500 to-cyan-500',
    companyLogo: companyIcons.healthcare,
    industry: 'Healthcare',
    teamSize: '5-10',
    responsibilities: [
      'Developing and maintaining hospital information systems',
      'Hardware maintenance and network management',
      'System troubleshooting and technical support',
      'Database administration and optimization',
      'User training and documentation'
    ]
  },
  {
    id: 2,
    title: 'Freelance Web Developer',
    company: 'Various Clients',
    period: 'January 2024 - Present',
    duration: '1 year',
    type: 'Freelance',
    location: 'Remote',
    description: 'Mengembangkan website dan sistem informasi yang disesuaikan dengan kebutuhan setiap klien, dengan fokus pada fungsionalitas dan kualitas hasil kerja.',
    achievements: [
      'Menangani 10+ klien dengan tingkat kepuasan tinggi',
      'Mengembangkan sistem untuk instansi pemerintah',
      'Spesialisasi dalam sistem manajemen dan digitalisasi proses bisnis',
      'Membangun long-term relationship dengan klien'
    ],
    technologies: ['Laravel', 'Laravel Filament', 'Next.js', 'React', 'MySQL', 'PostgreSQL', 'Tailwind CSS'],
    projects: [
      {
        name: 'Asset Management System',
        impact: '99% inventory accuracy',
        description: 'QR Code-based asset tracking for government agencies'
      },
      {
        name: 'HR Management System',
        impact: '100% attendance accuracy',
        description: 'Geolocation-based attendance with payroll automation'
      },
      {
        name: 'Various Web Applications',
        impact: '10+ satisfied clients',
        description: 'Custom solutions for different business needs'
      }
    ],
    skills: ['Client Management', 'Custom Development', 'Project Management', 'Business Analysis'],
    color: 'from-purple-500 to-pink-500',
    companyLogo: companyIcons.freelance,
    industry: 'Various',
    teamSize: '1-3',
    responsibilities: [
      'Client requirement analysis and consultation',
      'Full-stack web application development',
      'Project timeline and resource management',
      'Quality assurance and testing',
      'Client training and ongoing support'
    ]
  }
];

export const experienceStats = [
  { 
    number: 2, 
    suffix: '+', 
    label: 'Years Experience',
    description: 'Professional development',
    icon: Calendar
  },
  { 
    number: 15, 
    suffix: '+', 
    label: 'Projects Completed',
    description: 'Successful deliveries',
    icon: CheckCircle
  },
  { 
    number: 10, 
    suffix: '+', 
    label: 'Technologies',
    description: 'Tools & frameworks',
    icon: Code
  },
  { 
    number: 100, 
    suffix: '%', 
    label: 'Client Satisfaction',
    description: 'Quality commitment',
    icon: Star
  }
];

export const careerHighlights = [
  {
    id: 1,
    title: 'Efficiency Expert',
    description: 'Consistently delivered solutions that improve operational efficiency by 50-95%',
    icon: TrendingUp,
    color: 'from-blue-500 to-cyan-500',
    metrics: ['70% efficiency increase', '95% time reduction', '3x faster processes']
  },
  {
    id: 2,
    title: 'Client Focused',
    description: 'Maintained 100% client satisfaction through quality delivery and excellent communication',
    icon: Users,
    color: 'from-purple-500 to-pink-500',
    metrics: ['100% client satisfaction', '10+ happy clients', 'Long-term relationships']
  },
  {
    id: 3,
    title: 'Tech Innovator',
    description: 'Specialized in transforming manual processes into automated digital solutions',
    icon: Code,
    color: 'from-green-500 to-teal-500',
    metrics: ['10+ technologies mastered', 'Healthcare digitalization', 'Process automation']
  }
];

export const skillCategories = [
  {
    name: 'Technical Skills',
    skills: [
      'Full-stack Development',
      'Database Design',
      'System Integration',
      'API Development',
      'Performance Optimization'
    ],
    icon: Code
  },
  {
    name: 'Soft Skills',
    skills: [
      'Project Management',
      'Client Communication',
      'Problem Solving',
      'Team Collaboration',
      'Business Analysis'
    ],
    icon: Users
  },
  {
    name: 'Industry Knowledge',
    skills: [
      'Healthcare IT',
      'Government Systems',
      'Process Automation',
      'Digital Transformation',
      'Quality Assurance'
    ],
    icon: Building
  }
];

export const calculateTotalExperience = () => {
  const startYear = 2024; 
  const currentYear = new Date().getFullYear();
  return currentYear - startYear + 1;
};

export const getAllTechnologies = () => {
  const allTech = experiences.flatMap(exp => exp.technologies);
  return [...new Set(allTech)];
};

export const getAllSkills = () => {
  const allSkills = experiences.flatMap(exp => exp.skills);
  return [...new Set(allSkills)];
};

export const getExperiencesByType = (type) => {
  return experiences.filter(exp => exp.type === type);
};

export const getExperiencesByIndustry = (industry) => {
  return experiences.filter(exp => exp.industry === industry);
};

export const getTotalProjects = () => {
  return experiences.reduce((total, exp) => total + exp.projects.length, 0);
};

export const getIndustries = () => {
  const industries = experiences.map(exp => exp.industry);
  return [...new Set(industries)];
};

export const getExperienceById = (id) => {
  return experiences.find(exp => exp.id === id);
};

export const getLatestExperience = () => {
  return experiences[0]; 
};

export default experiences;