import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

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

const ScheduledPostsList = ({ posts = [] }) => (
  <ul className="space-y-2">
    {posts.length === 0 ? (
      <li className="text-white">No scheduled posts yet.</li>
    ) : (
      posts.map((post) => (
        <li key={post._id} className="border border-slate-600 p-4 rounded bg-slate-800">
          <p className="text-white">{post.caption}</p>
          {post.media_path && (
            <img src={`http://localhost:5000/api/img/${post.media_path}`} alt="Post" className="mt-2 w-full max-h-60 object-cover rounded"/>
          )}
          <p className="text-sm text-gray-400 mt-2">
            Scheduled for (Your local time): {new Date(post.scheduled_time).toLocaleString()}
          </p>
          <p className="text-sm text-gray-400">
            Scheduled for (Server time): {new Date(post.scheduled_time).toUTCString()}
          </p>
          <p className="text-sm text-gray-400">
            Status: {post.status}
          </p>
        </li>
      ))
    )}
  </ul>
);

export default ScheduledPostsCard;