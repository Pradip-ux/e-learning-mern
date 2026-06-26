import React, { useEffect, useState } from "react";
import { FaArrowLeftLong, FaFilter, FaXmark } from "react-icons/fa6"; // Added toggle icons
import { useNavigate } from "react-router-dom";
import ai from "../assets/SearchAi.png";
import { useSelector } from "react-redux";
import Card from "../component/Card";

function AllCourses() {
    const navigate = useNavigate();
    const { courseData } = useSelector((state) => state.course);
    const [category, setcategory] = useState([]);
    const [filterCourses, setfilterCourses] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for mobile drawer

    const toggleCategory = (e) => {
        if (category.includes(e.target.value)) {
            setcategory((prev) => prev.filter((c) => c !== e.target.value));
        } else {
            setcategory((prev) => [...prev, e.target.value]);
        }
    };

    const applyfilter = () => {
        let courseCopy = courseData?.slice() || [];
        if (category.length > 0) {
            courseCopy = courseCopy.filter((c) => category.includes(c.category));
        }
        setfilterCourses(courseCopy);
    };

    useEffect(() => { setfilterCourses(courseData) }, [courseData]);
    useEffect(() => { applyfilter() }, [category]);

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 overflow-x-hidden">
            
            {/* STICKY NAVBAR */}
            <nav className="sticky top-0 z-[100] h-[70px] w-full bg-[#020617]/90 backdrop-blur-md border-b border-white/5 flex items-center px-4 md:px-8 justify-between">
                <div className="flex items-center gap-4">
                    <FaArrowLeftLong 
                        className="cursor-pointer text-xl hover:text-indigo-400 transition" 
                        onClick={() => navigate("/")} 
                    />
                    <h1 className="text-lg md:text-xl font-bold tracking-tight">Course Library</h1>
                </div>

                {/* MOBILE FILTER TOGGLE (Hidden on Desktop) */}
                <button 
                    onClick={() => setIsSidebarOpen(true)}
                    className="md:hidden flex items-center gap-2 bg-indigo-600 px-4 py-2 rounded-lg text-sm font-bold"
                >
                    <FaFilter className="text-xs" /> Filters
                </button>
            </nav>

            <div className="relative flex flex-col md:grid md:grid-cols-[260px_1fr]">
                
                {/* SIDEBAR (Responsive Drawer) */}
                <aside className={`
                    fixed inset-y-0 left-0 z-[110] w-[280px] bg-[#03081a] p-6 border-r border-white/10 transition-transform duration-300 ease-in-out
                    md:sticky md:top-[70px] md:h-[calc(100vh-70px)] md:translate-x-0 md:z-0
                    ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
                `}>
                    <div className="flex justify-between items-center mb-8 md:hidden">
                        <span className="font-bold">Filters</span>
                        <FaXmark className="text-xl" onClick={() => setIsSidebarOpen(false)} />
                    </div>

                    <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 py-3 
                    rounded-xl font-bold text-sm mb-8" onClick={()=>navigate("/searchwithai")}>
                        Search With AI <img src={ai} alt="" className="w-4" />
                    </button>

                    <div className="space-y-2">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Categories</p>
                        {[
                            'App Development', 'AI/ML', 'AI Tools', 'Data Science', 'Data Analytics',
                            'Ethical Hacking', 'UI UX Designing', 'Web Development', 'Others'
                        ].map((cat, i) => (
                            <label key={i} className={`flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all border ${category.includes(cat) ? 'bg-indigo-600/20 border-indigo-500/50 text-white' : 'border-transparent text-slate-400 hover:bg-white/5'}`}>
                                <span className="text-sm font-medium">{cat}</span>
                                <input 
                                    type="checkbox" 
                                    value={cat} 
                                    checked={category.includes(cat)}
                                    onChange={toggleCategory} 
                                    className="accent-indigo-500 w-4 h-4"
                                />
                            </label>
                        ))}
                    </div>
                </aside>

                {/* MOBILE OVERLAY */}
                {isSidebarOpen && (
                    <div 
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[105] md:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                {/* MAIN CONTENT AREA */}
                <main className="p-4 md:p-8 lg:p-12">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 items-stretch">
                        {filterCourses?.map((course, index) => (
                            <div key={index} className="w-full">
                                <Card 
                                    thumbnail={course.thumbnail}
                                    title={course.title}
                                    category={course.category}
                                    price={course.price}
                                    id={course._id} 
                                    reviews={course.reviews}
                                />
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default AllCourses;