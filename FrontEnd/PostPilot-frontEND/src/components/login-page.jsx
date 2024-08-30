import React, { useState, useEffect } from "react";
import LOGO from "../assets/LOGO.webp";
import googleIcon from "../assets/GoogleLogin.png";
import YoungLady from "../assets/B8_1.png";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const LoginPage = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [waveHeight, setWaveHeight] = useState(200);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
            alert(data.message);  // Show success message
            navigate('/dashboard');  // Redirect to the dashboard
        } else {
            alert(data.error);  // Show error message if login fails
        }
    } catch (error) {
        console.error('Error:', error);
    }
};


  



  const handleClick = () => {
    setIsLogin(!isLogin);
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
        {/* First Background */}
        <div className="absolute top-0 left-0 h-1/2 w-full bg-slate-800"></div>

        {/* Wave Effect */}
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

        {/* Second Background */}
        <div className="absolute top-[calc(50%+50px)] left-0 h-[calc(50%-50px)] w-full bg-slate-950"></div>

        <div>
          <img
            src={YoungLady}
            alt="Study woman"
            className={`absolute bottom-[-10px] left-[0px] z-[100] w-[200px] sm:w-[300px] md:w-[400px] transition-all duration-300 ease-in-out ${
              isHovered ? "translate-x-[-450px]" : "translate-x-[0px]"
            }`}
          />
        </div>

        <div
          className={`absolute left-0 top-0 z-[100] transform p-5 transition-opacity duration-500 ${
            isHovered ? "opacity-0" : "opacity-100"
          }`}
        >
          <img src={LOGO} alt="PostPilot" className="w-12 sm:w-16 rounded" />
        </div>

        <div className="z-[100] flex w-full max-w-[90%] sm:max-w-[500px] md:max-w-[700px] flex-col items-center justify-center overflow-hidden rounded-3xl bg-costom-lightgrey p-4 sm:p-8 opacity-90 shadow-[0_0_15px_5px_rgba(86,105,107,0.7)] lg:opacity-100">
          <div className="text-2xl sm:text-3xl md:text-5xl font-bold text-white">
            {isLogin ? "First Time Here ?" : "Login"}
          </div>
          <form onSubmit={handleSubmit}>
          <div className="mb-3 mt-7 flex w-full max-w-[80%] items-center justify-center">
            <label htmlFor="email" className="block text-gray-500"></label>
            <input
              id="email"
              type="email"
              value={email}
              className="w-full sm:w-6/12 rounded-2xl border bg-costom-cyan p-3 text-gray-600 opacity-90"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              required
            /> 
          </div>

          <div className="mb-6 flex w-full max-w-[80%] items-center justify-center">
            <label htmlFor="password" className="block"></label>
            <input
              id="password"
              type="password"
              value={password}
              className="w-full sm:w-6/12 rounded-2xl border border-gray-300 bg-costom-cyan p-3 text-gray-700"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
            <div>
              <button type="submit">submit</button>
            </div>
          </form>

          <div className="mt-8 flex w-full max-w-[90%] justify-between flex-col sm:flex-row items-center">
            <div className="flex mb-4 sm:mb-0">
              <a 
                type="submit"
                
                
                className="relative bottom-0 flex h-12 w-24 items-center justify-center rounded-2xl bg-white font-semibold text-black transition duration-300 hover:bg-black hover:text-white"
              >
                <span>Send</span>
              </a>

              <div className="relative ml-3 h-12 rounded-2xl bg-stone-500">
                <a href="#" className="group flex items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl">
                    <img
                      src={googleIcon}
                      alt="GoogleIcon"
                      className="mr-0 w-11 rounded-full border-none p-1"
                    />
                  </div>
                  <div className="overflow-hidden">
                    <div className="flex w-0 items-center justify-center opacity-0 transition-all duration-300 ease-in-out group-hover:w-24 group-hover:opacity-100">
                      <span className="text-white">Google </span>&nbsp;
                      <span className="mr-1 text-white">Auth</span>
                    </div>
                  </div>
                </a>
              </div>
            </div>

            <div>
              <a
                href="#"
                className="mt-3 flex w-24 items-center justify-center rounded-2xl bg-white px-4 pb-1 pt-2 font-semibold text-black transition duration-300 hover:bg-black hover:text-white"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={handleClick}
              >
                <span>{isLogin ? "Log-in" : "Register"}</span>
              </a>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-700"></div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
