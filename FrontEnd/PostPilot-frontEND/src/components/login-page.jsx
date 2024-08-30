import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import LOGO from "../assets/LOGO.webp";
import googleIcon from "../assets/GoogleLogin.png";
import YoungLady from "../assets/B8_1.png";

const LoginPage = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [waveHeight, setWaveHeight] = useState(200);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/register-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        navigate('/dashboard');
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  useEffect(() => {
    const animateWave = () => {
      setWaveHeight((prevHeight) => {
        if (isHovered) {
          return Math.max(prevHeight - 10, 0);
        } else {
          return Math.min(prevHeight + 10, 200);
        }
      });
    };
  
    const animationFrame = requestAnimationFrame(function animate() {
      animateWave();
      if ((isHovered && waveHeight > 0) || (!isHovered && waveHeight < 200)) {
        requestAnimationFrame(animate);
      }
    });
  
    return () => cancelAnimationFrame(animationFrame);
  }, [isHovered, waveHeight]);

  return (
    <div className="bg-slate-950">
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 left-0 h-1/2 w-full bg-slate-800"></div>
        <div className="absolute top-[50%] left-0 w-full h-[150px] overflow-hidden">
          <div className="relative w-full h-full">
            <div 
              className="absolute top-0 left-1/2 w-full bg-slate-950 rounded-[50%] transform -translate-x-1/2 -translate-y-[75%] transition-all duration-300 ease-in-out"
              style={{ height: `${waveHeight}px` }}
            ></div>
            <div 
              className="absolute top-0 left-1/2 w-full bg-slate-800 rounded-[50%] transform -translate-x-1/2 -translate-y-[65%] transition-all duration-300 ease-in-out"
              style={{ height: `${waveHeight}px` }}
            ></div>
          </div>
        </div>
        <div className="absolute top-[calc(50%+50px)] left-0 h-[calc(50%-50px)] w-full bg-slate-950"></div>

        {/* Young Lady Image */}
        <div>
          <img
            src={YoungLady}
            alt="Study woman"
            className={`absolute bottom-[-10px] left-[0px] z-[100] w-[200px] sm:w-[300px] md:w-[400px] transition-all duration-300 ease-in-out ${
              isHovered ? "translate-x-[-450px]" : "translate-x-[0px]"
            }`}
          />
        </div>

        {/* Logo */}
        <div
          className={`absolute left-0 top-0 z-[100] transform p-5 transition-opacity duration-500 ${
            isHovered ? "opacity-0" : "opacity-100"
          }`}
        >
          <img src={LOGO} alt="PostPilot" className="w-12 sm:w-16 rounded" />
        </div>

        {/* Login/Register Form */}
        <div className="z-[100] flex w-full max-w-[90%] sm:max-w-[500px] md:max-w-[700px] flex-col items-center justify-center overflow-hidden rounded-3xl bg-costom-lightgrey p-4 sm:p-8 opacity-90 shadow-[0_0_15px_5px_rgba(86,105,107,0.7)] lg:opacity-100">
          <div className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-6">
            Welcome
          </div>
          <form onSubmit={handleSubmit} className="w-full">
            <div className="mb-4 flex w-full items-center justify-center">
              <input
                type="email"
                value={email}
                className="w-full sm:w-8/12 rounded-2xl border bg-costom-cyan p-3 text-gray-600 opacity-90"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-6 flex w-full items-center justify-center">
              <input
                type="password"
                value={password}
                className="w-full sm:w-8/12 rounded-2xl border border-gray-300 bg-costom-cyan p-3 text-gray-700"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex w-full justify-center">
              <button
                type="submit"
                className="h-12 w-32 rounded-2xl bg-white font-semibold text-black transition duration-300 hover:bg-black hover:text-white"
              >
                Login / Register
              </button>
            </div>
          </form>
          <div className="mt-6 flex items-center justify-center">
            <button className="flex items-center justify-center rounded-2xl bg-white px-4 py-2 transition duration-300 hover:bg-gray-200">
              <img
                src={googleIcon}
                alt="Google Icon"
                className="mr-2 w-6 h-6"
              />
              <span>Sign in with Google</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;