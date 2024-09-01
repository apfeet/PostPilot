import React, { useState, useEffect, useRef } from 'react';
import { Instagram, Linkedin, Facebook } from 'lucide-react';
import { checkUserStatus } from './functions/IsUserLoggedIn';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';

// UI Components

// Card component
const Card = ({ children, className }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      );
    }
  }, []);

  return (
    <div ref={cardRef} className={`rounded-2xl shadow-lg p-4 ${className}`}>
      {children}
    </div>
  );
};

// CardHeader component
const CardHeader = ({ children, className }) => (
  <div className={`mb-4 ${className}`}>
    {children}
  </div>
);

// CardTitle component
const CardTitle = ({ children, className }) => (
  <h2 className={`text-lg font-bold ${className}`}>
    {children}
  </h2>
);

// CardContent component
const CardContent = ({ children, className }) => (
  <div className={className}>
    {children}
  </div>
);

// Button component
const Button = ({ children, onClick, className, variant = 'default', size = 'md', disabled = false }) => {
  const buttonRef = useRef(null);

  const handleMouseEnter = () => {
    if (!disabled) {
      gsap.to(buttonRef.current, { scale: 1.1, duration: 0.2, ease: 'power2.out' });
    }
  };

  const handleMouseLeave = () => {
    if (!disabled) {
      gsap.to(buttonRef.current, { scale: 1, duration: 0.2, ease: 'power2.out' });
    }
  };

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      disabled={disabled}
      className={`px-4 py-2 rounded-2xl text-sm font-semibold focus:outline-none transition duration-300 ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

// Input component
const Input = ({ type = 'text', value, onChange, placeholder, className }) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`rounded-2xl p-3 w-full bg-costom-cyan text-gray-600 opacity-90 ${className}`}
  />
);

// Select component
const Select = ({ value, onChange, children }) => (
  <div className="relative">
    <select value={value} onChange={onChange} className="rounded-2xl p-3 w-full bg-costom-cyan text-gray-600 opacity-90">
      {children}
    </select>
  </div>
);

// SelectItem component
const SelectItem = ({ value, children }) => (
  <option value={value}>{children}</option>
);

// Main Dashboard component
const Dashboard = () => {
  const socialPlatforms = [
    { name: 'Instagram', icon: Instagram, color: '#E1306C' },
    { name: 'LinkedIn', icon: Linkedin, color: '#0077B5' },
    { name: 'Facebook', icon: Facebook, color: '#1877F2' },
  ];

  const [connectedAccounts, setConnectedAccounts] = useState([]);
  const [scheduledPosts, setScheduledPosts] = useState([]);
  const [userStatus, setUserStatus] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    
    const IsUserLoggedIn = async () => {
        try {
            const status = await checkUserStatus();
            console.log(status);
            setUserStatus(status);
        } catch (error) {
            console.error("Error in IsUserLoggedIn:", error);
        }
    }

    IsUserLoggedIn()

    // Simulate fetching connected accounts
    setConnectedAccounts(['Instagram', 'LinkedIn']);
  }, []);

  const handleConnect = (platform) => {
    console.log(`Connecting to ${platform}...`);
    setConnectedAccounts([...connectedAccounts, platform]);
  };

  const handleSchedulePost = (post) => {
    setScheduledPosts([...scheduledPosts, post]);
  };

  useEffect(() => {
    if (userStatus === false) {
      navigate("/login-register");
      console.log(userStatus)
    }
  }, [userStatus, navigate]);


  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-white">Social Media Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {socialPlatforms.map((platform) => (
            <Card key={platform.name} className="bg-costom-lightgrey">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">
                  {platform.name}
                </CardTitle>
                <platform.icon color={platform.color} />
              </CardHeader>
              <CardContent>
                {connectedAccounts.includes(platform.name) ? (
                  <Button variant="outline" className="w-full text-black bg-white">
                    Connected
                  </Button>
                ) : (
                  <Button onClick={() => handleConnect(platform.name)} className="w-full bg-white text-black">
                    Connect
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mb-8 bg-costom-lightgrey">
          <CardHeader>
            <CardTitle className="text-white">Schedule a Post</CardTitle>
          </CardHeader>
          <CardContent>
            <SchedulePostForm onSchedule={handleSchedulePost} connectedAccounts={connectedAccounts} />
          </CardContent>
        </Card>

        <Card className="bg-costom-lightgrey">
          <CardHeader>
            <CardTitle className="text-white">Scheduled Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <ScheduledPostsList posts={scheduledPosts} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Form component for scheduling a post
const SchedulePostForm = ({ onSchedule, connectedAccounts }) => {
  const [content, setContent] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [image, setImage] = useState(null);

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
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Post content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <div className="flex space-x-4">
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <Input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />
      </div>
      <Select value="" onChange={(e) => setSelectedPlatforms([...selectedPlatforms, e.target.value])}>
        <SelectItem value="" disabled>Select platforms</SelectItem>
        {connectedAccounts.map((account) => (
          <SelectItem key={account} value={account}>
            {account}
          </SelectItem>
        ))}
      </Select>
      <div className="flex flex-wrap gap-2">
        {selectedPlatforms.map((platform) => (
          <Button
            key={platform}
            variant="outline"
            size="sm"
            className="text-black bg-white"
            onClick={() => setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform))}
          >
            {platform} ✕
          </Button>
        ))}
      </div>
      <Input type="file" onChange={handleImageUpload} />
      <Button type="submit" className="bg-white text-black" disabled={!isFormValid}>
        Schedule Post
      </Button>
    </form>
  );
};

// Component to list scheduled posts
const ScheduledPostsList = ({ posts }) => {
  return (
    <ul className="space-y-2">
      {posts.map((post, index) => (
        <li key={index} className="border p-2 rounded bg-white dark:bg-gray-800">
          <p className="dark:text-white">{post.content}</p>
          {post.image && (
            <img src={URL.createObjectURL(post.image)} alt="Post" className="mt-2 w-full max-h-60 object-cover rounded"/>
          )}
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {post.date} at {post.time} on {post.platforms.join(', ')}
          </p>
        </li>
      ))}
    </ul>
  );
};

export default Dashboard;
