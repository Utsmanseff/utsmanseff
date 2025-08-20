import { 
  Globe, 
  Monitor, 
  Code, 
  Server, 
  Database, 
  Layout,
  Cpu,
  Zap,
  Layers,
  GitBranch,
  Terminal,
  Palette,
  FileCode,
  Settings,
  Braces
} from 'lucide-react';

export const skills = [
  {
    id: 1,
    name: 'HTML5',
    level: 90,
    icon: () => <i className="fab fa-html5 text-3xl"></i>, 
    category: 'Frontend',
    color: 'from-orange-500 to-red-500',
    description: 'Semantic markup, accessibility, and modern HTML5 features including Canvas, WebGL, and Progressive Web Apps'
  },
  {
    id: 2,
    name: 'CSS3',
    level: 85,
    icon: () => <i className="fab fa-css3-alt text-3xl"></i>, 
    category: 'Frontend', 
    color: 'from-blue-500 to-blue-600',
    description: 'Advanced styling, animations, Grid, Flexbox, and responsive design with modern CSS techniques'
  },
  {
    id: 3,
    name: 'JavaScript',
    level: 80,
    icon: () => <i className="fab fa-js-square text-3xl"></i>, 
    category: 'Frontend',
    color: 'from-yellow-400 to-yellow-500',
    description: 'ES6+, DOM manipulation, async programming, modules, and modern JavaScript frameworks'
  },
  {
    id: 4,
    name: 'Laravel',
    level: 92,
    icon: () => <i className="fab fa-laravel text-3xl"></i>, 
    category: 'Backend',
    color: 'from-red-500 to-red-600',
    description: 'Full-stack PHP framework with MVC architecture, Eloquent ORM, and API development'
  },
  {
    id: 5,
    name: 'Laravel Filament',
    level: 85,
    icon: () => <i className="fab fa-laravel text-3xl"></i>, 
    category: 'Backend',
    color: 'from-amber-500 to-orange-500',
    description: 'Rapid admin panel development with modern UI components and form builders'
  },
  {
    id: 6,
    name: 'Tailwind CSS',
    level: 80,
    icon: () => <i className="fab fa-react text-3xl"></i>, 
    category: 'Frontend',
    color: 'from-cyan-400 to-blue-500',
    description: 'Utility-first CSS framework for rapid UI development with custom design systems'
  },
  {
    id: 7,
    name: 'React JS',
    level: 78,
    icon: () => <i className="fab fa-react text-3xl"></i>, 
    category: 'Frontend',
    color: 'from-blue-400 to-cyan-400',
    description: 'Component-based UI library with hooks, state management, and modern React patterns'
  },
  {
    id: 8,
    name: 'Next.js',
    level: 75,
    icon: FileCode,
    category: 'Frontend',
    color: 'from-gray-700 to-gray-900',
    description: 'React framework with SSR, SSG, API routes, and performance optimizations'
  },
  {
    id: 9,
    name: 'MySQL',
    level: 90,
    icon: Database,
    category: 'Database',
    color: 'from-blue-600 to-blue-700',
    description: 'Relational database design, optimization, stored procedures, and complex queries'
  },
  {
    id: 10,
    name: 'PostgreSQL',
    level: 70,
    icon: Database,
    category: 'Database',
    color: 'from-blue-700 to-indigo-700',
    description: 'Advanced relational database with JSON support and complex data types (Learning)'
  },
  {
    id: 11,
    name: 'PHP',
    level: 90,
    icon: () => <i className="fab fa-php text-3xl"></i>, 
    category: 'Backend',
    color: 'from-purple-600 to-indigo-600',
    description: 'Server-side scripting, OOP principles, and modern PHP 8+ features'
  },
  {
    id: 12,
    name: 'Git',
    level: 82,
    icon: GitBranch,
    category: 'Tools',
    color: 'from-orange-600 to-red-600',
    description: 'Version control, branching strategies, and collaborative development workflows'
  }
];

export const skillCategories = [
  { 
    name: 'Frontend', 
    color: 'from-blue-500 to-purple-500', 
    count: 5,
    icon: Monitor,
    description: 'Client-side technologies and user interface development'
  },
  { 
    name: 'Backend', 
    color: 'from-green-500 to-teal-500', 
    count: 3,
    icon: Server,
    description: 'Server-side development and API creation'
  },
  { 
    name: 'Database', 
    color: 'from-orange-500 to-red-500', 
    count: 2,
    icon: Database,
    description: 'Data management and database optimization'
  },
  { 
    name: 'Tools', 
    color: 'from-purple-500 to-pink-500', 
    count: 2,
    icon: Settings,
    description: 'Development tools and productivity software'
  }
];

export const additionalSkills = [
  { name: 'Problem Solving', icon: Cpu, description: 'Analytical thinking and debugging' },
  { name: 'Team Collaboration', icon: Layers, description: 'Agile methodologies and teamwork' },
  { name: 'Project Management', icon: Monitor, description: 'Planning and execution' },
  { name: 'Database Design', icon: Database, description: 'Schema design and optimization' },
  { name: 'API Development', icon: Server, description: 'RESTful and GraphQL APIs' },
  { name: 'Version Control (Git)', icon: GitBranch, description: 'Collaborative development' },
  { name: 'Performance Optimization', icon: Zap, description: 'Code and database optimization' },
  { name: 'UI/UX Design', icon: Palette, description: 'User experience and interface design' }
];

export const getSkillsByCategory = (category) => {
  return skills.filter(skill => skill.category === category);
};

export const getTopSkills = (limit = 5) => {
  return skills
    .sort((a, b) => b.level - a.level)
    .slice(0, limit);
};

export const getAverageSkillLevel = () => {
  const total = skills.reduce((sum, skill) => sum + skill.level, 0);
  return Math.round(total / skills.length);
};

export const getSkillsCount = () => {
  return {
    total: skills.length,
    expert: skills.filter(s => s.level >= 90).length,
    advanced: skills.filter(s => s.level >= 80 && s.level < 90).length,
    intermediate: skills.filter(s => s.level >= 70 && s.level < 80).length,
    learning: skills.filter(s => s.level < 70).length
  };
};

export const debugSkills = () => {
  console.log('=== Skills Debug Info ===');
  console.log('Total skills:', skills.length);
  console.log('Skills with levels:', skills.map(s => ({ name: s.name, level: s.level })));
  console.log('Average level:', getAverageSkillLevel());
  console.log('Skills count by level:', getSkillsCount());
  console.log('Categories:', skillCategories);
  return {
    skills,
    skillCategories,
    additionalSkills,
    stats: {
      total: skills.length,
      average: getAverageSkillLevel(),
      categories: skillCategories.length
    }
  };
};

export default skills;