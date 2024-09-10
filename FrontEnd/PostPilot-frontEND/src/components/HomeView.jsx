import React, { useState, useEffect } from 'react';
import SocialPlatforms from "./SocialPlatforms";
import SchedulePostCard from "./SchedulePostCard";
import ScheduledPostsCard from "./ScheduledPostsCard";

const HomeView = ({ userInfo }) => {
  const [connectedAccounts, setConnectedAccounts] = useState([]);
  const [scheduledPosts, setScheduledPosts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchConnectedAccounts();
    fetchScheduledPosts();
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
      
      // Create a Date object in local time
      const localDate = new Date(`${post.date}T${post.time}`);
      const scheduledTime = localDate.toISOString();
      
      formData.append('scheduled_time', scheduledTime);
      formData.append('timezone', Intl.DateTimeFormat().resolvedOptions().timeZone);  // Invia il fuso orario dell'utente
      
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
      
      // Refresh the scheduled posts
      await fetchScheduledPosts();
    } catch (error) {
      console.error('Error scheduling post:', error);
      alert(`Failed to schedule post: ${error.message}`);
    }
  };

  const ScheduledPosts = ({ posts }) => {
    return (
      <div className="mt-6">
        <h3 className="text-xl font-semibold text-white mb-4">Scheduled Posts</h3>
        {posts.length === 0 ? (
          <p className="text-gray-400">No scheduled posts.</p>
        ) : (
          <ul className="space-y-4">
            {posts.map((post, index) => (
              <li key={index} className="bg-slate-800 rounded-lg p-4 shadow">
                <p className="text-white mb-2">
                  Scheduled for: {new Date(post.scheduled_time_user).toLocaleString()}
                </p>
                <p className="text-gray-400">{post.caption}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Welcome, {userInfo.username}</h2>
      {error && <p className="text-red-500">{error}</p>}
      <SocialPlatforms
        connectedAccounts={connectedAccounts}
        onConnect={handleConnect}
      />
      <SchedulePostCard onSchedule={handleSchedulePost} connectedAccounts={connectedAccounts} />
      <ScheduledPostsCard posts={scheduledPosts} />
    </div>
  );
};

export default HomeView;