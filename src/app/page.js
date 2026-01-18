"use client";

import React, { useState, useEffect } from 'react';
import { Github, Mail, Phone, MapPin, Code, Database, Wrench, ChevronRight, ExternalLink, User, Image, Sun, Moon } from 'lucide-react';

export default function Portfolio() {
  const [activeProject, setActiveProject] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

 useEffect(() => {
    setMounted(true);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    setDarkMode(prefersDark);
    if (prefersDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  if (!mounted) {
    return null;
  }

  const projects = [
    {
      id: 1,
      title: "Rekam Medis Elektronik (RME)",
      company: "RSU Nirwana",
      year: "2025",
      image: "/assets/img/rme.png",
      description: "Sistem rekam medis elektronik berbasis web untuk mengelola data pasien, riwayat medis, dan integrasi dengan berbagai layanan rumah sakit.",
      tech: ["Laravel", "MySQL", "CSS"],
      features: [
        "Implementasi standar rekam medis",
        "Riwayat medis lengkap",
        "Integrasi dengan sistem antrian",
        "Dashboard monitoring real-time"
      ]
    },
    {
      id: 2,
      title: "E-Klaim BPJS dengan IDRG Full Bridging",
      company: "RSU Nirwana",
      year: "2025",
      image: "/assets/img/eklaim.png",
      description: "Implementasi sistem e-klaim BPJS Kesehatan dengan full bridging INA-CBGs/IDRG untuk otomasi proses klaim asuransi kesehatan.",
      tech: ["Laravel", "REST API", "MySQL", "INA-CBGs"],
      features: [
        "Full bridging dengan sistem BPJS",
        "Full control INA-CBGs/IDRG local maupun server BPJS",
        "Monitoring status klaim real-time"
      ]
    },
    {
      id: 3,
      title: "Sistem Pendaftaran Online Pasien",
      company: "RSU Nirwana",
      year: "2024",
      image: "/assets/img/pendaftaran-rs.jpg",
      description: "Platform pendaftaran pasien secara online untuk mempermudah akses layanan kesehatan dan mengurangi antrian di rumah sakit.",
      tech: ["Laravel", "MySQL", "React.js", "Tailwind CSS"],
      features: [
        "Pendaftaran pasien online",
        "Pemilihan jadwal dokter",
        "Notifikasi pendaftaran",
        "Pengelolaan data pasien"
      ]
    },
    {
      id: 4,
      title: "Sistem Kepegawaian & Absensi Geolocation",
      company: "BPN Banjarbaru",
      year: "2025",
      image: "/assets/img/sigap.jpg",
      description: "Sistem manajemen kepegawaian dan absensi berbasis lokasi untuk memastikan kehadiran pegawai sesuai dengan lokasi kerja.",
      tech: ["Laravel", "Geolocation API", "MySQL", "JavaScript", "Livewire"],
      features: [
        "Absensi berbasis geolocation",
        "Manajemen cuti dan izin",
        "Laporan kehadiran",
        "Dashboard monitoring pegawai"
      ]
    },
    {
      id: 5,
      title: "Sistem Manajemen Aset & Inventaris",
      company: "UPT-KPHL Kapuas Kahayan",
      year: "2025",
      image: "/assets/img/aset.jpg",
      description: "Sistem untuk mengelola aset dan inventaris organisasi dengan fitur tracking, maintenance, dan reporting.",
      tech: ["Laravel", "MySQL", "Blade Template", "CSS"],
      features: [
        "Pencatatan aset dan inventaris",
        "Tracking lokasi dan kondisi aset",
        "Maintenance schedule",
        "Laporan dan dokumentasi"
      ]
    },
    {
      id: 6,
      title: "Aplikasi Pendaftaran dan Monitoring Sertifikasi Benih",
      company: "BPSPTPH Banjarbaru",
      year: "2025",
      image: "/assets/img/sertifikasi.png",
      description: "Sistem pendaftaran dan monitoring sertifikasi benih tanaman untuk mendukung proses sertifikasi yang efisien dan transparan.",
      tech: ["Laravel", "MySQL", "CSS", "JavaScript", "Livewire"],
      features: [
        "Pendaftaran sertifikasi benih online",
        "Monitoring status sertifikasi",
        "Notifikasi progres sertifikasi",
        "Sertifikasi digital"
      ]
    }
  ];

  const skills = {
    "Backend": [
      { name: "PHP", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg" },
      { name: "Laravel", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg" },
      { name: "Livewire", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/livewire/livewire-original.svg" },
      { name: "REST API", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/json/json-original.svg" }
    ],
    "Frontend": [
      { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
      { name: "React.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
      { name: "Next.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
      { name: "Tailwind CSS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" },
      { name: "CSS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" }
    ],
    "Database & Tools": [
      { name: "MySQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
      { name: "Git", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
    ]
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-b border-gray-100 dark:border-gray-800 z-50 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-6 py-5">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white transition-colors">Utsman</h1>
            <div className="flex items-center gap-8">
              <a href="#about" className="text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors font-medium">Tentang</a>
              <a href="#skills" className="text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors font-medium">Keahlian</a>
              <a href="#projects" className="text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors font-medium">Project</a>
              <a href="#contact" className="text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors font-medium">Kontak</a>
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <Sun size={20} className="text-yellow-500" />
                ) : (
                  <Moon size={20} className="text-gray-700" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-linear-to-b from-teal-50/50 to-white dark:from-gray-800 dark:to-gray-900 transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-block mb-4">
                <span className="text-sm font-semibold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30 px-4 py-2 rounded-full transition-colors">
                  Available for Work
                </span>
              </div>
              <h1 className="text-6xl font-bold mb-3 text-gray-900 dark:text-white leading-tight transition-colors">
                Utsman
              </h1>
              <p className="text-2xl text-gray-600 dark:text-gray-400 mb-6 transition-colors">Web Developer</p>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-8 transition-colors">
                Lulusan Teknik Informatika dengan fokus pada pengembangan aplikasi web menggunakan Laravel. 
                Berpengalaman dalam membangun sistem kritikal untuk sektor kesehatan, termasuk Rekam Medis 
                Elektronik dan integrasi BPJS Kesehatan.
              </p>
              <div className="flex gap-4">
                <a 
                  href="#contact" 
                  className="bg-linear-to-r from-teal-600 to-cyan-600 dark:from-teal-500 dark:to-cyan-500 text-white px-7 py-3.5 rounded-lg hover:from-teal-700 hover:to-cyan-700 dark:hover:from-teal-600 dark:hover:to-cyan-600 transition-all shadow-lg shadow-teal-600/30 dark:shadow-teal-500/20 hover:shadow-xl hover:shadow-teal-600/40 inline-flex items-center gap-2 font-semibold"
                >
                  Hubungi Saya <ChevronRight size={20} />
                </a>
                <a 
                  href="#projects" 
                  className="border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-7 py-3.5 rounded-lg hover:border-teal-600 dark:hover:border-teal-500 hover:text-teal-600 dark:hover:text-teal-400 transition-all font-semibold"
                >
                  Lihat Project
                </a>
              </div>
            </div>
            
            {/* Photo */}
            <div className="flex justify-center md:justify-end">
              <img 
                src="/assets/img/utsman.png" 
                alt="Utsman"
                className="w-80 h-80 object-cover rounded-3xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-6 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-3 text-gray-900 dark:text-white transition-colors">Tentang Saya</h2>
            <div className="w-16 h-1.5 bg-linear-to-r from-teal-600 to-cyan-600 dark:from-teal-500 dark:to-cyan-500 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg shadow-gray-100 dark:shadow-gray-900/50 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-linear-to-br from-teal-600 to-cyan-600 rounded-xl flex items-center justify-center">
                  <Code size={24} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">Pengalaman Kerja</h3>
              </div>
              <div className="space-y-6">
                <div className="pl-5 border-l-4 border-teal-600 dark:border-teal-500">
                  <h4 className="font-bold text-lg text-gray-900 dark:text-white transition-colors">Staff IT</h4>
                  <p className="text-gray-700 dark:text-gray-300 font-medium mb-1 transition-colors">RSU Nirwana</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-3 transition-colors">2024 - Sekarang (Shift Malam)</p>
                  <ul className="text-gray-700 dark:text-gray-300 space-y-2 transition-colors">
                    <li className="flex items-start gap-2">
                      <span className="text-teal-600 dark:text-teal-400 mt-1 font-bold">→</span>
                      <span>Pengembangan aplikasi RME dan e-Klaim BPJS</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal-600 dark:text-teal-400 mt-1 font-bold">→</span>
                      <span>Implementasi full bridging IDRG/INA-CBGs</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal-600 dark:text-teal-400 mt-1 font-bold">→</span>
                      <span>Maintenance sistem dan infrastruktur IT</span>
                    </li>
                  </ul>
                </div>
                <div className="pl-5 border-l-4 border-gray-300 dark:border-gray-600">
                  <h4 className="font-bold text-lg text-gray-900 dark:text-white transition-colors">Staff Data & Administrasi</h4>
                  <p className="text-gray-700 dark:text-gray-300 font-medium mb-1 transition-colors">DPMPTSP Kota Banjarbaru</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-3 transition-colors">2023 (Magang)</p>
                  <ul className="text-gray-700 dark:text-gray-300 space-y-2 transition-colors">
                    <li className="flex items-start gap-2">
                      <span className="text-gray-400 dark:text-gray-500 mt-1 font-bold">→</span>
                      <span>Pengolahan data perizinan</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-400 dark:text-gray-500 mt-1 font-bold">→</span>
                      <span>Pengelolaan dokumen digital</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg shadow-gray-100 dark:shadow-gray-900/50 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-linear-to-br from-teal-600 to-cyan-600 rounded-xl flex items-center justify-center">
                  <Database size={24} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">Pendidikan & Sertifikasi</h3>
              </div>
              <div className="space-y-6">
                <div className="pl-5 border-l-4 border-teal-600 dark:border-teal-500">
                  <h4 className="font-bold text-lg text-gray-900 dark:text-white transition-colors">S1 Teknik Informatika</h4>
                  <p className="text-gray-700 dark:text-gray-300 font-medium transition-colors">Universitas Islam Kalimantan MAB</p>
                  <p className="text-gray-500 dark:text-gray-400 transition-colors">2020 - 2024</p>
                </div>
                <div className="pl-5 border-l-4 border-teal-600 dark:border-teal-500">
                  <h4 className="font-bold text-lg text-gray-900 dark:text-white transition-colors">Sertifikasi Profesi BNSP</h4>
                  <p className="text-gray-700 dark:text-gray-300 font-medium transition-colors">Object Programmer</p>
                  <p className="text-gray-500 dark:text-gray-400 transition-colors">Badan Nasional Sertifikasi Profesi</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-24 px-6 bg-linear-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-3 text-gray-900 dark:text-white transition-colors">Keahlian Teknis</h2>
            <div className="w-16 h-1.5 bg-linear-to-r from-teal-600 to-cyan-600 dark:from-teal-500 dark:to-cyan-500 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {Object.entries(skills).map(([category, items]) => (
              <div key={category} className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg shadow-gray-100 dark:shadow-gray-900/50 border border-gray-100 dark:border-gray-700 hover:shadow-2xl hover:border-teal-100 dark:hover:border-teal-800 transition-all group">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-14 h-14 bg-linear-to-br from-teal-600 to-cyan-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-teal-600/30">
                    {category === "Backend" && <Code size={28} className="text-white" />}
                    {category === "Frontend" && <Wrench size={28} className="text-white" />}
                    {category === "Database & Tools" && <Database size={28} className="text-white" />}
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 dark:text-white transition-colors">{category}</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {items.map((skill) => (
                    <div 
                      key={skill.name} 
                      className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 px-4 py-3 rounded-xl hover:border-teal-500 dark:hover:border-teal-400 hover:shadow-lg transition-all group/skill flex items-center gap-3"
                    >
                      <img 
                        src={skill.icon} 
                        alt={skill.name}
                        className="w-6 h-6 object-contain group-hover/skill:scale-110 transition-transform"
                      />
                      <span className="font-semibold text-gray-700 dark:text-gray-200">
                        {skill.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-24 px-6 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-3 text-gray-900 dark:text-white transition-colors">Project</h2>
            <div className="w-16 h-1.5 bg-linear-to-r from-teal-600 to-cyan-600 dark:from-teal-500 dark:to-cyan-500 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project) => (
              <div 
                key={project.id}
                className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg shadow-gray-100 dark:shadow-gray-900/50 border border-gray-100 dark:border-gray-700 hover:shadow-2xl hover:border-teal-100 dark:hover:border-teal-800 transition-all cursor-pointer group"
                onClick={() => setActiveProject(activeProject === project.id ? null : project.id)}
              >
                {/* Screenshot Placeholder */}
                <div className="relative h-52 overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-xl mb-1 text-gray-900 dark:text-white transition-colors">{project.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-medium transition-colors">{project.company} • {project.year}</p>
                    </div>
                    <ExternalLink size={22} className="text-gray-400 dark:text-gray-500 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors" />
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed transition-colors">{project.description}</p>
                  
                  {activeProject === project.id && (
                    <div className="mt-4 pt-4 border-t-2 border-gray-100 dark:border-gray-700">
                      <h4 className="font-bold mb-3 text-gray-900 dark:text-white transition-colors">Fitur Utama:</h4>
                      <ul className="text-gray-700 dark:text-gray-300 space-y-2 mb-4 transition-colors">
                        {project.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-teal-600 dark:text-teal-400 mt-0.5 font-bold">•</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-2 mt-4">
                    {project.tech.map((tech) => (
                      <span 
                        key={tech} 
                        className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-6 bg-linear-to-br from-teal-600 via-teal-500 to-cyan-600 dark:from-teal-900 dark:via-teal-800 dark:to-cyan-900 transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-3 text-white">Kontak</h2>
            <div className="w-16 h-1.5 bg-white/30 mx-auto rounded-full"></div>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <p className="text-teal-50 dark:text-teal-100 mb-12 text-center text-lg leading-relaxed transition-colors">
              Tertarik untuk berkolaborasi atau ingin tahu lebih lanjut tentang project saya? 
              Hubungi saya melalui kontak di bawah.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <a 
                href="mailto:seffutsmannnn@gmail.com" 
                className="flex items-center gap-4 bg-white/10 backdrop-blur-sm p-6 rounded-xl hover:bg-white/20 transition-all"
              >
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                  <Mail size={26} className="text-white" />
                </div>
                <div>
                  <p className="text-sm text-teal-100 dark:text-teal-200 mb-1 font-medium transition-colors">Email</p>
                  <p className="font-semibold text-white">seffutsmannnn@gmail.com</p>
                </div>
              </a>
              
              <a 
                href="https://wa.me/6282352734167" 
                className="flex items-center gap-4 bg-white/10 backdrop-blur-sm p-6 rounded-xl hover:bg-white/20 transition-all"
                target='_blank'
              >
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                  <Phone size={26} className="text-white" />
                </div>
                <div>
                  <p className="text-sm text-teal-100 dark:text-teal-200 mb-1 font-medium transition-colors">Telepon</p>
                  <p className="font-semibold text-white">082352734167</p>
                </div>
              </a>
              
              <a 
                href="https://github.com/Utsmanseff" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 bg-white/10 backdrop-blur-sm p-6 rounded-xl hover:bg-white/20 transition-all"
              >
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                  <Github size={26} className="text-white" />
                </div>
                <div>
                  <p className="text-sm text-teal-100 dark:text-teal-200 mb-1 font-medium transition-colors">GitHub</p>
                  <p className="font-semibold text-white">github.com/Utsmanseff</p>
                </div>
              </a>
              
              <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                  <MapPin size={26} className="text-white" />
                </div>
                <div>
                  <p className="text-sm text-teal-100 dark:text-teal-200 mb-1 font-medium transition-colors">Lokasi</p>
                  <p className="font-semibold text-white">Banjarbaru, Kalimantan Selatan</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-teal-700 dark:bg-teal-700 transition-colors duration-300">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-400 dark:text-gray-400 transition-colors">
            © 2026 Utsman.
          </p>
        </div>
      </footer>
    </div>
  );
}