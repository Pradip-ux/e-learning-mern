import React from "react";
import Nav from "../component/nav"
import bg from "../assets/bg2.png"
import { SiViaplay } from "react-icons/si";
import ai from "../assets/ai.png"
import ai1 from "../assets/SearchAi.png";
import Logos from "../component/logos";
import ExploreCourses from "../component/ExploreCourses";
import CardPage from "../component/CardPage";
import { useNavigate } from "react-router-dom";
import AboutSection from "../component/AboutSection";
import Footer from "../component/Footer";
import ReviewPage from "../component/ReviewPage"

function Home() {
    const navigate = useNavigate();

    return (
        <div className="w-full overflow-x-hidden bg-[#f8fafc]">
            {/* HERO SECTION */}
            {/* Changed h-[70vh] to min-h-[600px] on mobile to prevent content clipping */}
            <div className="w-full lg:h-[100vh] min-h-[85vh] md:h-[70vh] relative flex items-center justify-center overflow-hidden">
                <Nav />
                
                {/* Background Image Container */}
                <div className="absolute inset-0 w-full h-full z-0">
                    <img 
                        src={bg} 
                        alt="Background" 
                        className="w-full h-full object-cover object-center brightness-[0.6] lg:brightness-[0.7] scale-110 lg:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/20 to-slate-900/60" />
                </div>

                {/* Content Overlay */}
                <div className="relative z-10 w-full max-w-7xl px-4 sm:px-6 text-center mt-16 md:mt-20">
                    <h1 className="flex flex-col gap-1 md:gap-2">
                        <span className="text-white text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black tracking-tight drop-shadow-2xl">
                            Grow your Skills
                        </span>
                        <span className="bg-gradient-to-r from-indigo-300 to-violet-200 bg-clip-text text-transparent text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black tracking-tight">
                            Advance Your Career
                        </span>
                    </h1>
                    
                    <p className="mt-4 md:mt-6 text-slate-200 text-base md:text-lg max-w-xl mx-auto font-medium opacity-90 px-2">
                        Access world-class education from industry experts and take the next step in your professional journey with our AI-powered learning platform.
                    </p>

                    {/* Button Container - Better stacking on small screens */}
                    <div className="mt-8 md:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-5">
                        {/* Primary Button */}
                        <button 
                            className="group w-full sm:w-auto px-8 py-4 bg-white text-slate-900 rounded-2xl text-lg font-bold flex items-center justify-center gap-3 transition-all duration-300 active:scale-95 hover:bg-indigo-50 lg:hover:scale-105"
                            onClick={() => navigate("/allcourses")}
                        >
                            View All Courses 
                            <SiViaplay className="w-5 h-5 text-indigo-600 transition-transform group-hover:rotate-12" />
                        </button>

                        {/* AI Button */}
                        <button 
                            className="group w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl text-lg font-bold flex items-center justify-center gap-3 transition-all duration-300 active:scale-95 hover:bg-white/20 lg:hover:scale-105"
                            onClick={() => navigate("/searchwithai")}
                        >
                            Search With AI
                            <div className="relative flex items-center">
                                {/* Always show icon on mobile, toggle sources based on screen */}
                                <img src={ai1} className="w-7 h-7 rounded-full lg:hidden border border-white/30" alt="AI"/>
                                <img src={ai} className="w-7 h-7 rounded-full hidden lg:block border border-white/30" alt="AI"/>
                                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_10px_#34d399]" />
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Other Sections */}
            <div className="relative z-20 bg-white">
                <div className="py-8 md:py-12">
                    <Logos />
                </div>
                <ExploreCourses />
                <div id="card-section" className="py-10">
                    <CardPage />
                </div>
                <div id="about-section">
                    <AboutSection />
                </div>
                <ReviewPage />
                <Footer />
            </div>
        </div>
    );
}

export default Home;