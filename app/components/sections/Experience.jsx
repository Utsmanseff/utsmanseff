'use client';
import { useState } from 'react';
import { 
  Briefcase, 
  MapPin, 
  Calendar, 
  Award, 
  TrendingUp, 
  Users, 
  Clock,
  Building,
  Star,
  CheckCircle,
  Zap,
  Code,
  Database,
  Server,
  Target,
  ArrowRight
} from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import FadeIn from '../animations/FadeIn';
import AnimatedCounter from '../animations/AnimatedCounter';
import { 
  experiences, 
  experienceStats, 
  careerHighlights, 
  skillCategories,
  getAllTechnologies,
  getTotalProjects 
} from '../../data/experience';

const Experience = () => {
  const [activeExperience, setActiveExperience] = useState(0);

  const currentExperience = experiences[activeExperience];

  return (
    <section id="experience" className="py-20 bg-slate-800/50 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <FadeIn direction="up" delay={0.2}>
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              <Briefcase size={16} />
              Professional Journey
            </Badge>
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
              Work <span className="text-gradient bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text">Experience</span>
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Building digital solutions across healthcare and various industries with focus on innovation and impact
            </p>
          </div>
        </FadeIn>

        {/* Stats */}
        <FadeIn direction="up" delay={0.3}>
          <div className="grid md:grid-cols-4 gap-6 mb-16">
            {experienceStats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <Card key={index} variant="glass" className="p-6 text-center hover:scale-105">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="text-white" size={20} />
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">
                    <AnimatedCounter 
                      end={stat.number} 
                      suffix={stat.suffix}
                      duration={2000}
                    />
                  </div>
                  <div className="text-sm font-medium text-slate-300 mb-1">
                    {stat.label}
                  </div>
                  <div className="text-xs text-slate-500">
                    {stat.description}
                  </div>
                </Card>
              );
            })}
          </div>
        </FadeIn>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Experience Timeline */}
          <FadeIn direction="right" delay={0.4}>
            <Card variant="glass" className="p-8 h-fit sticky top-8">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Clock className="text-blue-400" size={20} />
                Career Timeline
              </h3>
              
              <div className="space-y-4">
                {experiences.map((exp, index) => (
                  <div
                    key={exp.id}
                    className={`relative cursor-pointer transition-all duration-300 ${
                      activeExperience === index
                        ? 'scale-105'
                        : 'hover:scale-102 opacity-70 hover:opacity-100'
                    }`}
                    onClick={() => setActiveExperience(index)}
                  >
                    <Card 
                      variant={activeExperience === index ? 'highlight' : 'glass'} 
                      className={`p-4 transition-all duration-300 ${
                        activeExperience === index ? 'ring-blue-500/50' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">{exp.companyLogo}</div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-white text-sm mb-1 truncate">
                            {exp.title}
                          </h4>
                          <p className="text-slate-400 text-xs mb-2 truncate">
                            {exp.company}
                          </p>
                          <div className="flex items-center gap-2 text-xs">
                            <Badge variant="tech" className="text-xs">
                              {exp.type}
                            </Badge>
                            <span className="text-slate-500">{exp.duration}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                    
                    {/* Timeline connector */}
                    {index < experiences.length - 1 && (
                      <div className="absolute left-8 top-full w-0.5 h-4 bg-slate-700" />
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </FadeIn>

          {/* Experience Details */}
          <div className="lg:col-span-2">
            <FadeIn direction="left" delay={0.5} key={activeExperience}>
              <Card variant="glass" className="p-8">
                {/* Header */}
                <div className="mb-8">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">{currentExperience.companyLogo}</div>
                      <div>
                        <h3 className="text-2xl font-bold text-white">
                          {currentExperience.title}
                        </h3>
                        <p className="text-xl text-blue-400 font-medium">
                          {currentExperience.company}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="primary" className="mb-2">
                        {currentExperience.type}
                      </Badge>
                      <div className="text-sm text-slate-400">
                        {currentExperience.period}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-sm text-slate-400">
                    <div className="flex items-center gap-1">
                      <MapPin size={14} />
                      {currentExperience.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      {currentExperience.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Building size={14} />
                      {currentExperience.industry}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-8">
                  <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                    <Building className="text-blue-400" size={16} />
                    Role Overview
                  </h4>
                  <p className="text-slate-300 leading-relaxed">
                    {currentExperience.description}
                  </p>
                </div>

                {/* Key Achievements */}
                <div className="mb-8">
                  <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <Award className="text-yellow-400" size={16} />
                    Key Achievements
                  </h4>
                  <div className="space-y-3">
                    {currentExperience.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="p-1 bg-green-500/20 rounded-full mt-1">
                          <CheckCircle size={12} className="text-green-400" />
                        </div>
                        <p className="text-slate-300 text-sm leading-relaxed flex-1">
                          {achievement}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Major Projects */}
                <div className="mb-8">
                  <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <Target className="text-purple-400" size={16} />
                    Major Projects
                  </h4>
                  <div className="grid md:grid-cols-1 gap-4">
                    {currentExperience.projects.map((project, index) => (
                      <Card key={index} variant="solid" className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h5 className="font-medium text-white text-sm">
                            {project.name}
                          </h5>
                          <Badge variant="success" className="text-xs">
                            {project.impact}
                          </Badge>
                        </div>
                        <p className="text-slate-400 text-xs leading-relaxed">
                          {project.description}
                        </p>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Technologies Used */}
                <div className="mb-8">
                  <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <Code className="text-blue-400" size={16} />
                    Technologies & Tools
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {currentExperience.technologies.map((tech, index) => (
                      <Badge key={index} variant="tech" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Skills Developed */}
                <div className="mb-8">
                  <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <Zap className="text-orange-400" size={16} />
                    Skills Developed
                  </h4>
                  <div className="grid md:grid-cols-2 gap-3">
                    {currentExperience.skills.map((skill, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Star size={12} className="text-yellow-400" />
                        <span className="text-slate-300 text-sm">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Responsibilities */}
                {currentExperience.responsibilities && (
                  <div className="mb-8">
                    <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                      <Target className="text-green-400" size={16} />
                      Key Responsibilities
                    </h4>
                    <div className="space-y-2">
                      {currentExperience.responsibilities.map((responsibility, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="p-1 bg-blue-500/20 rounded-full mt-1">
                            <CheckCircle size={10} className="text-blue-400" />
                          </div>
                          <p className="text-slate-400 text-sm leading-relaxed flex-1">
                            {responsibility}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Impact Summary */}
                <Card variant="highlight" className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <TrendingUp className="text-green-400" size={20} />
                    </div>
                    <div>
                      <h5 className="font-semibold text-green-400 mb-2">Overall Impact</h5>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        During my time at {currentExperience.company}, I successfully delivered multiple 
                        high-impact projects that significantly improved operational efficiency and user experience. 
                        My focus on innovative solutions and attention to detail resulted in measurable improvements 
                        across all systems I developed and maintained.
                      </p>
                    </div>
                  </div>
                </Card>
              </Card>
            </FadeIn>
          </div>
        </div>

        {/* Career Highlights */}
        <FadeIn direction="up" delay={0.8}>
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-white mb-8 text-center">
              Career Highlights
            </h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              {careerHighlights.map((highlight) => {
                const IconComponent = highlight.icon;
                return (
                  <Card key={highlight.id} variant="glass" className="p-6 text-center hover:scale-105">
                    <div className={`w-16 h-16 bg-gradient-to-r ${highlight.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <IconComponent className="text-white" size={24} />
                    </div>
                    <h4 className="text-lg font-semibold text-white mb-2">
                      {highlight.title}
                    </h4>
                    <p className="text-slate-400 text-sm mb-4">
                      {highlight.description}
                    </p>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {highlight.metrics.map((metric, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {metric}
                        </Badge>
                      ))}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </FadeIn>

        {/* Skills Overview */}
        <FadeIn direction="up" delay={0.9}>
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-white mb-8 text-center">
              Skills Overview
            </h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              {skillCategories.map((category, index) => {
                const IconComponent = category.icon;
                return (
                  <Card key={index} variant="glass" className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-blue-500/20 rounded-lg">
                        <IconComponent className="text-blue-400" size={20} />
                      </div>
                      <h4 className="text-lg font-semibold text-white">
                        {category.name}
                      </h4>
                    </div>
                    <div className="space-y-2">
                      {category.skills.map((skill, skillIndex) => (
                        <div key={skillIndex} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                          <span className="text-slate-300 text-sm">{skill}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </FadeIn>

      </div>
    </section>
  );
};

export default Experience;