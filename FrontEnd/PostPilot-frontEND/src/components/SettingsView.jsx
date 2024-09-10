import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

const SettingsView = () => {
  const settingsRef = useRef(null);

  useEffect(() => {
    gsap.to(settingsRef.current, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" });
  }, []);

  return (
    <div ref={settingsRef} className="bg-slate-700 rounded-lg p-4 shadow-lg" style={{ opacity: 0, transform: 'translateY(20px)' }}>
      <h2 className="text-xl font-bold text-white mb-4">Settings</h2>
      <p className="text-white">Settings options coming soon...</p>
    </div>
  );
};

export default SettingsView;