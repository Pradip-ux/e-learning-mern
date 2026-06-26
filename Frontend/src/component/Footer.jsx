import React from 'react';
// Combine all Lucide icons into ONE line
import { Mail, Globe, ArrowUpRight, Share2, User, ExternalLink } from "lucide-react";
// Only keep this if you have installed react-icons
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa"; 
import { Navigate, useNavigate } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#0a0a0a] pt-16 pb-8 text-white" id="footer-section">
      {/* Subtle background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-64 w-full max-w-4xl bg-blue-600/5 blur-[120px]"></div>

      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          
          {/* Brand Identity */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tighter">
              Skill<span className="text-blue-500">Nest</span>
            </h2>
            <p className="text-sm leading-relaxed text-gray-400">
              Empowering the next generation of developers with premium, 
              industry-standard learning experiences.
            </p>
            <div className="flex gap-4">
              {/* Using generic Lucide icons as fallback */}
              <a href="#" className="text-gray-400 transition-colors hover:text-white"><Share2 size={20} /></a>
              <a href="#" className="text-gray-400 transition-colors hover:text-white"><ExternalLink size={20} /></a>
              <a href="#" className="text-gray-400 transition-colors hover:text-white"><User size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-6 text-sm font-semibold uppercase tracking-widest text-white">Platform</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><a href="#" className="transition-colors hover:text-blue-400"
              onClick={()=>navigate("/allcourses")}>Browse Courses</a></li>
              <li><a href="#" className="transition-colors hover:text-blue-400">Mentorship</a></li>
              <li><a href="#" className="transition-colors hover:text-blue-400">Roadmaps</a></li>
              <li><a href="#" className="transition-colors hover:text-blue-400">Pricing</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="mb-6 text-sm font-semibold uppercase tracking-widest text-white">Resources</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><a href="#" className="transition-colors hover:text-blue-400">Documentation</a></li>
              <li><a href="/support" className="transition-colors hover:text-blue-400 cursor-pointer">Help Center</a></li>
              <li><a href="#" className="transition-colors hover:text-blue-400">Privacy Policy</a></li>
              <li><a href="#" className="transition-colors hover:text-blue-400">Terms of Service</a></li>
            </ul>
          </div>

          {/* Contact & Website */}
          <div>
            <h4 className="mb-6 text-sm font-semibold uppercase tracking-widest text-white">Contact</h4>
            <div className="space-y-4">
              <a 
                href="mailto:skillnest3319@gmail.com" 
                className="group flex items-center gap-3 text-sm text-gray-400 transition-colors hover:text-white"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 transition-colors group-hover:border-blue-500/50 group-hover:bg-blue-500/10">
                  <Mail size={14} className="group-hover:text-blue-400" />
                </div>
                skillnest3319@gmail.com
              </a>
              
              <a 
                href="https://skillnest.com" 
                target="_blank" 
                rel="noreferrer"
                className="group flex items-center gap-3 text-sm text-gray-400 transition-colors hover:text-white"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 transition-colors group-hover:border-blue-500/50 group-hover:bg-blue-500/10">
                  <Globe size={14} className="group-hover:text-blue-400" />
                </div>
                www.skillnest.com
                <ArrowUpRight size={12} className="opacity-0 transition-all group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:opacity-100" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-16 flex flex-col items-center justify-between border-t border-white/5 pt-8 md:flex-row">
          <p className="text-xs text-gray-500">
            © {currentYear} SkillNest LMS. All rights reserved.
          </p>
          <p className="mt-4 text-xs text-gray-600 md:mt-0">
            Designed for high-end digital education.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;