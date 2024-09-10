import React, { useRef, useEffect } from 'react';
import { Instagram, Linkedin, Facebook } from 'lucide-react';
import gsap from 'gsap';

const socialPlatforms = [
  { name: 'Instagram', icon: Instagram, color: '#E1306C' },
  { name: 'LinkedIn', icon: Linkedin, color: '#0077B5' },
  { name: 'Facebook', icon: Facebook, color: '#1877F2' },
];

const SocialPlatforms = ({ connectedAccounts, onConnect }) => {
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
        {socialPlatforms.map((platform, index) => (
          <div 
            key={platform.name} 
            ref={el => platformsRef.current[index] = el}
            className="bg-slate-800 rounded-lg p-4 flex flex-col items-center transform hover:scale-105 transition-transform duration-200"
            style={{ opacity: 0, transform: 'translateY(20px)' }}
          >
            <platform.icon size={48} color={platform.color} />
            <h3 className="text-lg font-semibold text-white mt-2">{platform.name}</h3>
            {connectedAccounts.includes(platform.name.toLowerCase()) ? (
              <span className="mt-2 px-4 py-2 bg-green-500 text-white rounded">Connected</span>
            ) : (
              <button 
                onClick={() => onConnect(platform.name)} 
                className="mt-2 px-4 py-2 bg-white text-black rounded hover:bg-gray-200 transition-colors duration-200"
              >
                Connect
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SocialPlatforms;