import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { checkUserStatus } from './functions/IsUserLoggedIn';
import SideNavigation from './SideNavigation';
import HomeView from './HomeView';
import CalendarView from './CalendarView';
import SettingsView from './SettingsView';
import gsap from 'gsap';

const Dashboard = () => {
  const [userStatus, setUserStatus] = useState(null);
  const [userInfo, setUserInfo] = useState({});
  const [activeTab, setActiveTab] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const dashboardRef = useRef(null);
  const mainContentRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const status = await checkUserStatus();
        setUserStatus(status);

        if (status) {
          const response = await fetch("http://localhost:5000/api/UserInfo", {
            method: "GET",
            credentials: "include",
          });
          const data = await response.json();
          setUserInfo(data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [userStatus]);

  useEffect(() => {
    if (dashboardRef.current && mainContentRef.current) {
      gsap.set([dashboardRef.current, mainContentRef.current], { opacity: 0, y: 20 });
      gsap.to([dashboardRef.current, mainContentRef.current], {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.2,
      });
    }
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:5000/api/logout', { method: 'POST' });
      navigate('/login-register');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  useEffect(() => {
    if (userStatus === false) {
      navigate("/login-register");
    }
  }, [userStatus, navigate]);

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeView userInfo={userInfo} />;
      case 'calendar':
        return <CalendarView />;
      case 'settings':
        return <SettingsView />;
      default:
        return null;
    }
  };

  if (userStatus === null) {
    return <div className="text-white">Loading...</div>;
  }

  if (userStatus === false) {
    return null;
  }

  return (
    <div ref={dashboardRef} className="flex flex-col md:flex-row h-screen bg-gradient-to-br from-slate-900 to-slate-700">
      <SideNavigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      <main ref={mainContentRef} className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-4 md:hidden">
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white">
            <Menu size={24} />
          </button>
        </div>
        {renderContent()}
      </main>
    </div>
  );
};

export default Dashboard;
