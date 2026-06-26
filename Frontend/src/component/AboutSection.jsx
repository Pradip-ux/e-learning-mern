import React from 'react';
import { useSelector } from 'react-redux';

const AboutSection = () => {

  const { allUsers = [] } = useSelector(state => state.user); 
  const { courseData = [] } = useSelector(state => state.course);

  // Logic to calculate values
  const studentCount = allUsers.filter(user => user.role === "Student").length;
  const courseCount = courseData.length;
  const stats = [
    { label: 'Active Learners', value: studentCount > 0 ? `${studentCount}+` : '100+' },
    { label: 'Premium Courses', value:courseCount },
    { label: 'Expert Mentors', value: '50+' },
    { label: 'Success Rate', value: '98%' },
  ];

  return (
    <section id="about-section" style={{ scrollMarginTop: '72px' }} className="relative overflow-hidden bg-[#0a0a0a] py-24 text-white">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 -left-20 h-96 w-96 rounded-full bg-blue-600/10 blur-[120px]"></div>
      <div className="absolute bottom-0 -right-20 h-96 w-96 rounded-full bg-purple-600/10 blur-[120px]"></div>

      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          
          {/* Left Side: Visual/Image Stack */}
          <div className="relative">
            <div className="relative z-10 overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-2 backdrop-blur-sm">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800" 
                alt="Collaborative Learning" 
                className="rounded-xl object-cover grayscale transition-all duration-500 hover:grayscale-0"
              />
            </div>
            {/* Floating Glass Card */}
            <div className="absolute -bottom-8 -right-8 z-20 hidden rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-xl md:block">
              <p className="text-sm font-medium text-blue-400">Global Recognition</p>
              <p className="text-2xl font-bold italic">Top LMS 2026</p>
            </div>
          </div>

          {/* Right Side: Content */}
          <div className="space-y-8">
            <div>
              <h3 className="mb-2 text-sm font-semibold tracking-widest uppercase text-blue-500">
                Our Story
              </h3>
              <h2 className="text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
                Redefining the <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Future of Learning</span>
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-gray-400">
                SkillNest isn't just a platform; it's an ecosystem designed for high-impact growth. 
                We bridge the gap between academic theory and industry mastery by providing 
                a sleek, intuitive environment for builders, creators, and leaders.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-6 pt-4">
              {stats.map((stat, index) => (
                <div key={index} className="group rounded-xl border border-white/5 bg-white/5 p-4 transition-colors hover:bg-white/10">
                  <h4 className="text-3xl font-bold text-white">{stat.value}</h4>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <button className="rounded-full bg-white px-8 py-4 text-sm font-bold text-black transition-transform hover:scale-105 active:scale-95">
                Learn More About Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;