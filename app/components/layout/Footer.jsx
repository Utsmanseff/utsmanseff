'use client';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Github, 
  Linkedin, 
  Instagram,
  MessageCircle,
  ArrowUp,
  Heart,
  Code,
  Coffee,
  Zap,
  Globe,
  ExternalLink
} from 'lucide-react';
import { useState, useEffect } from 'react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

const Footer = () => {
  const [currentYear, setCurrentYear] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const quickLinks = [
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Experience', href: '#experience' },
    { name: 'Contact', href: '#contact' }
  ];

  const services = [
    { name: 'Web Development', href: '#contact' },
    { name: 'System Integration', href: '#contact' },
    { name: 'Database Design', href: '#contact' },
    { name: 'Technical Consultation', href: '#contact' },
    { name: 'System Maintenance', href: '#contact' }
  ];

  const techStack = [
    'Laravel', 'React', 'Next.js', 'MySQL', 'Tailwind CSS', 'JavaScript', 'PHP', 'Laravel Filament'
  ];

  const socialLinks = [
    {
      name: 'GitHub',
      icon: Github,
      href: 'https://github.com/Utsmanseff',
      color: 'hover:text-gray-300'
    },
    {
      name: 'Instagram',
      icon: Instagram,
      href: 'https://instagram.com/utsmnseff',
      color: 'hover:text-blue-400'
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      href: 'https://wa.me/6282352734167',
      color: 'hover:text-green-400'
    }
  ];

  const scrollToTop = () => {
    setIsScrolling(true);
    
    const scrollToTopSmooth = () => {
      const currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
      
      if (currentScroll > 0) {
        const step = Math.max(currentScroll / 25, 20);
        window.scrollTo(0, currentScroll - step);
        requestAnimationFrame(scrollToTopSmooth);
      } else {
        setIsScrolling(false);
      }
    };

    if ('scrollBehavior' in document.documentElement.style) {
      window.scrollTo({ 
        top: 0, 
        behavior: 'smooth' 
      });
      
      setTimeout(() => {
        setIsScrolling(false);
      }, 1000);
    } else {
      scrollToTopSmooth();
    }
  };

  const handleNavClick = (href) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        const targetPosition = element.offsetTop - 80; 
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 800;
        let start = null;

        const step = (timestamp) => {
          if (!start) start = timestamp;
          const progress = timestamp - start;
          const percentage = Math.min(progress / duration, 1);
          
          const easeInOutCubic = percentage < 0.5 
            ? 4 * percentage * percentage * percentage 
            : (percentage - 1) * (2 * percentage - 2) * (2 * percentage - 2) + 1;
          
          window.scrollTo(0, startPosition + distance * easeInOutCubic);
          
          if (progress < duration) {
            requestAnimationFrame(step);
          }
        };

        requestAnimationFrame(step);
      }
    }
  };

  return (
    <footer className="bg-slate-900 border-t border-slate-800 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-72 h-72 md:w-96 md:h-96 bg-blue-500/3 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 md:w-96 md:h-96 bg-purple-500/3 rounded-full blur-3xl animate-float-reverse" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Main Footer Content */}
        <div className="py-12 md:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {/* Brand Section */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">U</span>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">Utsman</div>
                  <div className="text-sm text-slate-400">Fullstack Developer</div>
                </div>
              </div>
              
              <p className="text-slate-400 mb-6 leading-relaxed text-sm md:text-base">
                Transforming real-world needs into innovative digital solutions. 
                Passionate about creating efficient, scalable, and user-friendly applications.
              </p>

              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                <a 
                  href="mailto:seffutsmannnn@gmail.com"
                  className="flex items-center gap-3 text-slate-400 hover:text-blue-400 transition-all duration-300 group"
                >
                  <Mail size={16} className="group-hover:scale-110 transition-transform flex-shrink-0" />
                  <span className="text-sm break-all">seffutsmannnn@gmail.com</span>
                </a>
                <a 
                  href="tel:+6282352734167"
                  className="flex items-center gap-3 text-slate-400 hover:text-green-400 transition-all duration-300 group"
                >
                  <Phone size={16} className="group-hover:scale-110 transition-transform flex-shrink-0" />
                  <span className="text-sm">+62-823-5273-4167</span>
                </a>
                <div className="flex items-center gap-3 text-slate-400">
                  <MapPin size={16} className="flex-shrink-0" />
                  <span className="text-sm">Banjarbaru, Kalimantan Selatan</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex gap-3">
                {socialLinks.map((social) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-3 bg-slate-800/50 backdrop-blur-sm rounded-lg transition-all duration-300 hover:scale-110 ${social.color} hover:bg-slate-700/50 group border border-slate-700/50 hover:border-slate-600/50`}
                      title={social.name}
                    >
                      <IconComponent size={18} />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Quick Links */}
            <div className="order-1 sm:order-none">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <Globe size={18} className="text-blue-400" />
                Quick Links
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={link.name} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                    <button
                      onClick={() => handleNavClick(link.href)}
                      className="text-slate-400 hover:text-white transition-all duration-300 text-sm hover:translate-x-2 transform flex items-center gap-2 group w-full text-left"
                    >
                      <div className="w-1 h-1 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-125" />
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div className="order-2 sm:order-none">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <Code size={18} className="text-purple-400" />
                Services
              </h3>
              <ul className="space-y-3">
                {services.map((service, index) => (
                  <li key={service.name} className="animate-fade-in-up" style={{ animationDelay: `${index * 120}ms` }}>
                    <button
                      onClick={() => handleNavClick(service.href)}
                      className="text-slate-400 hover:text-white transition-all duration-300 text-sm hover:translate-x-2 transform flex items-center gap-2 group w-full text-left"
                    >
                      <div className="w-1 h-1 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-125" />
                      {service.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tech Stack & Newsletter */}
            <div className="order-3 sm:col-span-2 lg:col-span-1 lg:order-none">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <Zap size={18} className="text-yellow-400" />
                Tech Stack
              </h3>
              <div className="flex flex-wrap gap-2 mb-6">
                {techStack.slice(0, 6).map((tech, index) => (
                  <Badge 
                    key={tech} 
                    variant="tech" 
                    className="text-xs animate-fade-in-scale" 
                    style={{ animationDelay: `${index * 80}ms` }}
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
              
              {/* CTA */}
              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-4 mb-6 backdrop-blur-sm hover:from-blue-500/15 hover:to-purple-500/15 transition-all duration-300">
                <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                  <Coffee size={16} className="text-orange-400" />
                  Let's Work Together
                </h4>
                <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                  Have a project in mind? Let's discuss how we can bring your ideas to life.
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleNavClick('#contact')}
                  className="w-full transition-all duration-300 hover:scale-105"
                >
                  Start a Project
                </Button>
              </div>

              {/* Status */}
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-slate-400">Available for work</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 py-6 md:py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-sm text-slate-400 text-center sm:text-left">
              <span>© {currentYear || '2024'} Utsman. All rights reserved.</span>
              <div className="flex items-center gap-1">
                <span>Made with</span>
                <Heart size={12} className="text-red-400 animate-heartbeat" />
                <span>in Indonesia</span>
              </div>
            </div>

            <div className="flex items-center gap-4 md:gap-6">
              {/* Scroll to Top */}
              {showScrollTop && (
                <button
                  onClick={scrollToTop}
                  className={`p-3 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 hover:border-slate-600/50 rounded-lg transition-all duration-300 hover:scale-110 group backdrop-blur-sm animate-fade-in shadow-lg hover:shadow-xl ${isScrolling ? 'animate-pulse scale-105' : ''}`}
                  title="Back to top"
                  style={{
                    transform: isScrolling ? 'scale(1.05)' : 'scale(1)',
                    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
                  }}
                >
                  <ArrowUp 
                    size={18} 
                    className={`text-slate-400 group-hover:text-white transition-all duration-300 ${isScrolling ? 'animate-bounce' : ''}`} 
                  />
                </button>
              )}

              <div className="flex flex-col sm:flex-row items-center gap-2 text-sm text-slate-400">
                <span className="hidden sm:inline">Quick contact:</span>
                <a
                  href="https://wa.me/6282352734167"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-green-400 hover:text-green-300 transition-all duration-300 hover:scale-105 px-2 py-1 rounded-md hover:bg-green-400/10"
                >
                  <MessageCircle size={14} />
                  <span>WhatsApp</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800/50 py-4 md:py-6">
          <div className="text-center">
            <p className="text-xs text-slate-500 mb-2">
              This portfolio is built with Next.js, Tailwind CSS, and lots of ☕
            </p>
            <div className="flex flex-wrap justify-center items-center gap-2 md:gap-4 text-xs text-slate-600">
              <span className="flex items-center gap-1">🚀 Fast Performance</span>
              <span className="flex items-center gap-1">📱 Mobile Responsive</span>
              <span className="flex items-center gap-1">♿ Accessible Design</span>
              <span className="flex items-center gap-1">🔍 SEO Optimized</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;