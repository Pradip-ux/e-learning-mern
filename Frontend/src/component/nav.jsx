import React, { useState, useEffect } from "react";
import logg from "../assets/logg.png";
import { IoChevronDownOutline, IoLogOutOutline, IoPersonOutline, IoGridOutline } from "react-icons/io5";
import { HiMenuAlt3 } from "react-icons/hi";
import { VscClose } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { setUserData } from "../redux/userSlice";
import { toast } from "react-toastify";

function Nav() {
  const userData = useSelector((state) => state.user?.userData);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
      }, 150);
    } else if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setShowMobileMenu(false);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(`${serverUrl}/api/auth/logout`, {}, { withCredentials: true });
      dispatch(setUserData(null));
      toast.success("Signed out successfully");
      navigate("/login");
      setShowMobileMenu(false);
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  // UPDATED: Dynamic text color based on scroll state
  const NavLink = ({ label, onClick, path, activeCondition }) => (
    <button
      onClick={onClick || (() => navigate(path))}
      className={`relative text-sm font-bold tracking-wide transition-all duration-300 ${
        activeCondition 
          ? (scrolled ? "text-emerald-600" : "text-white") 
          : (scrolled ? "text-slate-600 hover:text-emerald-600" : "text-slate-200 hover:text-white")
      }`}
    >
      {label}
      {activeCondition && (
        <span className={`absolute -bottom-1 left-0 w-full h-0.5 rounded-full transition-colors ${scrolled ? "bg-emerald-600" : "bg-white"}`} />
      )}
    </button>
  );

  return (
    <nav className={`w-full h-[76px] fixed top-0 left-0 flex items-center justify-between px-6 lg:px-16 z-[100] transition-all duration-500 ${
      scrolled 
        ? "bg-white/80 backdrop-blur-lg border-b border-slate-200/50 shadow-sm" 
        : "bg-transparent"
    }`}>

      {/* LEFT: LOGO */}
      <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate("/")}>
        <div className="relative overflow-hidden rounded-xl ring-2 ring-emerald-500/20 group-hover:ring-emerald-500/40 transition-all">
          <img src={logg} alt="SkillNest" className="w-9 h-9 object-cover transform group-hover:scale-110 transition-transform duration-500" />
        </div>
        <span className={`text-2xl font-black tracking-tight transition-colors duration-300 ${scrolled ? "text-slate-900" : "text-white"}`}>
          Skill<span className="bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent">Nest</span>
        </span>
      </div>

      {/* CENTER: DESKTOP LINKS */}
      <div className="hidden lg:flex items-center gap-10">
        <NavLink path="/" label="Home" activeCondition={location.pathname === "/" && !window.location.hash} />
        <NavLink label="Explore" onClick={() => scrollToSection("card-section")} activeCondition={false} />
        <NavLink label="About" onClick={() => scrollToSection("about-section")} activeCondition={false} />
        <NavLink path="/support" label="Support" activeCondition={location.pathname === "/support"} />
      </div>

      {/* RIGHT: DESKTOP ACTIONS */}
      <div className="hidden lg:flex items-center gap-4">
        {userData ? (
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className={`flex items-center gap-2.5 p-1.5 pr-4 rounded-full border transition-all shadow-sm ${
                scrolled 
                  ? "bg-slate-100/50 border-slate-200 hover:bg-white hover:border-emerald-300" 
                  : "bg-white/10 border-white/20 hover:bg-white/20 text-white"
              }`}
            >
              {userData?.photoUrl ? (
                <img src={userData.photoUrl} alt="User" className="w-8 h-8 rounded-full border border-white shadow-sm" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                  {userData?.name?.charAt(0).toUpperCase()}
                </div>
              )}
              <span className={`text-sm font-bold ${scrolled ? "text-slate-700" : "text-white"}`}>
                {userData?.name ? userData.name.split(" ")[0] : "User"}
              </span>
              <IoChevronDownOutline className={`transition-transform ${showDropdown ? "rotate-180" : ""} ${scrolled ? "text-slate-400" : "text-white/70"}`} />
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-4 w-60 bg-white/95 backdrop-blur-xl border border-slate-100 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-2">
                <div className="px-4 py-3 mb-1 border-b border-slate-50">
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-[0.1em]">Logged in as</p>
                  <p className="text-sm font-bold text-slate-800 truncate">{userData?.email}</p>
                </div>
                <button onClick={() => { navigate("/dashboard"); setShowDropdown(false) }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition-all">
                  <IoGridOutline className="text-lg opacity-70" /> Dashboard
                </button>
                <button onClick={() => { navigate(userData?.role === "Instructor" ? "/instructor/profile" : "/profile"); setShowDropdown(false) }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition-all">
                  <IoPersonOutline className="text-lg opacity-70" /> My Profile
                </button>
                <div className="h-px bg-slate-50 my-1" />
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-rose-500 rounded-xl hover:bg-rose-50 transition-all">
                  <IoLogOutOutline className="text-lg" /> Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/login")} className={`px-5 py-2 text-sm font-bold transition-all ${scrolled ? "text-slate-600 hover:text-emerald-600" : "text-white/90 hover:text-white"}`}>
              Sign In
            </button>
            <button onClick={() => navigate("/Signup")} className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-900/10">
              Get Started
            </button>
          </div>
        )}
      </div>

      {/* MOBILE TRIGGER */}
      <button className={`lg:hidden p-2.5 rounded-xl shadow-sm transition-colors ${scrolled ? "bg-slate-100 text-slate-900" : "bg-white/10 text-white"}`} onClick={() => setShowMobileMenu(true)}>
        <HiMenuAlt3 size={24} />
      </button>

      {/* MOBILE MENU SIDEBAR (Unchanged structure, updated colors) */}
     {/* MOBILE MENU SIDEBAR */}
      <div className={`fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] lg:hidden transition-all duration-300 ${showMobileMenu ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <div className={`absolute right-0 top-0 h-full w-[85%] max-w-xs bg-white shadow-2xl transition-transform duration-500 p-6 flex flex-col ${showMobileMenu ? "translate-x-0" : "translate-x-full"}`}>
          
          <div className="flex justify-between items-center mb-8">
            <span className="font-black text-xl text-slate-900">Skill<span className="text-emerald-600">Nest</span></span>
            <button onClick={() => setShowMobileMenu(false)} className="p-2 rounded-full bg-slate-100 text-slate-500">
              <VscClose size={24} />
            </button>
          </div>

          {/* User Info Section (Mobile) */}
          {userData && (
            <div className="mb-8 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3">
                {userData?.photoUrl ? (
                  <img src={userData.photoUrl} alt="User" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                    {userData?.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="overflow-hidden text-left">
                  <p className="text-sm font-bold text-slate-800 truncate">{userData?.name}</p>
                  <p className="text-xs text-slate-500 truncate">{userData?.email}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2 flex-1 overflow-y-auto">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4 mb-1">Navigation</p>
            {[
              { label: "Home", path: "/" },
              { label: "Explore", action: () => scrollToSection("card-section") },
              { label: "About", action: () => scrollToSection("about-section") },
              { label: "Support", path: "/support" }
            ].map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  item.action ? item.action() : navigate(item.path);
                  setShowMobileMenu(false);
                }}
                className="w-full text-left px-4 py-3 text-base font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-all"
              >
                {item.label}
              </button>
            ))}

            {/* Logged In Specific Links (Mobile) */}
            {userData && (
              <>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4 mt-6 mb-1">Account</p>
                <button 
                  onClick={() => { navigate("/dashboard"); setShowMobileMenu(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-base font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-all"
                >
                  <IoGridOutline className="text-xl text-emerald-600" /> Dashboard
                </button>
                <button 
                  onClick={() => { navigate(userData?.role === "Instructor" ? "/instructor/profile" : "/profile"); setShowMobileMenu(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-base font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-all"
                >
                  <IoPersonOutline className="text-xl text-emerald-600" /> My Profile
                </button>
              </>
            )}
          </div>

          <div className="mt-auto pt-6 border-t border-slate-100">
            {userData ? (
              <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-4 bg-rose-50 text-rose-600 font-bold rounded-2xl hover:bg-rose-100 transition-all">
                <IoLogOutOutline size={20}/> Sign Out
              </button>
            ) : (
              <div className="flex flex-col gap-3">
                <button onClick={() => {navigate("/login"); setShowMobileMenu(false)}} className="w-full py-4 text-slate-600 font-bold hover:text-emerald-600">Sign In</button>
                <button onClick={() => {navigate("/Signup"); setShowMobileMenu(false)}} className="w-full py-4 bg-emerald-600 text-white font-bold rounded-2xl shadow-lg shadow-emerald-100">Get Started</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Nav;