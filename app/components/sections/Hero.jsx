'use client';
import { useState, useEffect, useCallback } from 'react';
import { 
  ArrowDown, 
  Download, 
  Github, 
  Linkedin, 
  Mail, 
  MapPin, 
  Sparkles, 
  Code, 
  Database, 
  Globe,
  Star,
  Zap,
  Heart,
  Coffee
} from 'lucide-react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import FadeIn from '../animations/FadeIn';
import SlideIn from '../animations/SlideIn';

const AnimatedCounter = ({ end, suffix = '', duration = 2000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
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
  }, [end, duration]);

  return <span>{count}{suffix}</span>;
};

const SkillOrb = ({ skill, index, total }) => {
  const angle = (index * 360 / total) * (Math.PI / 180);
  const radius = 180;
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;
  
  return (
    <div
      className="absolute skill-orb"
      style={{
        left: '50%',
        top: '50%',
        transform: `translate(calc(${x}px - 50%), calc(${y}px - 50%))`,
        animationDelay: `${index * 0.2}s`
      }}
    >
      <div className={`
        group relative p-3 bg-slate-800/90 backdrop-blur-sm rounded-full 
        border border-slate-600/50 shadow-lg hover:shadow-xl 
        hover:scale-110 transition-all duration-500 cursor-pointer
        hover:border-${skill.color}/50 hover:bg-slate-700/90
      `}>
        <skill.icon 
          size={20} 
          className={`text-${skill.color} group-hover:animate-pulse transition-all duration-300`} 
        />
        
        {/* Tooltip */}
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
          <div className="bg-slate-900/95 backdrop-blur-sm px-3 py-1 rounded-lg border border-slate-700 whitespace-nowrap">
            <span className="text-sm text-white font-medium">{skill.name}</span>
            <div className="text-xs text-slate-400">{skill.level}</div>
          </div>
          {/* Arrow */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full">
            <div className="w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-slate-700"></div>
          </div>
        </div>

        {/* Glow effect */}
        <div className={`absolute inset-0 rounded-full bg-${skill.color}/20 opacity-0 group-hover:opacity-100 blur-md transition-all duration-500 -z-10`}></div>
      </div>
    </div>
  );
};

const Hero = () => {
  const [mounted, setMounted] = useState(false);
  const [currentRole, setCurrentRole] = useState(0);
  const [isRoleChanging, setIsRoleChanging] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isTyping, setIsTyping] = useState(false);

  const roles = [
    { 
      text: 'Fullstack Developer', 
      color: 'from-blue-400 to-cyan-400',
      icon: Code,
      description: 'Building end-to-end solutions'
    },
    { 
      text: 'Laravel Specialist', 
      color: 'from-red-400 to-orange-400',
      icon: () => <i className="fab fa-laravel text-xl"></i>,
      description: 'Crafting robust backend systems'
    },
    { 
      text: 'React Developer', 
      color: 'from-cyan-400 to-blue-400',
      icon: () => <i className="fab fa-react text-xl"></i>, 
      description: 'Creating interactive experiences'
    },
    { 
      text: 'Digital Solutions Creator', 
      color: 'from-purple-400 to-pink-400',
      icon: Star,
      description: 'Transforming ideas into reality'
    }
  ];

  const stats = [
    { label: 'Projects Completed', value: 15, icon: Code, suffix: '+', color: 'text-blue-400' },
    { label: 'Technologies', value: 10, icon: Database, suffix: '+', color: 'text-purple-400' },
    { label: 'Years Experience', value: 2, icon: Globe, suffix: '+', color: 'text-green-400' },
    { label: 'Happy Clients', value: 8, icon: Heart, suffix: '+', color: 'text-pink-400' }
  ];

  const skills = [
    { 
      name: 'React', 
      icon: () => <i className="fab fa-react text-xl"></i>, 
      color: 'blue-400', 
      level: 'Intermediate' 
    },
    { 
      name: 'Laravel', 
      color: 'orange-400', 
      icon: () => <i className="fab fa-laravel text-xl"></i>, 
      level: 'Expert' 
    },
    { 
      name: 'MySQL', 
      icon: () => <i className="fas fa-database text-xl"></i>, 
      color: 'blue-500', 
      level: 'Expert' 
    },
    { 
      name: 'PHP', 
      icon: () => <i className="fab fa-php text-xl"></i>, 
      color: 'purple-400', 
      level: 'Expert' 
    },
    { 
      name: 'JavaScript', 
      icon: () => <i className="fab fa-js-square text-xl"></i>, 
      color: 'yellow-400', 
      level: 'Advanced' 
    },
    { 
      name: 'TailwindCSS', 
      icon: () => <i className="fas fa-paint-brush text-xl"></i>, 
      color: 'teal-400', 
      level: 'Intermediate' 
    }
  ];

  const handleMouseMove = useCallback((e) => {
    setMousePosition({
      x: (e.clientX - window.innerWidth / 2) / 25,
      y: (e.clientY - window.innerHeight / 2) / 25
    });
  }, []);

  useEffect(() => {
    setMounted(true);
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsRoleChanging(true);
      setIsTyping(true);
      
      setTimeout(() => {
        setCurrentRole((prev) => (prev + 1) % roles.length);
        setIsRoleChanging(false);
        
        setTimeout(() => {
          setIsTyping(false);
        }, 200);
      }, 300);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  if (!mounted) return null;

  const currentRoleData = roles[currentRole];
  const RoleIcon = currentRoleData.icon;

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Enhanced Background with Gradient Mesh */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Animated gradient mesh */}
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            background: `
              radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 40% 80%, rgba(236, 72, 153, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 90% 70%, rgba(34, 197, 94, 0.15) 0%, transparent 50%)
            `,
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`
          }}
        />
        
        {/* Floating particles with enhanced animation */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            >
              <div 
                className={`w-1 h-1 rounded-full ${
                  i % 4 === 0 ? 'bg-blue-400/30' :
                  i % 4 === 1 ? 'bg-purple-400/30' :
                  i % 4 === 2 ? 'bg-pink-400/30' : 'bg-green-400/30'
                } blur-sm animate-pulse`}
              />
            </div>
          ))}
        </div>

        {/* Grid overlay */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px'
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-screen py-20">
          {/* Enhanced Content Section */}
          <div className="text-center lg:text-left space-y-8">
            {/* Availability Badge with pulse animation */}
            <SlideIn direction="down" delay={0.2}>
              <div className="inline-flex items-center mt-5">
                <Badge variant="success" className="relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20 animate-pulse" />
                  <div className="relative flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-ping" />
                    <span className="font-medium">Available for Work</span>
                  </div>
                </Badge>
              </div>
            </SlideIn>

            {/* Enhanced Main Heading */}
            <SlideIn direction="up" delay={0.3}>
              <div className="space-y-4">
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-tight">
                  <span className="block">Hi, I'm</span>
                  <span className="relative inline-block">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 relative z-10">
                      Utsman
                    </span>
                    {/* Animated underline */}
                    <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-purple-500 transform scale-x-0 origin-left animate-pulse" />
                    {/* Sparkle effect */}
                    <div className="absolute -top-4 -right-4 animate-bounce">
                      <Sparkles className="text-yellow-400" size={32} />
                    </div>
                  </span>
                </h1>
              </div>
            </SlideIn>

            {/* Enhanced Animated Role with smooth transitions */}
            <SlideIn direction="up" delay={0.4}>
              <div className="space-y-6">
                <div className="relative">
                  <h2 className="text-2xl md:text-4xl lg:text-5xl text-slate-300 font-light">
                    A passionate
                  </h2>
                  
                  {/* Role container with enhanced animations */}
                  <div className="relative mt-4 h-20 md:h-24 overflow-hidden ml-7 lg:ml-0">
                    <div 
                      className={`transition-all duration-500 transform ${
                        isRoleChanging ? 'translate-y-full opacity-0 scale-95' : 'translate-y-0 opacity-100 scale-100'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl bg-gradient-to-r ${currentRoleData.color} shadow-lg`}>
                          <RoleIcon className="text-white" size={28} />
                        </div>
                        <div>
                          <h3 className={`text-2xl md:text-4xl font-bold bg-gradient-to-r ${currentRoleData.color} bg-clip-text text-transparent ${
                            isTyping ? 'animate-pulse' : ''
                          }`}>
                            {currentRoleData.text}
                          </h3>
                          <p className="text-sm md:text-base text-slate-400 mt-1">
                            {currentRoleData.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SlideIn>

            {/* Enhanced Description */}
            <FadeIn delay={0.5}>
              <div className="max-w-2xl mx-auto lg:mx-0">
                <p className="text-xl md:text-2xl text-slate-400 leading-relaxed">
                  Transforming real-world challenges into{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 font-semibold">
                    innovative digital solutions
                  </span>
                  . Specialized in building scalable applications that enhance productivity and user experiences.
                </p>
              </div>
            </FadeIn>

            {/* Location with icon animation */}
            <SlideIn direction="up" delay={0.6}>
              <div className="flex items-center gap-3 text-slate-400 justify-center lg:justify-start group">
                <div className="p-2 bg-slate-800/50 rounded-lg group-hover:bg-blue-500/20 transition-all duration-300">
                  <MapPin size={20} className="text-blue-400 group-hover:animate-bounce" />
                </div>
                <span className="text-lg">Banjarbaru, Kalimantan Selatan, Indonesia</span>
              </div>
            </SlideIn>

            {/* Enhanced CTA Buttons */}
            <SlideIn direction="up" delay={0.7}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  variant="primary"
                  size="xl"
                  onClick={() => scrollToSection('projects')}
                  className="group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative flex items-center gap-2">
                    <Code size={20} className="group-hover:animate-spin" />
                    <span>View My Work</span>
                    <ArrowDown className="group-hover:translate-y-1 transition-transform" size={16} />
                  </div>
                </Button>
                
                <Button
                  variant="outline"
                  size="xl"
                  onClick={() => scrollToSection('contact')}
                  className="group"
                >
                  <Mail size={20} className="group-hover:animate-pulse" />
                  <span>Get In Touch</span>
                </Button>
                
              </div>
            </SlideIn>

            {/* Enhanced Stats */}
            <SlideIn direction="up" delay={0.9}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto lg:mx-0">
                {stats.map((stat, index) => {
                  const IconComponent = stat.icon;
                  return (
                    <div 
                      key={index} 
                      className="text-center lg:text-left group cursor-pointer"
                    >
                      <div className="flex items-center gap-3 mb-2 justify-center lg:justify-start">
                        <div className="p-2 bg-slate-800/50 rounded-lg group-hover:scale-110 transition-transform">
                          <IconComponent size={18} className={`${stat.color} group-hover:animate-pulse`} />
                        </div>
                        <span className={`text-3xl font-bold text-white group-hover:scale-105 transition-transform`}>
                          <AnimatedCounter 
                            end={stat.value} 
                            suffix={stat.suffix}
                            duration={2000}
                          />
                        </span>
                      </div>
                      <div className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                        {stat.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </SlideIn>
          </div>

          {/* Enhanced Hero Visual */}
          <div className="flex justify-center lg:justify-end">
            <SlideIn direction="left" delay={0.5}>
              <div className="relative">
                {/* Main profile container with enhanced design */}
                <div className="relative w-96 h-96 lg:w-[450px] lg:h-[450px]">
                  {/* Animated rings with gradient borders */}
                  <div className="absolute inset-0 rounded-full border-2 border-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-0.5 animate-spin">
                    <div className="w-full h-full rounded-full bg-slate-900" />
                  </div>
                  <div className="absolute inset-6 rounded-full border-2 border-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 p-0.5" style={{animation: 'spin 6s linear infinite reverse'}}>
                    <div className="w-full h-full rounded-full bg-slate-900" />
                  </div>
                  <div className="absolute inset-12 rounded-full border-2 border-transparent bg-gradient-to-r from-pink-500 via-blue-500 to-purple-500 p-0.5 animate-spin">
                    <div className="w-full h-full rounded-full bg-slate-900" />
                  </div>
                  
                  {/* Profile image with enhanced styling */}
                  <div className="absolute inset-20 bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 rounded-full flex items-center justify-center shadow-2xl border border-slate-600/30 backdrop-blur-sm overflow-hidden">
                    {/* Professional placeholder image */}
                    <img 
                      src="/assets/img/utsman.jpg"
                      alt="Profile"
                      className="w-full h-full object-cover object-center rounded-full"
                      onError={(e) => {
                        // Fallback to avatar if image fails to load
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                    
                    {/* Fallback avatar */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-full items-center justify-center text-4xl font-black text-white" style={{display: 'none'}}>
                      U
                    </div>
                    
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-transparent rounded-full" />
                  </div>
                  
                  {/* Enhanced skill orbs */}
                  {skills.map((skill, index) => (
                    <SkillOrb key={index} skill={skill} index={index} total={skills.length} />
                  ))}
                </div>

                {/* Enhanced background glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-3xl -z-10 animate-pulse" />
              </div>
            </SlideIn>
          </div>
        </div>

        {/* Enhanced Scroll Indicator */}
        <FadeIn delay={1.0}>
          <div 
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer group"
            onClick={() => scrollToSection('about')}
          >
            <div className="flex flex-col items-center gap-3 text-slate-400 group-hover:text-white transition-all duration-300">
              <span className="text-sm font-medium tracking-wide">Scroll to explore</span>
              <div className="relative">
                <div className="w-8 h-12 border-2 border-slate-400 group-hover:border-white rounded-full flex justify-center transition-all duration-300 bg-slate-800/30 backdrop-blur-sm">
                  <div className="w-1.5 h-4 bg-gradient-to-b from-blue-400 to-purple-500 rounded-full mt-2 animate-bounce" />
                </div>
                {/* Ripple effect on hover */}
                <div className="absolute inset-0 rounded-full border-2 border-blue-400/50 scale-150 opacity-0 group-hover:opacity-100 group-hover:scale-200 transition-all duration-700" />
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default Hero;