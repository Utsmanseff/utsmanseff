'use client';
import { useState, useEffect } from 'react';
import { 
  Phone, 
  MapPin, 
  Send, 
  Github, 
  Linkedin,
  Instagram,
  MessageCircle,
  CheckCircle,
  User,
  MessageSquare,
  Zap,
  ExternalLink
} from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    projectType: 'web-development'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
    script.async = true;
    script.onload = () => {
      window.emailjs.init('service_gv3e0jp');
      setEmailJSLoaded(true);
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const contactInfo = [
    {
      icon: MessageCircle,
      label: 'WhatsApp',
      value: '+62-823-5273-4167',
      href: 'https://wa.me/6282352734167',
      color: 'from-green-500 to-teal-500'
    },
    {
      icon: MapPin,
      label: 'Location',
      value: 'Banjarbaru, Kalimantan Selatan',
      href: 'https://maps.google.com/?q=Banjarbaru,Kalimantan+Selatan',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  const socialLinks = [
    {
      name: 'GitHub',
      icon: Github,
      href: 'https://github.com/Utsmanseff',
      color: 'hover:text-gray-400'
    },
    {
      name: 'Instagram',
      icon: Instagram,
      href: 'https://instagram.com/utsmnseff',
      color: 'hover:text-blue-400'
    }
  ];

  const projectTypes = [
    { value: 'web-development', label: 'Web Development' },
    { value: 'system-integration', label: 'System Integration' },
    { value: 'consultation', label: 'Technical Consultation' },
    { value: 'maintenance', label: 'System Maintenance' },
    { value: 'other', label: 'Other' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // EmailJS configuration
      const emailjsConfig = {
        serviceID: 'service_gv3e0jp', 
        templateID: 'template_nqpal8q', 
        publicKey: 'paavDHpwSqxI3Lmzw' 
      };

      await emailjs.send(emailjsConfig.serviceID, emailjsConfig.templateID, {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        type: formData.projectType,
        message: formData.message,
         time: new Date().toLocaleString('id-ID'),
      }, emailjsConfig.publicKey);

      // Temporary simulation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        projectType: 'web-development'
      });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus(null), 5000);
    }
  };

  return (
    <section id="contact" className="py-20 bg-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-full border border-slate-700/50 mb-6">
            <MessageSquare size={16} className="text-blue-400" />
            <span className="text-sm text-slate-300">Let's Connect</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Get In <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Touch</span>
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Ready to transform your ideas into digital solutions? Let's discuss your project.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Contact Methods */}
            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Zap className="text-blue-400" size={20} />
                Contact Info
              </h3>
              
              <div className="space-y-4">
                {contactInfo.map((contact, index) => {
                  const IconComponent = contact.icon;
                  return (
                    <a
                      key={index}
                      href={contact.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block"
                    >
                      <div className="flex items-center gap-4 p-3 bg-slate-700/30 rounded-lg hover:bg-slate-600/30 transition-all duration-300">
                        <div className={`p-2 bg-gradient-to-r ${contact.color} rounded-lg`}>
                          <IconComponent className="text-white" size={16} />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm text-slate-400">{contact.label}</div>
                          <div className="text-white text-sm font-medium group-hover:text-blue-400">
                            {contact.value}
                          </div>
                        </div>
                        <ExternalLink size={14} className="text-slate-500 group-hover:text-blue-400" />
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-6">
              <h4 className="text-lg font-semibold text-white mb-4">
                Follow Me
              </h4>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-3 bg-slate-700/30 rounded-lg hover:bg-slate-600/30 transition-all duration-300 ${social.color}`}
                    >
                      <IconComponent size={20} className="text-slate-400" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-6">
              <h4 className="text-lg font-semibold text-white mb-4">
                Quick Contact
              </h4>
              <button
                onClick={() => window.open('https://wa.me/6282352734167', '_blank')}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2"
              >
                <MessageCircle size={18} />
                WhatsApp Me
              </button>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6">
                Start Your Project
              </h3>

              {/* Status Message */}
              {submitStatus && (
                <div className={`mb-6 p-4 rounded-lg border ${
                  submitStatus === 'success' 
                    ? 'bg-green-500/10 border-green-500/30 text-green-400'
                    : 'bg-red-500/10 border-red-500/30 text-red-400'
                }`}>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} />
                    <span className="text-sm">
                      {submitStatus === 'success' 
                        ? 'Message sent successfully! I\'ll get back to you soon.'
                        : 'Failed to send message. Please try WhatsApp instead.'
                      }
                    </span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name and Email */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                {/* Project Type and Subject */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Project Type
                    </label>
                    <select
                      name="projectType"
                      value={formData.projectType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                    >
                      {projectTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                      placeholder="Project summary"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Project Details *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 resize-none"
                    placeholder="Tell me about your project, goals, and requirements..."
                  />
                </div>

                {/* Submit Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="submit"
                    disabled={isSubmitting || !formData.name || !formData.email || !formData.message}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white py-3 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send size={18} />
                    )}
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => window.open('https://wa.me/6282352734167', '_blank')}
                    className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={18} />
                    WhatsApp
                  </button>
                </div>

                {/* Form Note */}
                <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30">
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle size={14} className="text-green-400" />
                    <span>I typically respond within 24 hours</span>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;