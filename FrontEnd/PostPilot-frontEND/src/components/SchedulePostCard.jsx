import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';

const SchedulePostCard = ({ onSchedule, connectedAccounts = [] }) => {
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

const SchedulePostForm = ({ onSchedule, connectedAccounts = [] }) => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const scheduledDateTime = new Date(`${date}T${time}:00`);

    if (selectedPlatforms.length === 0) {
      alert("Please select at least one platform.");
      return;
    }

    try {
      await onSchedule({
        content,
        date,
        time,
        platforms: selectedPlatforms,
        image,
        scheduledTime: scheduledDateTime.toISOString(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone // Aggiungi questa riga
      });

      // Reset form
      setContent('');
      setDate('');
      setTime('');
      setSelectedPlatforms([]);
      setImage(null);
      if (formRef.current) {
        formRef.current.reset();
      }
    } catch (error) {
      console.error('Error scheduling post:', error);
      alert('Failed to schedule post. Please try again.');
    }
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
      {connectedAccounts.length > 0 ? (
        <select
          value=""
          onChange={(e) => setSelectedPlatforms([...selectedPlatforms, e.target.value])}
          className="w-full p-2 bg-slate-600 text-white rounded"
        >
          <option value="" disabled>Select platforms</option>
          {connectedAccounts.map((account) => (
            <option key={account} value={account}>{account}</option>
          ))}
        </select>
      ) : (
        <p className="text-white">No connected accounts available. Please connect an account first.</p>
      )}
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

export default SchedulePostCard;