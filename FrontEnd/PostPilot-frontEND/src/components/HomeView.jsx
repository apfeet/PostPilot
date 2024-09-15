import React, { useState, useEffect, useRef } from 'react';
import SocialPlatforms from "./SocialPlatforms";
import PostScheduler from "./PostScheduler";
import { ChevronDown, ChevronUp, RefreshCw, Upload, X, Calendar, Clock } from 'lucide-react';
import TutorialSection from './TutorialSection';

const HomeView = ({ userInfo }) => {
  const [connectedAccounts, setConnectedAccounts] = useState([]);
  const [scheduledPosts, setScheduledPosts] = useState([]);
  const [error, setError] = useState(null);
  const [openSections, setOpenSections] = useState(() => {
    const savedState = localStorage.getItem('openSections');
    return savedState ? JSON.parse(savedState) : {
      accounts: false,
      schedule: false,
      scheduledPosts: false,
    };
  });
  const [tutorialProgress, setTutorialProgress] = useState({});
  const [videoUrl, setVideoUrl] = useState(null);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [isVideoFinished, setIsVideoFinished] = useState(false);
  const videoRef = useRef(null);
  const [postContent, setPostContent] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const toggleSection = (section) => {
    setOpenSections(prev => {
      const newState = { ...prev, [section]: !prev[section] };
      console.log("Toggling section:", section, "New state:", newState);
      localStorage.setItem('openSections', JSON.stringify(newState));
      return newState;
    });
  };

  useEffect(() => {
    fetchConnectedAccounts();
    fetchScheduledPosts();
    fetchTutorialProgress();
    fetchVideoUrl();
  }, []);

  const fetchConnectedAccounts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/connected_accounts", {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setConnectedAccounts(data.connected_accounts || []);
    } catch (error) {
      console.error("Error fetching connected accounts:", error);
      setError("Failed to fetch connected accounts. Please try again later.");
    }
  };

  const fetchScheduledPosts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/instagram/get_pending_posts", {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Fetched scheduled posts:', data);
      setScheduledPosts(data.pending_posts.map(post => ({
        ...post,
        scheduled_time: new Date(post.scheduled_time).toISOString(),
        scheduled_time_user: new Date(post.scheduled_time_user).toISOString()
      })));
    } catch (error) {
      console.error("Error fetching scheduled posts:", error);
      setError("Failed to fetch scheduled posts. Please try again later.");
    }
  };

  const fetchTutorialProgress = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/tutorial_progress", {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched tutorial progress:", data);
      setTutorialProgress(data.progress || {});
    } catch (error) {
      console.error("Error fetching tutorial progress:", error);
      setTutorialProgress({});
    }
  };

  const fetchVideoUrl = async () => {
    try {
      const cachedVideoUrl = localStorage.getItem('tutorialVideoUrl');
      const cachedETag = localStorage.getItem('tutorialVideoETag');

      const headers = new Headers();
      if (cachedETag) {
        headers.append('If-None-Match', cachedETag);
      }

      const response = await fetch("http://localhost:5000/api/tutorial_video/1.mp4", {
        method: "HEAD",
        headers: headers,
        credentials: "include",
      });

      if (response.status === 304) {
        setVideoUrl(cachedVideoUrl);
        setIsVideoLoading(false);
      } else if (response.ok) {
        const newETag = response.headers.get('ETag');
        const newVideoUrl = "http://localhost:5000/api/tutorial_video/1.mp4";
        
        localStorage.setItem('tutorialVideoUrl', newVideoUrl);
        localStorage.setItem('tutorialVideoETag', newETag);
        
        setVideoUrl(newVideoUrl);
        setIsVideoLoading(false);
      } else {
        console.error("Failed to fetch video");
      }
    } catch (error) {
      console.error("Error fetching video:", error);
    }
  };

  const handleConnect = async (platformName) => {
    if (platformName.toLowerCase() === 'instagram') {
      try {
        const response = await fetch("http://localhost:5000/api/instagram/login", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: userInfo.username,
            user_id: userInfo.user_ID
          }),
          credentials: "include",
        });
        const data = await response.json();
        if (data.auth_url) {
          window.location.href = data.auth_url;
        } else {
          throw new Error('No auth URL received from server');
        }
      } catch (error) {
        console.error(`Error connecting to Instagram:`, error);
        setError(`Failed to connect to Instagram: ${error.message}`);
      }
    } else {
      console.log(`Connecting to ${platformName} is not implemented yet.`);
    }
  };

  const handleSchedulePost = async (post) => {
    try {
      const formData = new FormData();
      formData.append('media_type', post.image ? 'photo' : 'carousel');
      formData.append('caption', post.content);
      
      const localDate = new Date(`${post.date}T${post.time}`);
      const scheduledTime = localDate.toISOString();
      
      formData.append('scheduled_time', scheduledTime);
      formData.append('timezone', Intl.DateTimeFormat().resolvedOptions().timeZone);
      
      if (post.image) {
        formData.append('media', post.image);
      }

      console.log('Scheduling post:', { content: post.content, scheduledTime });

      const response = await fetch('http://localhost:5000/api/instagram/schedule_post', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to schedule post');
      }

      console.log('Post scheduled successfully:', result);
      
      await fetchScheduledPosts();
    } catch (error) {
      console.error('Error scheduling post:', error);
      alert(`Failed to schedule post: ${error.message}`);
    }
  };

  const handleTutorialProgress = async (section, progress) => {
    try {
      console.log(`Updating tutorial progress: section=${section}, progress=${progress}`);
      const response = await fetch("http://localhost:5000/api/update_tutorial_progress", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ section, progress }),
        credentials: "include",
      });
      
      const data = await response.json();
      console.log('Full server response:', response);
      console.log('Server response data:', data);
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update tutorial progress');
      }
      
      setTutorialProgress(prev => ({ ...prev, [section]: progress }));
    } catch (error) {
      console.error("Error updating tutorial progress:", error);
    }
  };

  const resetTutorialProgress = async () => {
    try {
      console.log("Resetting tutorial progress");
      const response = await fetch("http://localhost:5000/api/reset_tutorial_progress", {
        method: "POST",
        credentials: "include",
      });
      
      const data = await response.json();
      console.log('Reset progress response:', data);
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to reset tutorial progress');
      }
      
      setTutorialProgress(prev => ({ ...prev, tutorial: 0 }));
    } catch (error) {
      console.error("Error resetting tutorial progress:", error);
    }
  };

  const handleRemoveScheduledPost = async (postId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/instagram/remove_scheduled_post/${postId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to remove scheduled post');
      }

      // Aggiorna la lista dei post schedulati dopo la rimozione
      await fetchScheduledPosts();
      alert('Post removed from schedule successfully!');
    } catch (error) {
      console.error('Error removing scheduled post:', error);
      alert(`Failed to remove scheduled post: ${error.message}`);
    }
  };

  const ScheduledPosts = ({ posts }) => {
    return (
      <div className="mt-6">
        <h3 className="text-xl font-semibold text-white mb-4">Scheduled Posts</h3>
        {posts.length === 0 ? (
          <p className="text-gray-400">No scheduled posts.</p>
        ) : (
          <ul className="space-y-6">
            {posts.map((post, index) => (
              <li key={index} className="bg-slate-700 rounded-lg p-6 shadow-lg">
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-grow">
                    <p className="text-white font-semibold">
                      Scheduled for: {new Date(post.scheduled_time_user).toLocaleString()}
                    </p>
                    <p className="text-gray-300">{post.caption}</p>
                    {/* Debug information */}
                    <p className="text-xs text-gray-500">Media URL: {post.media_url || 'Not available'}</p>
                  </div>
                  {post.media_url ? (
                    <img 
                      src={post.media_url} 
                      alt="Post media" 
                      className="w-24 h-24 object-cover rounded-md ml-4"
                      onError={(e) => {
                        console.error("Error loading image:", e);
                        e.target.src = "https://via.placeholder.com/150?text=Image+Not+Found";
                        e.target.alt = "Image load failed";
                      }}
                    />
                  ) : (
                    <div className="w-24 h-24 bg-slate-600 rounded-md ml-4 flex items-center justify-center text-slate-400">
                      No Image
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleRemoveScheduledPost(post.id)}
                  className="mt-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md transition duration-300"
                >
                  Remove from Schedule
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  const handleVideoEnd = () => {
    setIsVideoFinished(true);
  };

  const restartVideo = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setIsVideoFinished(false);
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (files) => {
    if (files[0]) {
      setUploadedFile(files[0]);
    }
  };

  const handleFileChange = (event) => {
    handleFiles(event.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const scheduledDateTime = `${scheduledDate}T${scheduledTime}`;
    
    try {
      await handleSchedulePost({
        content: postContent,
        date: scheduledDate,
        time: scheduledTime,
        image: uploadedFile
      });

      // Resetta i campi del form dopo il successo
      setPostContent('');
      setScheduledDate('');
      setScheduledTime('');
      setUploadedFile(null);

      // Aggiorna la lista dei post schedulati
      await fetchScheduledPosts();

      // Mostra un messaggio di successo all'utente
      alert('Post scheduled successfully!');
    } catch (error) {
      console.error('Error scheduling post:', error);
      alert(`Failed to schedule post: ${error.message}`);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white mb-6">Welcome, {userInfo.username}!</h1>

      {/* Connect Your Accounts Section */}
      <div className="bg-slate-800 rounded-lg p-4">
        <button
          className="flex justify-between items-center w-full text-white text-xl font-semibold"
          onClick={() => toggleSection('accounts')}
        >
          Connect Your Accounts
          {openSections.accounts ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
        </button>
        {openSections.accounts && (
          <div className="mt-4">
            <SocialPlatforms
              connectedAccounts={connectedAccounts}
              onConnect={handleConnect}
            />
          </div>
        )}
      </div>

      {/* Schedule a Post Section */}
      <div className="bg-slate-800 rounded-lg p-4">
        <button
          className="flex justify-between items-center w-full text-white text-xl font-semibold"
          onClick={() => toggleSection('schedule')}
        >
          Schedule a post
          {openSections.schedule ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
        </button>
        {openSections.schedule && (
          <div className="mt-4 p-6 bg-slate-700 rounded-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="postContent" className="block text-sm font-medium text-slate-300 mb-2">
                  Post content
                </label>
                <textarea
                  id="postContent"
                  rows={6}
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  className="w-full rounded-md bg-slate-600 border-slate-500 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-slate-200 p-3 resize-none"
                  placeholder="What's on your mind? Write your post content here..."
                ></textarea>
                <p className="text-sm text-slate-400 mt-1">
                  {postContent.length}/2200 characters
                </p>
              </div>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label htmlFor="postDate" className="block text-sm font-medium text-slate-300 mb-2">
                    Schedule date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      id="postDate"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className="w-full rounded-md bg-slate-600 border-slate-500 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-slate-200 p-3 pr-10"
                    />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                  </div>
                </div>
                <div className="flex-1">
                  <label htmlFor="postTime" className="block text-sm font-medium text-slate-300 mb-2">
                    Schedule time
                  </label>
                  <div className="relative">
                    <input
                      type="time"
                      id="postTime"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      className="w-full rounded-md bg-slate-600 border-slate-500 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-slate-200 p-3 pr-10"
                    />
                    <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Upload media
                </label>
                <div
                  className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
                    isDragging ? 'border-indigo-500 bg-slate-600' : 'border-slate-500 hover:border-indigo-500 hover:bg-slate-600'
                  }`}
                  onDragEnter={handleDragEnter}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  {uploadedFile ? (
                    <div className="flex items-center justify-center">
                      <img src={URL.createObjectURL(uploadedFile)} alt="Uploaded" className="max-h-32 max-w-full" />
                      <button 
                        type="button" 
                        onClick={(e) => { e.stopPropagation(); setUploadedFile(null); }} 
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        <X size={24} />
                      </button>
                    </div>
                  ) : (
                    <div className="text-slate-400">
                      <Upload size={48} className="mx-auto mb-2" />
                      <p>Drag and drop an image here, or click to select one</p>
                    </div>
                  )}
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-md transition duration-300 flex items-center justify-center"
              >
                Schedule Post
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Scheduled Posts Section */}
      <div className="bg-slate-800 rounded-lg p-4">
        <button
          className="flex justify-between items-center w-full text-white text-xl font-semibold"
          onClick={() => toggleSection('scheduledPosts')}
        >
          Scheduled Posts
          {openSections.scheduledPosts ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
        </button>
        {openSections.scheduledPosts && (
          <div className="mt-4">
            <ScheduledPosts posts={scheduledPosts} />
          </div>
        )}
      </div>

      {/* Tutorial Section */}
      <TutorialSection userInfo={userInfo} />
    </div>
  );
};

export default HomeView;