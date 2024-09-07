import React, { useState, useEffect, useRef } from 'react';
import { Instagram, Linkedin, Facebook, LogOut, Home, Calendar, Settings, Menu } from 'lucide-react';
import { checkUserStatus } from './functions/IsUserLoggedIn';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';

const Dashboard = () => {
  const socialPlatforms = [
    { name: 'Instagram', icon: Instagram, color: '#E1306C' },
    { name: 'LinkedIn', icon: Linkedin, color: '#0077B5' },
    { name: 'Facebook', icon: Facebook, color: '#1877F2' },
  ];

  const [connectedAccounts, setConnectedAccounts] = useState([]);
  const [scheduledPosts, setScheduledPosts] = useState([]);
  const [userStatus, setUserStatus] = useState(null);
  const [userInfo, setUserInfo] = useState({});
  const [activeTab, setActiveTab] = useState('home');
  const [instagramAuthUrl, setInstagramAuthUrl] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const dashboardRef = useRef(null);
  const sideNavRef = useRef(null);
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

          const connectedAccounts = data.connected_account.map(account =>
            socialPlatforms.find(platform => platform.name.toLowerCase() === account.toLowerCase())
          ).filter(platform => platform);

          setConnectedAccounts(connectedAccounts);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [userStatus]);

  useEffect(() => {
    if (dashboardRef.current && sideNavRef.current && mainContentRef.current) {
      gsap.set([dashboardRef.current, sideNavRef.current, mainContentRef.current], { opacity: 0, y: 20 });
      gsap.to([dashboardRef.current, sideNavRef.current, mainContentRef.current], {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.2,
      });
    }
  }, []);

  const handleInstagramLogin = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/instagram/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          username: userInfo.username,
          user_id: userInfo.user_ID 
        }),
        credentials: 'include',
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to initiate Instagram login');
      }
  
      const data = await response.json();
      if (data.auth_url) {
        window.location.href = data.auth_url;
      } else {
        throw new Error('No auth URL received from server');
      }
    } catch (error) {
      console.error('Error initiating Instagram login:', error);
    }
  };

  const handleConnect = (platform) => {
    if (platform.name === 'Instagram') {
      handleInstagramLogin();
    } else {
      setConnectedAccounts(prev => [...prev, platform]);
    }
  };

  const handleSchedulePost = async (post) => {
    if (post.platforms.includes('Instagram')) {
      const formData = new FormData();
      formData.append('media_type', post.image ? 'photo' : 'carousel');
      formData.append('caption', post.content);
      formData.append('scheduled_time', `${post.date}T${post.time}`);
      if (post.image) {
        formData.append('media', post.image);
      }

      try {
        const response = await fetch('http://localhost:5000/api/instagram/schedule_post', {
          method: 'POST',
          body: formData,
          credentials: 'include'
        });

        const data = await response.json();
        if (response.ok) {
          console.log('Post scheduled successfully', data);
          // Update the scheduledPosts state
          setScheduledPosts(prevPosts => [...prevPosts, post]);
        } else {
          console.error('Failed to schedule post:', data.error);
        }
      } catch (error) {
        console.error('Error scheduling post:', error);
      }
    }
  };

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
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Welcome, {userInfo.username}</h2>
            <SocialPlatforms
              platforms={socialPlatforms}
              connectedAccounts={connectedAccounts}
              onConnect={handleConnect}
            />
            <SchedulePostCard onSchedule={handleSchedulePost} connectedAccounts={connectedAccounts} />
            <ScheduledPostsCard posts={scheduledPosts} />
          </div>
        );
      case 'calendar':
        return <CalendarView scheduledPosts={scheduledPosts} />;
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
    return null; // The useEffect will handle the navigation
  }

  return (
    <div ref={dashboardRef} className="flex flex-col md:flex-row h-screen bg-gradient-to-br from-slate-900 to-slate-700">
      <SideNavigation 
        ref={sideNavRef}
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

const SideNavigation = React.forwardRef(({ activeTab, setActiveTab, onLogout, isMobileMenuOpen, setIsMobileMenuOpen }, ref) => (
  <nav ref={ref} className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:block w-full md:w-64 bg-slate-800 p-6 space-y-4 transition-all duration-300 ease-in-out`}>
    <NavItem icon={Home} label="Home" isActive={activeTab === 'home'} onClick={() => { setActiveTab('home'); setIsMobileMenuOpen(false); }} />
    <NavItem icon={Calendar} label="Calendar" isActive={activeTab === 'calendar'} onClick={() => { setActiveTab('calendar'); setIsMobileMenuOpen(false); }} />
    <NavItem icon={Settings} label="Settings" isActive={activeTab === 'settings'} onClick={() => { setActiveTab('settings'); setIsMobileMenuOpen(false); }} />
    <button onClick={onLogout} className="flex items-center space-x-2 text-white hover:text-gray-300 transition-colors duration-200">
      <LogOut size={20} />
      <span>Logout</span>
    </button>
  </nav>
));

const NavItem = ({ icon: Icon, label, isActive, onClick }) => (
  <button
    className={`flex items-center space-x-2 text-white hover:text-gray-300 transition-colors duration-200 ${isActive ? 'font-bold' : ''}`}
    onClick={onClick}
  >
    <Icon size={20} />
    <span>{label}</span>
  </button>
);

const SocialPlatforms = ({ platforms, connectedAccounts, onConnect }) => {
  const platformsRef = useRef([]);

  useEffect(() => {
    platformsRef.current.forEach((platform, index) => {
      gsap.to(platform, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        delay: index * 0.1,
        ease: "power3.out"
      });
    });
  }, []);

  return (
    <div className="bg-slate-700 rounded-lg p-4 shadow-lg">
      <h2 className="text-xl font-bold text-white mb-4">Connect Your Accounts</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {platforms.map((platform, index) => (
          <div 
            key={platform.name} 
            ref={el => platformsRef.current[index] = el}
            className="bg-slate-800 rounded-lg p-4 flex flex-col items-center transform hover:scale-105 transition-transform duration-200"
            style={{ opacity: 0, transform: 'translateY(20px)' }}
          >
            <platform.icon size={48} color={platform.color} />
            <h3 className="text-lg font-semibold text-white mt-2">{platform.name}</h3>
            {connectedAccounts.some(acc => acc.name === platform.name) ? (
              <span className="mt-2 px-4 py-2 bg-green-500 text-white rounded">Connected</span>
            ) : (
              <button onClick={() => onConnect(platform)} className="mt-2 px-4 py-2 bg-white text-black rounded hover:bg-gray-200 transition-colors duration-200">Connect</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const SchedulePostCard = ({ onSchedule, connectedAccounts }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    gsap.to(cardRef.current, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" });
  }, []);

  return (
    <div ref={cardRef} className="bg-slate-700 rounded-lg p-4 shadow-lg" style={{ opacity: 0, transform: 'translateY(20px)' }}>
      <h2 className="text-xl font-bold text-white mb-4">Schedule a Post</h2>
      <SchedulePostForm onSchedule={onSchedule} connectedAccounts={connectedAccounts} />
    </div>
  );
};

const SchedulePostForm = ({ onSchedule, connectedAccounts }) => {
  const [content, setContent] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [image, setImage] = useState(null);
  const formRef = useRef(null);

  useEffect(() => {
    if (formRef.current) {
      gsap.to(formRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power3.out"
      });
    }
  }, []);

  const handleImageUpload = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSchedule({ content, date, time, platforms: selectedPlatforms, image });
    setContent('');
    setDate('');
    setTime('');
    setSelectedPlatforms([]);
    setImage(null);
  };

  const isFormValid = content && date && time && selectedPlatforms.length > 0;

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4" style={{ opacity: 0, transform: 'translateY(20px)' }}>
      <textarea
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        className="w-full p-2 bg-slate-600 text-white placeholder-gray-400 rounded"
      />
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="p-2 bg-slate-600 text-white rounded w-full sm:w-auto"
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
          className="p-2 bg-slate-600 text-white rounded w-full sm:w-auto"
        />
      </div>
      <select
        value=""
        onChange={(e) => setSelectedPlatforms([...selectedPlatforms, e.target.value])}
        className="w-full p-2 bg-slate-600 text-white rounded"
      >
        <option value="" disabled>Select platforms</option>
        {connectedAccounts.map((account) => (
          <option key={account.name} value={account.name}>{account.name}</option>
        ))}
      </select>
      <div className="flex flex-wrap gap-2">
        {selectedPlatforms.map((platform) => (
          <button
            key={platform}
            type="button"
            className="px-2 py-1 text-sm text-white border border-white rounded hover:bg-slate-600"
            onClick={() => setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform))}
          >
            {platform} ✕
          </button>
        ))}
      </div>
      <input type="file" onChange={handleImageUpload} className="text-white" />
      <button type="submit" className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" disabled={!isFormValid}>
        Schedule Post
      </button>
    </form>
  );
};

const ScheduledPostsCard = ({ posts }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    gsap.to(cardRef.current, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" });
  }, []);

  return (
    <div ref={cardRef} className="bg-slate-700 rounded-lg p-4 shadow-lg" style={{ opacity: 0, transform: 'translateY(20px)' }}>
      <h2 className="text-xl font-bold text-white mb-4">Scheduled Posts</h2>
      <ScheduledPostsList posts={posts} />
    </div>
  );
};

const ScheduledPostsList = ({ posts }) => (
  <ul className="space-y-2">
    {posts.map((post, index) => (
      <li key={index} className="border border-slate-600 p-4 rounded bg-slate-800">
        <p className="text-white">{post.content}</p>
        {post.image && (
          <img src={URL.createObjectURL(post.image)} alt="Post" className="mt-2 w-full max-h-60 object-cover rounded"/>
        )}
        <p className="text-sm text-gray-400 mt-2">
          {post.date} at {post.time} on {post.platforms.join(', ')}
        </p>
      </li>
    ))}
  </ul>
);

const CalendarView = ({ scheduledPosts }) => {
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

export default Dashboard;
