import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import ReviewCard from './ReviewCard';

function ReviewPage() {
  const { reviewData } = useSelector(state => state.review);

  const latestReviews = useMemo(() => {
    if (Array.isArray(reviewData)) {
      return reviewData.slice(0, 6);
    }
    if (reviewData?.reviews && Array.isArray(reviewData.reviews)) {
      return reviewData.reviews.slice(0, 6);
    }
    return [];
  }, [reviewData]);

  return (
    <div className='w-full min-h-screen bg-[#050505] text-white flex flex-col items-center px-6 py-20 overflow-hidden relative'>
      
      {/* Premium Background Ambient Glows */}
      <div className="absolute top-[-10%] left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Heading Section */}
      <div className='text-center max-w-4xl z-10 relative mb-16'>
        <div className="inline-block px-4 py-1.5 mb-6 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            REVIEWS
          </span>
        </div>
        
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
          Loved by <span className="bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent"></span> <br className="hidden md:block"/> 
          <span className="italic font-serif text-blue-400">ambitious</span> learners
        </h2>
        
        <p className='text-zinc-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed'>
          Join a global community of professionals who have transformed their careers through our industry-leading courses.
        </p>
      </div>

      {/* Reviews Grid */}
      <div className='w-full max-w-7xl grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 z-10'>
        {latestReviews.map((item, index) => (
          <div
            key={index}
            className='group relative flex'
          >
            {/* Animated Border Gradient */}
            <div className="absolute -inset-[1px] bg-gradient-to-b from-white/20 to-transparent rounded-[2rem] opacity-100 transition-all duration-500 group-hover:from-blue-500/50 group-hover:to-purple-500/50" />
            
            <div className='relative w-full bg-[#0a0a0a]/80 backdrop-blur-xl rounded-[2rem] p-8 transition-all duration-500 group-hover:-translate-y-2 flex flex-col justify-between overflow-hidden'>
              
              {/* Subtle inner glow on hover */}
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Header: Course & Stars */}
              <div className="flex justify-between items-start mb-8">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-400 border border-white/10 px-3 py-1 rounded-full group-hover:border-blue-500/30 group-hover:text-blue-400 transition-colors">
                 {item.course?.title || "Course Review"}
                </span>
                <div className="flex gap-0.5 text-yellow-500 text-xs">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>{i < (item.rating || 5) ? "★" : "☆"}</span>
                  ))}
                </div>
              </div>

              <ReviewCard
                image={item.user?.image || item.user?.photoUrl}
                text={item.review || item.comment}
                name={item.user?.firstName ? `${item.user.firstName} ${item.user.lastName}` : item.user?.name}
                role={item.user?.role}
                rating={item.rating}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReviewPage;