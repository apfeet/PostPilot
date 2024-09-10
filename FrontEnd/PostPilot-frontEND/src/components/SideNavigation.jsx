import React, { useRef, useEffect } from 'react';
import { Home, Calendar, Settings, LogOut } from 'lucide-react';
import gsap from 'gsap';

const NavItem = ({ icon: Icon, label, isActive, onClick }) => (
  <button
    className={`flex items-center space-x-2 text-white hover:text-gray-300 transition-colors duration-200 ${isActive ? 'font-bold' : ''}`}
    onClick={onClick}
  >
    <Icon size={20} />
    <span>{label}</span>
  </button>
);

const SideNavigation = ({ activeTab, setActiveTab, onLogout, isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const sideNavRef = useRef(null);

  useEffect(() => {
    if (sideNavRef.current) {
      gsap.to(sideNavRef.current, {
        opacity: 1,
        x: 0,
        duration: 0.5,
        ease: "power3.out",
      });
    }
  }, []);

  return (
    <nav 
      ref={sideNavRef} 
      className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:block w-full md:w-64 bg-slate-800 p-6 space-y-4 transition-all duration-300 ease-in-out`}
      style={{ opacity: 0, transform: 'translateX(-20px)' }}
    >
      <NavItem icon={Home} label="Home" isActive={activeTab === 'home'} onClick={() => { setActiveTab('home'); setIsMobileMenuOpen(false); }} />
      <NavItem icon={Calendar} label="Calendar" isActive={activeTab === 'calendar'} onClick={() => { setActiveTab('calendar'); setIsMobileMenuOpen(false); }} />
      <NavItem icon={Settings} label="Settings" isActive={activeTab === 'settings'} onClick={() => { setActiveTab('settings'); setIsMobileMenuOpen(false); }} />
      <button onClick={onLogout} className="flex items-center space-x-2 text-white hover:text-gray-300 transition-colors duration-200">
        <LogOut size={20} />
        <span>Logout</span>
      </button>
    </nav>
  );
};

export default SideNavigation;