'use client';
import { useState, useEffect } from 'react';
import { 
  User, 
  GraduationCap, 
  Target, 
  Heart, 
  Lightbulb, 
  Users, 
  Zap, 
  Trophy,
  Calendar,
  MapPin,
  Mail,
  CheckCircle,
  ArrowRight,
  Code,
  Database,
  Globe
} from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import FadeIn from '../animations/FadeIn';
import SlideIn from '../animations/SlideIn';

const AnimatedCounter = ({ end, suffix = '', duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { 
        threshold: 0.1, 
        rootMargin: '50px' 
      }
    );

    const element = document.getElementById('about');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      setCount(Math.floor(progress * end));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, isVisible]);

  return <span>{count}{suffix}</span>;
};

const About = () => {
  const [activeTab, setActiveTab] = useState('journey');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const tabs = [
    { id: 'journey', label: 'My Journey', icon: User },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'values', label: 'Core Values', icon: Heart },
    { id: 'goals', label: 'Goals', icon: Target }
  ];

  const achievements = [
    { 
      number: 70, 
      suffix: '%', 
      label: 'Efficiency Improvement',
      description: 'Hospital registration system optimization',
      icon: Trophy,
      color: 'from-yellow-500 to-orange-500'
    },
    { 
      number: 15, 
      suffix: '+', 
      label: 'Projects Completed',
      description: 'Across healthcare and government sectors',
      icon: CheckCircle,
      color: 'from-green-500 to-emerald-500'
    },
    { 
      number: 2, 
      suffix: '+', 
      label: 'Years Experience',
      description: 'Professional web development',
      icon: Calendar,
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      number: 100, 
      suffix: '%', 
      label: 'Client Satisfaction',
      description: 'Dedicated to quality delivery',
      icon: Heart,
      color: 'from-pink-500 to-rose-500'
    }
  ];

  const coreValues = [
    {
      icon: Lightbulb,
      title: 'Innovation-driven Development',
      description: 'Always seeking creative solutions to complex problems',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Users,
      title: 'User-centric Design',
      description: 'Putting user experience at the heart of every solution',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Zap,
      title: 'Continuous Learning',
      description: 'Staying updated with latest technologies and best practices',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Trophy,
      title: 'Quality-focused Delivery',
      description: 'Committed to delivering robust and maintainable code',
      color: 'from-green-500 to-teal-500'
    }
  ];

  const personalInfo = [
    { label: 'Location', value: 'Banjarbaru, Kalimantan Selatan', icon: MapPin, color: 'text-blue-400' },
    { label: 'Email', value: 'seffutsmannnn@gmail.com', icon: Mail, color: 'text-green-400' },
    { label: 'Experience', value: '2+ Years', icon: Calendar, color: 'text-purple-400' },
    { label: 'Focus', value: 'Fullstack Development', icon: User, color: 'text-pink-400' }
  ];

  const skills = [
    { icon: Code, label: 'Frontend', items: ['React', 'Next.js', 'Tailwind CSS'] },
    { icon: Database, label: 'Backend', items: ['Laravel', 'Livewire', 'PostgreSQL', 'MySQL'] },
    { icon: Globe, label: 'Tools', items: ['Git', 'Laragon'] }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'journey':
        return (
          <div className="space-y-8">
            <div className="space-y-6">
              <FadeIn delay={0.1}>
                <p className="text-slate-300 leading-relaxed text-lg">
                  As a graduate of <span className="text-blue-400 font-medium glow-text">Informatics Engineering</span>, 
                  I have developed a strong passion for technological advancement and digital innovation. 
                  What drives me in web development is witnessing how rapidly evolving times constantly 
                  require technology and digitalization to enhance work productivity and efficiency.
                </p>
              </FadeIn>
              
              <FadeIn delay={0.2}>
                <p className="text-slate-300 leading-relaxed text-lg">
                  Throughout my career, I have specialized in transforming manual processes into automated 
                  digital solutions, particularly in <span className="text-purple-400 font-medium glow-text">healthcare and government sectors</span>. 
                  My experience ranges from developing patient registration systems that improved hospital 
                  efficiency by 70% to creating comprehensive asset management platforms for government institutions.
                </p>
              </FadeIn>
              
              <FadeIn delay={0.3}>
                <p className="text-slate-300 leading-relaxed text-lg">
                  I thrive both in team environments and individual projects, relying on strong analytical skills, 
                  effective communication, and quick adaptation to new challenges. My vision is to focus on 
                  digitalizing information systems while expanding my professional network and continuously 
                  enhancing my technical skills.
                </p>
              </FadeIn>
            </div>

            {/* Skills Section */}
            <FadeIn delay={0.4}>
              <div className="mt-8 pt-8 border-t border-slate-700/50">
                <h4 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Zap className="text-yellow-400" size={24} />
                  Technical Expertise
                </h4>
                <div className="grid md:grid-cols-3 gap-6">
                  {skills.map((skill, index) => {
                    const IconComponent = skill.icon;
                    return (
                      <div key={index} className="skill-card p-6 bg-slate-800/30 rounded-2xl border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 group">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg group-hover:scale-110 transition-transform">
                            <IconComponent className="text-white" size={20} />
                          </div>
                          <h5 className="font-semibold text-white">{skill.label}</h5>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {skill.items.map((item, itemIndex) => (
                            <Badge key={itemIndex} variant="secondary" className="text-xs">
                              {item}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </FadeIn>
          </div>
        );
      
      case 'education':
        return (
          <div className="space-y-6">
            <FadeIn delay={0.1}>
              <Card variant="glass" className="p-8 education-card">
                <div className="flex items-start gap-6">
                  <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                    <GraduationCap className="text-white" size={32} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-2xl font-bold text-white mb-2">Teknik Informatika</h4>
                    <p className="text-blue-400 font-medium mb-3 text-lg">
                      Universitas Islam Kalimantan Muhammad Arsyad Al Banjari
                    </p>
                    <div className="flex items-center gap-3 text-slate-400 mb-6">
                      <Calendar size={18} />
                      <span className="text-lg">2020 - 2024</span>
                      <Badge variant="success" className="ml-2">
                        Graduate
                      </Badge>
                    </div>
                    <p className="text-slate-300 leading-relaxed text-lg">
                      Focused on software engineering, database systems, and web development. 
                      Developed strong foundation in programming languages, system analysis, 
                      and project management methodologies.
                    </p>
                  </div>
                </div>
              </Card>
            </FadeIn>
            
            <div className="grid md:grid-cols-2 gap-6">
              <FadeIn delay={0.2}>
                <Card variant="glass" className="p-6 curriculum-card">
                  <h5 className="font-bold text-white mb-4 text-lg flex items-center gap-2">
                    <CheckCircle className="text-green-400" size={20} />
                    Key Subjects
                  </h5>
                  <ul className="space-y-3 text-slate-300">
                    {[
                      'Software Engineering',
                      'Database Systems', 
                      'Web Development',
                      'System Analysis & Design',
                      'Data Structures & Algorithms',
                      'Computer Networks'
                    ].map((subject, index) => (
                      <li key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800/30 transition-colors">
                        <CheckCircle size={16} className="text-green-400 flex-shrink-0" />
                        <span>{subject}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </FadeIn>
              
              <FadeIn delay={0.3}>
                <Card variant="glass" className="p-6 skills-card">
                  <h5 className="font-bold text-white mb-4 text-lg flex items-center gap-2">
                    <Lightbulb className="text-yellow-400" size={20} />
                    Skills Developed
                  </h5>
                  <ul className="space-y-3 text-slate-300">
                    {[
                      'Problem-solving mindset',
                      'Analytical thinking',
                      'Project management',
                      'Team collaboration',
                      'Critical thinking',
                      'Technical documentation'
                    ].map((skill, index) => (
                      <li key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800/30 transition-colors">
                        <CheckCircle size={16} className="text-blue-400 flex-shrink-0" />
                        <span>{skill}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </FadeIn>
            </div>
          </div>
        );
      
      case 'values':
        return (
          <div className="grid md:grid-cols-2 gap-8">
            {coreValues.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <FadeIn key={index} delay={index * 0.1}>
                  <Card variant="glass" className="p-8 value-card hover:scale-105 transition-all duration-300 group">
                    <div className="flex items-start gap-6">
                      <div className={`p-4 bg-gradient-to-r ${value.color} rounded-2xl shadow-lg group-hover:scale-110 transition-transform`}>
                        <IconComponent className="text-white" size={28} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-white mb-3">{value.title}</h4>
                        <p className="text-slate-300 leading-relaxed">{value.description}</p>
                      </div>
                    </div>
                  </Card>
                </FadeIn>
              );
            })}
          </div>
        );
      
      case 'goals':
        return (
          <div className="space-y-8">
            <FadeIn delay={0.1}>
              <Card variant="highlight" className="p-8 vision-card">
                <h4 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Target className="text-blue-400" size={28} />
                  Professional Vision
                </h4>
                <p className="text-slate-300 leading-relaxed text-lg mb-6">
                  My vision is to focus on digitalizing information systems while expanding my 
                  professional network and continuously enhancing my technical skills. I aim to 
                  bridge the gap between traditional business processes and modern digital solutions.
                </p>
                <div className="flex items-center gap-4 text-sm text-slate-400">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    <span>Innovation Focus</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                    <span>Continuous Growth</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>Quality Delivery</span>
                  </div>
                </div>
              </Card>
            </FadeIn>
            
            <div className="grid md:grid-cols-2 gap-8">
              <FadeIn delay={0.2}>
                <Card variant="glass" className="p-8 goals-card">
                  <h5 className="font-bold text-white mb-6 text-xl flex items-center gap-2">
                    <ArrowRight className="text-blue-400" size={20} />
                    Short-term Goals
                  </h5>
                  <ul className="space-y-4 text-slate-300">
                    {[
                      'Master Next.js and advanced React patterns',
                      'Expand expertise in PostgreSQL and database optimization',
                      'Build more complex full-stack applications',
                      'Contribute to open-source projects',
                      'Obtain cloud certifications (AWS/Azure)'
                    ].map((goal, index) => (
                      <li key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-800/30 transition-colors group">
                        <ArrowRight size={16} className="text-blue-400 mt-1 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                        <span>{goal}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </FadeIn>
              
              <FadeIn delay={0.3}>
                <Card variant="glass" className="p-8 goals-card">
                  <h5 className="font-bold text-white mb-6 text-xl flex items-center gap-2">
                    <Target className="text-purple-400" size={20} />
                    Long-term Goals
                  </h5>
                  <ul className="space-y-4 text-slate-300">
                    {[
                      'Lead digital transformation projects',
                      'Mentor junior developers and students',
                      'Establish a tech consultancy firm',
                      'Speak at tech conferences and events',
                      'Create educational content and courses'
                    ].map((goal, index) => (
                      <li key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-800/30 transition-colors group">
                        <Target size={16} className="text-purple-400 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                        <span>{goal}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </FadeIn>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  if (!mounted) return null;

  return (
    <section id="about" className="py-24 bg-slate-800/50 relative overflow-hidden about-section">
      {/* Enhanced Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-500/3 via-purple-500/3 to-pink-500/3 rounded-full blur-3xl animate-spin-ultra-slow" />
        
        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${4 + Math.random() * 4}s`
              }}
            >
              <div 
                className={`w-1 h-1 rounded-full ${
                  i % 3 === 0 ? 'bg-blue-400/20' :
                  i % 3 === 1 ? 'bg-purple-400/20' : 'bg-pink-400/20'
                } blur-sm animate-pulse-custom`}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <FadeIn direction="up" delay={0.2}>
          <div className="text-center mb-20">
            <SlideIn direction="down" delay={0.1}>
              <Badge variant="outline" className="mb-6 section-badge">
                <User size={16} />
                Get to know me
              </Badge>
            </SlideIn>
            <SlideIn direction="up" delay={0.2}>
              <h2 className="text-4xl lg:text-6xl font-black text-white mb-8">
                About{' '}
                <span className="text-gradient bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text relative">
                  Me
                  <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-purple-500 transform scale-x-0 origin-left animate-underline" style={{ animationDelay: '0.5s' }} />
                </span>
              </h2>
            </SlideIn>
            <SlideIn direction="up" delay={0.3}>
              <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
                Passionate about leveraging technology to solve real-world problems and drive digital transformation
              </p>
            </SlideIn>
          </div>
        </FadeIn>

        {/* Achievement Stats */}
        <SlideIn direction="up" delay={0.4}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-20">
            {achievements.map((achievement, index) => {
              const IconComponent = achievement.icon;
              return (
                <Card key={index} variant="glass" className="p-8 text-center achievement-card hover:scale-105 transition-all duration-300 group">
                  <div className={`w-16 h-16 bg-gradient-to-r ${achievement.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                    <IconComponent className="text-white" size={24} />
                  </div>
                  <div className="text-4xl font-black text-white mb-3 counter-display">
                    <AnimatedCounter 
                      end={achievement.number} 
                      suffix={achievement.suffix}
                      duration={2000}
                    />
                  </div>
                  <div className="text-sm font-bold text-slate-300 mb-2 uppercase tracking-wide">
                    {achievement.label}
                  </div>
                  <div className="text-xs text-slate-500 leading-relaxed">
                    {achievement.description}
                  </div>
                </Card>
              );
            })}
          </div>
        </SlideIn>

        <div className="grid lg:grid-cols-3 gap-16">
          {/* Personal Info Card */}
          <SlideIn direction="right" delay={0.5}>
            <Card variant="highlight" className="p-10 h-fit profile-card">
              <div className="text-center mb-10">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl avatar-container">
                  <img src="/assets/img/utsman1.jpg" className="w-full h-full object-cover rounded-full" alt="" />
                </div>
                <h3 className="text-3xl font-black text-white mb-3">Utsman</h3>
                <Badge variant="primary" className="mb-6 role-badge">
                  <Code size={14} />
                  Fullstack Web Developer
                </Badge>
              </div>

              <div className="space-y-5">
                {personalInfo.map((info, index) => {
                  const IconComponent = info.icon;
                  return (
                    <div key={index} className="flex items-center gap-4 p-4 bg-slate-800/40 rounded-xl border border-slate-700/30 hover:border-slate-600/50 transition-all duration-300 info-item group">
                      <div className={`p-2 bg-slate-700/50 rounded-lg group-hover:scale-110 transition-transform`}>
                        <IconComponent size={18} className={`${info.color} flex-shrink-0`} />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">{info.label}</div>
                        <div className="text-sm text-slate-200 font-semibold mt-1">{info.value}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-10 pt-8 border-t border-slate-700/50">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full connect-button group"
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Mail size={18} className="group-hover:animate-pulse" />
                  Let's Connect
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </Card>
          </SlideIn>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <SlideIn direction="left" delay={0.6}>
              {/* Tab Navigation */}
              <div className="flex flex-wrap gap-3 mb-10">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-300 font-medium ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25 scale-105'
                          : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50 hover:scale-105'
                      } tab-button`}
                    >
                      <IconComponent size={18} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Tab Content */}
              <Card variant="glass" className="p-10 min-h-[500px] content-card">
                <div className="tab-content transition-all duration-500">
                  {renderTabContent()}
                </div>
              </Card>
            </SlideIn>
          </div>
        </div>

        {/* Call to Action */}
        <FadeIn direction="up" delay={0.8}>
          <div className="text-center mt-20 cta-section">
            <h3 className="text-3xl font-black text-white mb-6">
              Ready to work together?
            </h3>
            <p className="text-xl text-slate-400 mb-10 max-w-3xl mx-auto leading-relaxed">
              I'm always excited to collaborate on new projects and bring innovative ideas to life.
              Let's discuss how we can work together to achieve your goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                variant="primary"
                size="xl"
                onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                className="group cta-button"
              >
                <Code size={20} className="group-hover:animate-spin" />
                View My Projects
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="outline"
                size="xl"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="group"
              >
                <Mail size={20} className="group-hover:animate-pulse" />
                Start a Conversation
              </Button>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default About;