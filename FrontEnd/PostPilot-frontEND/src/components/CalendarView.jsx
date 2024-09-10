import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

const CalendarView = () => {
  const calendarRef = useRef(null);

  useEffect(() => {
    gsap.to(calendarRef.current, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" });
  }, []);

  return (
    <div ref={calendarRef} className="bg-slate-700 rounded-lg p-4 shadow-lg" style={{ opacity: 0, transform: 'translateY(20px)' }}>
      <h2 className="text-xl font-bold text-white mb-4">Post Calendar</h2>
      <p className="text-white">Calendar view coming soon...</p>
    </div>
  );
};

export default CalendarView;