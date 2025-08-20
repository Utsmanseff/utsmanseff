'use client';
import { useState } from 'react';
import { 
  Briefcase, 
  ExternalLink, 
  Github, 
  Monitor, 
  Smartphone, 
  Database,
  Server,
  Globe,
  Code,
  Filter,
  Star,
  Calendar,
  Users,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Zap,
  ChevronDown,
  Eye
} from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import FadeIn from '../animations/FadeIn';
import { projects, projectCategories, projectStats, getCategoryIcon } from '../../data/projects';

const Projects = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [hoveredProject, setHoveredProject] = useState(null);
  const [showAllFilters, setShowAllFilters] = useState(false);
  const [expandedFeatures, setExpandedFeatures] = useState({});

  const categories = ['All', ...projectCategories.map(cat => cat.name)];
  
  const filteredProjects = activeFilter === 'All' 
    ? projects 
    : projects.filter(project => project.category === activeFilter);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="text-green-400" size={16} />;
      case 'In Progress':
        return <TrendingUp className="text-yellow-400" size={16} />;
      case 'Planning':
        return <Calendar className="text-blue-400" size={16} />;
      default:
        return <Code className="text-slate-400" size={16} />;
    }
  };

  const toggleFeatures = (projectId) => {
    setExpandedFeatures(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
  };

  return (
    <section id="projects" className="py-12 sm:py-16 lg:py-20 bg-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 sm:top-20 right-10 sm:right-20 w-48 sm:w-96 h-48 sm:h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 sm:bottom-20 left-10 sm:left-20 w-48 sm:w-96 h-48 sm:h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <FadeIn direction="up" delay={0.2}>
          <div className="text-center mb-12 sm:mb-16">
            <Badge variant="outline" className="mb-4">
              <Briefcase size={16} />
              My Work
            </Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 px-4">
              Featured <span className="text-gradient bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text">Projects</span>
            </h2>
            <p className="text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto px-4">
              Digital solutions that transform workflows and enhance productivity across various industries
            </p>
          </div>
        </FadeIn>

        {/* Project Stats */}
        <FadeIn direction="up" delay={0.25}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
            <Card variant="glass" className="p-4 sm:p-6 text-center hover:scale-105 transition-transform duration-300">
              <div className="w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <Briefcase className="text-white" size={18} />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-white mb-1">{projectStats.totalProjects}</div>
              <div className="text-xs sm:text-sm text-slate-400">Total Projects</div>
            </Card>

            <Card variant="glass" className="p-4 sm:p-6 text-center hover:scale-105 transition-transform duration-300">
              <div className="w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <CheckCircle className="text-white" size={18} />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-white mb-1">{projectStats.completedProjects}</div>
              <div className="text-xs sm:text-sm text-slate-400">Completed</div>
            </Card>

            <Card variant="glass" className="p-4 sm:p-6 text-center hover:scale-105 transition-transform duration-300">
              <div className="w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <Users className="text-white" size={18} />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-white mb-1">{projectStats.clients}</div>
              <div className="text-xs sm:text-sm text-slate-400">Happy Clients</div>
            </Card>

            <Card variant="glass" className="p-4 sm:p-6 text-center hover:scale-105 transition-transform duration-300">
              <div className="w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <Code className="text-white" size={18} />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-white mb-1">{projectStats.technologies}</div>
              <div className="text-xs sm:text-sm text-slate-400">Technologies</div>
            </Card>
          </div>
        </FadeIn>

        {/* Filter Tabs - Mobile Optimized */}
        <FadeIn direction="up" delay={0.3}>
          <div className="mb-8 sm:mb-12">
            {/* Filter Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-slate-400" />
                <span className="text-sm text-slate-400">Filter:</span>
              </div>
            </div>

            {/* Filter Buttons */}
            <div className={`grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3 sm:justify-center `}>
              {categories.map((category) => {
                const CategoryIcon = getCategoryIcon(category);
                const categoryData = projectCategories.find(cat => cat.name === category);
                const count = category === 'All' ? projectStats.totalProjects : categoryData?.count || 0;
                
                return (
                  <Button
                    key={category}
                    variant={activeFilter === category ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveFilter(category)}
                    className="transition-all duration-300 text-xs sm:text-sm justify-start sm:justify-center min-h-[2.5rem]"
                  >
                    <CategoryIcon size={14} />
                    <span className="truncate">{category}</span>
                    <Badge variant="outline" className="ml-1 sm:ml-2 text-xs">
                      {count}
                    </Badge>
                  </Button>
                );
              })}
            </div>
          </div>
        </FadeIn>

        {/* Projects Grid */}
        <div className="space-y-8 sm:space-y-12 lg:space-y-16">
          {filteredProjects.map((project, index) => {
            const isEven = index % 2 === 0;
            const isHovered = hoveredProject === project.id;
            const CategoryIcon = getCategoryIcon(project.category);
            const featuresExpanded = expandedFeatures[project.id];
            
            return (
              <FadeIn 
                key={`${project.id}-${activeFilter}`} 
                direction="up" 
                delay={0.1 * (index % 3)}
              >
                <Card 
                  variant="glass" 
                  className={`group transition-all duration-500 ${
                    isHovered ? 'scale-[1.01] sm:scale-[1.02] shadow-2xl shadow-blue-500/20' : ''
                  }`}
                  onMouseEnter={() => setHoveredProject(project.id)}
                  onMouseLeave={() => setHoveredProject(null)}
                >
                  <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 p-4 sm:p-6 lg:p-8">
                    <div className={`${!isEven && 'lg:order-2'} relative`}>
                      <div className="aspect-video bg-slate-800 rounded-xl overflow-hidden relative group">
                        <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-20`} />
                        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${project.image})` }}/>
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="text-center text-white p-4">
                            <Monitor size={48} className="sm:w-16 sm:h-16 mx-auto mb-3" />
                            <h3 className="text-lg font-semibold">{project.title}</h3>
                          </div>
                        </div>      
                      </div>
                    </div>

                    {/* Project Content */}
                    <div className={`${!isEven && 'lg:order-1'} space-y-4 sm:space-y-6`}>
                      {/* Project Header */}
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-3 sm:mb-4">
                          <Badge variant="tech" className="text-xs">
                            <CategoryIcon size={12} />
                            <span className="truncate">{project.category}</span>
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {getStatusIcon(project.status)}
                            {project.status}
                          </Badge>
                          <Badge variant="ghost" className="text-xs">
                            <Calendar size={12} />
                            {project.year}
                          </Badge>
                        </div>
                        
                        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3 group-hover:text-blue-400 transition-colors leading-tight">
                          {project.title}
                        </h3>
                        
                        <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-3 sm:mb-4">
                          {project.description}
                        </p>
                        
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400">
                          <Users size={12} />
                          <span>Client: {project.client}</span>
                        </div>
                      </div>

                      {/* Key Features */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-white flex items-center gap-2 text-sm sm:text-base">
                            <Star className="text-yellow-400" size={14} />
                            Key Features
                          </h4>
                        </div>
                        
                        <div className={`grid gap-2 transition-all duration-300 `}>
                          {project.features.map((feature, featureIndex) => (
                            <div key={featureIndex} className="flex items-start gap-2 text-xs sm:text-sm text-slate-300">
                              <CheckCircle size={12} className="text-green-400 mt-0.5 flex-shrink-0" />
                              <span className="leading-relaxed">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Technologies */}
                      <div>
                        <h4 className="font-semibold text-white mb-3 flex items-center gap-2 text-sm sm:text-base">
                          <Code className="text-blue-400" size={14} />
                          Technologies Used
                        </h4>
                        <div className="flex flex-wrap gap-1 sm:gap-2">
                          {project.tech.map((tech, techIndex) => (
                            <Badge key={techIndex} variant="tech" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Results */}
                      <div>
                        <h4 className="font-semibold text-white mb-3 flex items-center gap-2 text-sm sm:text-base">
                          <TrendingUp className="text-green-400" size={14} />
                          Results Achieved
                        </h4>
                        <div className="grid grid-cols-3 gap-2 sm:gap-4">
                          {project.results.map((result, resultIndex) => (
                            <div key={resultIndex} className="text-center p-2 sm:p-3 bg-slate-800/30 rounded-lg">
                              <div className="text-sm sm:text-lg font-bold text-white truncate">{result.value}</div>
                              <div className="text-xs text-slate-400 leading-tight">{result.metric}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Impact */}
                      <Card variant="highlight" className="p-3 sm:p-4">
                        <div className="flex items-start gap-3">
                          <div className="p-1.5 sm:p-2 bg-green-500/20 rounded-lg flex-shrink-0">
                            <Zap className="text-green-400" size={14} />
                          </div>
                          <div>
                            <h5 className="font-semibold text-green-400 mb-1 text-sm">Impact</h5>
                            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{project.impact}</p>
                          </div>
                        </div>
                      </Card>

                    </div>
                  </div>
                </Card>
              </FadeIn>
            );
          })}
        </div>

        {/* Call to Action */}
        <FadeIn direction="up" delay={0.8}>
          <div className="text-center mt-12 sm:mt-16 px-4">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">
              Interested in working together?
            </h3>
            <p className="text-slate-400 mb-6 sm:mb-8 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
              These are just a few examples of my work. I'm always excited to take on new challenges 
              and create innovative solutions for your business needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Button
                variant="primary"
                size="lg"
                className="w-full sm:w-auto"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Start a Project
                <ArrowRight size={16} />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
                onClick={() => document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' })}
              >
                View Experience
              </Button>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default Projects;