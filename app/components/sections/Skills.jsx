'use client';
import { useState, useEffect } from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import FadeIn from '../animations/FadeIn';
import AnimatedCounter from '../animations/AnimatedCounter';
import { skills, skillCategories, additionalSkills } from '../../data/skills';
import { Code, Filter, Star, TrendingUp, Award, Zap, ChevronRight } from 'lucide-react';

const Skills = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const filteredSkills = activeFilter === 'All' 
    ? skills 
    : skills.filter(skill => skill.category === activeFilter);

  const filterOptions = ['All', ...skillCategories.map(cat => cat.name)];

  const getSkillLevelText = (level) => {
    if (level >= 90) return { text: "Expert", color: "text-emerald-400" };
    if (level >= 80) return { text: "Advanced", color: "text-blue-400" };
    if (level >= 70) return { text: "Intermediate", color: "text-yellow-400" };
    return { text: "Learning", color: "text-orange-400" };
  };

  return (
    <section id="skills" className="py-20 bg-slate-900/50 relative overflow-hidden">
      {/* Enhanced Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl animate-spin-slow" />
        
        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-blue-400/20 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <FadeIn direction="up" delay={0.2}>
          <div className="text-center mb-16">
            <Badge variant="skill" className="mb-4 animate-bounce-subtle">
              <Code size={16} />
              Technical Expertise
            </Badge>
            <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6 animate-text-shimmer">
              Skills & <span className="text-gradient bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text animate-gradient">Technologies</span>
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Proficient in modern web technologies with a focus on creating 
              efficient, scalable, and user-friendly solutions
            </p>
          </div>
        </FadeIn>

        {/* Enhanced Stats Cards */}
        <FadeIn direction="up" delay={0.3}>
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <Card variant="glass" className="p-6 text-center group hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300 shadow-lg">
                <Code className="text-white group-hover:scale-110 transition-transform" size={24} />
              </div>
              <div className="text-3xl font-bold text-white mb-2">
                <AnimatedCounter end={skills.length} duration={2000} />
              </div>
              <div className="text-sm text-slate-400 font-medium">Technologies</div>
              <div className="w-full h-1 bg-slate-700 rounded-full mt-3 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-progress-fill" />
              </div>
            </Card>

            <Card variant="glass" className="p-6 text-center group hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:shadow-green-500/20">
              <div className="w-14 h-14 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300 shadow-lg">
                <Star className="text-white group-hover:scale-110 transition-transform" size={24} />
              </div>
              <div className="text-3xl font-bold text-white mb-2">
                <AnimatedCounter end={85} suffix="%" duration={2500} />
              </div>
              <div className="text-sm text-slate-400 font-medium">Avg Proficiency</div>
              <div className="w-full h-1 bg-slate-700 rounded-full mt-3 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-green-600 rounded-full animate-progress-fill" style={{ animationDelay: '0.3s' }} />
              </div>
            </Card>

            <Card variant="glass" className="p-6 text-center group hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20">
              <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300 shadow-lg">
                <TrendingUp className="text-white group-hover:scale-110 transition-transform" size={24} />
              </div>
              <div className="text-3xl font-bold text-white mb-2">
                <AnimatedCounter end={2} suffix="+" duration={1500} />
              </div>
              <div className="text-sm text-slate-400 font-medium">Years Experience</div>
              <div className="w-full h-1 bg-slate-700 rounded-full mt-3 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-500 to-violet-600 rounded-full animate-progress-fill" style={{ animationDelay: '0.6s' }} />
              </div>
            </Card>

            <Card variant="glass" className="p-6 text-center group hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/20">
              <div className="w-14 h-14 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300 shadow-lg">
                <Award className="text-white group-hover:scale-110 transition-transform" size={24} />
              </div>
              <div className="text-3xl font-bold text-white mb-2">
                <AnimatedCounter end={skillCategories.length} duration={1000} />
              </div>
              <div className="text-sm text-slate-400 font-medium">Categories</div>
              <div className="w-full h-1 bg-slate-700 rounded-full mt-3 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full animate-progress-fill" style={{ animationDelay: '0.9s' }} />
              </div>
            </Card>
          </div>
        </FadeIn>

        {/* Enhanced Filter Buttons */}
        <FadeIn direction="up" delay={0.4}>
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <div className="flex items-center gap-2 mr-6 p-3 bg-slate-800/50 rounded-full border border-slate-700/50">
              <Filter size={18} className="text-blue-400" />
              <span className="text-sm font-medium text-slate-300">Filter by:</span>
            </div>
            {filterOptions.map((filter) => {
              const isActive = activeFilter === filter;
              const count = filter === 'All' ? skills.length : skills.filter(s => s.category === filter).length;
              
              return (
                <Button
                  key={filter}
                  variant={isActive ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveFilter(filter)}
                  className={`relative transition-all duration-300 hover:scale-105 ${
                    isActive ? 'shadow-lg shadow-blue-500/25' : ''
                  }`}
                >
                  <span className="relative z-10">{filter}</span>
                  <Badge variant="outline" className="ml-2 text-xs">
                    {count}
                  </Badge>
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg animate-pulse opacity-20" />
                  )}
                </Button>
              );
            })}
          </div>
        </FadeIn>

        {/* Enhanced Skills Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredSkills.map((skill, index) => {
            const IconComponent = skill.icon;
            const isHovered = hoveredSkill === skill.id;
            const levelInfo = getSkillLevelText(skill.level);
            
            return (
              <FadeIn 
                key={`${skill.id}-${activeFilter}`} 
                direction="up" 
                delay={0.1 * (index % 6)}
              >
                <Card 
                  variant="glass" 
                  className={`group p-6 cursor-pointer transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20 border-slate-700/50 hover:border-blue-500/50 ${
                    isHovered ? 'scale-105 -translate-y-2' : 'hover:scale-102'
                  }`}
                  onMouseEnter={() => setHoveredSkill(skill.id)}
                  onMouseLeave={() => setHoveredSkill(null)}
                >
                  {/* Card Header */}
                  <div className="flex items-center gap-4 mb-6">
                    <div 
                      className={`relative p-3 rounded-2xl transition-all duration-500 shadow-lg ${
                        isHovered 
                          ? `bg-gradient-to-r ${skill.color} shadow-2xl animate-pulse-glow scale-110` 
                          : `bg-gradient-to-r ${skill.color} opacity-90 group-hover:opacity-100`
                      }`}
                    >
                      <IconComponent size={28} className="text-white" />
                      {isHovered && (
                        <div className="absolute inset-0 rounded-2xl bg-white/20 animate-ping" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white group-hover:text-blue-100 transition-colors">
                        {skill.name}
                      </h3>
                      <Badge variant="tech" className="text-xs mt-1">
                        {skill.category}
                      </Badge>
                    </div>
                    <ChevronRight 
                      size={20} 
                      className={`text-slate-400 transition-all duration-300 ${
                        isHovered ? 'text-blue-400 translate-x-1' : ''
                      }`} 
                    />
                  </div>
                  
                  <p className="text-sm text-slate-300 mb-6 leading-relaxed group-hover:text-slate-200 transition-colors">
                    {skill.description}
                  </p>
                  
                  {/* Enhanced Skill Level */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-400 font-medium">Proficiency Level</span>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-bold text-lg">
                          <AnimatedCounter 
                            end={skill.level} 
                            suffix="%" 
                            trigger={isHovered}
                            duration={1000}
                          />
                        </span>
                        {skill.level >= 85 && (
                          <Star size={16} className="text-yellow-400 fill-current animate-spin-slow" />
                        )}
                      </div>
                    </div>
                    
                    {/* Enhanced Progress Bar */}
                    <div className="relative">
                      <div className="progress-bar h-3 bg-slate-700/50 rounded-full overflow-hidden shadow-inner">
                        <div
                          className={`progress-fill h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden ${
                            isHovered ? 'animate-pulse shadow-lg' : ''
                          }`}
                          style={{ 
                            width: isVisible ? `${skill.level}%` : '0%',
                            background: `linear-gradient(90deg, rgb(59 130 246), rgb(139 92 246))`,
                            transform: isHovered ? 'scaleY(1.2)' : 'scaleY(1)',
                            transitionDelay: `${index * 0.1}s`
                          }}
                        >
                          {/* Animated shine effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 animate-shine" />
                        </div>
                      </div>
                      
                      {/* Progress markers */}
                      <div className="absolute top-0 left-0 right-0 flex justify-between h-3">
                        {[25, 50, 75].map(marker => (
                          <div 
                            key={marker}
                            className="w-px h-full bg-slate-600/50"
                            style={{ left: `${marker}%` }}
                          />
                        ))}
                      </div>
                    </div>
                    
                    {/* Skill Level Badge */}
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full bg-slate-800/50 ${levelInfo.color}`}>
                        {levelInfo.text}
                      </span>
                      {skill.level >= 80 && (
                        <div className="flex items-center gap-1">
                          <Zap size={12} className="text-yellow-400" />
                          <span className="text-xs text-yellow-400 font-medium">High Skill</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Hover Effect Overlay */}
                  <div className={`absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 pointer-events-none transition-opacity duration-300 ${
                    isHovered ? 'opacity-100' : 'opacity-0'
                  }`} />
                  
                  {/* Animated border */}
                  <div className={`absolute inset-0 rounded-xl border-2 border-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 transition-opacity duration-300 ${
                    isHovered ? 'opacity-100 animate-border-spin' : ''
                  }`} style={{ mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', maskComposite: 'subtract' }} />
                </Card>
              </FadeIn>
            );
          })}
        </div>

        {/* Enhanced Additional Skills */}
        <FadeIn direction="up" delay={0.6}>
          <Card variant="highlight" className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl shadow-lg">
                  <Zap className="text-white" size={28} />
                </div>
                <h3 className="text-3xl font-bold text-white">Additional Skills</h3>
              </div>
              <p className="text-slate-400 text-lg">
                Beyond technical skills, I bring strong soft skills and methodologies
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {additionalSkills.map((skill, index) => {
                const IconComponent = skill.icon;
                return (
                  <div 
                    key={index}
                    className="group p-5 bg-slate-800/40 rounded-xl border border-slate-700/30 hover:border-blue-500/50 transition-all duration-500 hover:bg-slate-700/40 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20 cursor-pointer"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-slate-700/50 rounded-xl group-hover:bg-blue-500/20 transition-all duration-300 shadow-md">
                        <IconComponent size={20} className="text-slate-400 group-hover:text-blue-400 transition-colors" />
                      </div>
                      <span className="text-sm font-semibold text-slate-300 group-hover:text-white transition-colors">
                        {skill.name}
                      </span>
                    </div>
                    
                    {/* Hover indicator */}
                    <div className="w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300 mt-3 rounded-full" />
                  </div>
                );
              })}
            </div>
          </Card>
        </FadeIn>
      </div>
    </section>
  );
};

export default Skills;