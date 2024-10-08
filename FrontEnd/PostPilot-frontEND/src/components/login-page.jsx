import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { gsap } from 'gsap';
import ReCAPTCHA from "react-google-recaptcha";
import LOGO from "../assets/LOGO.webp";
import googleIcon from "../assets/GoogleLogin.png";
import YoungLady from "../assets/B8_1.png";

const LoginPage = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [waveHeight, setWaveHeight] = useState(200);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [captchaValue, setCaptchaValue] = useState(null);
  const navigate = useNavigate();

  const clientId = import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID;
  const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

  const pageRef = useRef(null);
  const formRef = useRef(null);
  const youngLadyRef = useRef(null);
  const logoRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => setIsLoaded(true)
    });

    if (pageRef.current && formRef.current && youngLadyRef.current && logoRef.current) {
      tl.set([pageRef.current, formRef.current, youngLadyRef.current, logoRef.current], { autoAlpha: 0 });

      tl.to(pageRef.current, { autoAlpha: 1, duration: 1 })
        .to(formRef.current, { y: 0, autoAlpha: 1, duration: 1 }, "-=0.5")
        .to(youngLadyRef.current, { x: 0, autoAlpha: 1, duration: 1 }, "-=0.5")
        .to(logoRef.current, { scale: 1, autoAlpha: 1, duration: 1 }, "-=0.5");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!captchaValue) {
      setErrorMessage('Please complete the CAPTCHA');
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/api/register-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, captchaValue }),
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        setErrorMessage('');
        if (formRef.current) {
          gsap.to(formRef.current, { 
            opacity: 0, 
            y: -50, 
            duration: 0.5, 
            onComplete: () => navigate('/dashboard') 
          });
        }
      } else {
        setErrorMessage(data.error || 'An error occurred. Please try again.');
        if (formRef.current) {
          gsap.to(formRef.current, { x: [-10, 10, -10, 10, 0], duration: 0.5 });
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('An error occurred. Please try again.');
      if (formRef.current) {
        gsap.to(formRef.current, { x: [-10, 10, -10, 10, 0], duration: 0.5 });
      }
    }
  };

  const handleGoogleSuccess = async (response) => {
    try {
      const res = await fetch('http://localhost:5000/api/google-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: response.credential, captchaValue }),
        credentials: 'include',
      });

      const data = await res.json();

      if (res.ok) {
        setErrorMessage('');
        if (formRef.current) {
          gsap.to(formRef.current, { 
            opacity: 0, 
            y: -50, 
            duration: 0.5, 
            onComplete: () => navigate('/dashboard') 
          });
        }
      } else {
        setErrorMessage(data.error || 'An error occurred. Please try again.');
        if (formRef.current) {
          gsap.to(formRef.current, { x: [-10, 10, -10, 10, 0], duration: 0.5 });
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('An error occurred. Please try again.');
      if (formRef.current) {
        gsap.to(formRef.current, { x: [-10, 10, -10, 10, 0], duration: 0.5 });
      }
    }
  };

  const handleGoogleFailure = (error) => {
    console.error('Google Sign-In failed:', error);
    setErrorMessage('Google Sign-In failed. Please try again.');
    if (formRef.current) {
      gsap.to(formRef.current, { x: [-10, 10, -10, 10, 0], duration: 0.5 });
    }
  };

  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
  };

  useEffect(() => {
    const animateWave = () => {
      setWaveHeight(prevHeight => isHovered ? Math.max(prevHeight - 10, 0) : Math.min(prevHeight + 10, 200));
    };

    const animationFrameId = requestAnimationFrame(animateWave);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isHovered, waveHeight]);

  if (!isLoaded) {
    return <div className="w-screen h-screen bg-slate-950"></div>;
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div ref={pageRef} className="bg-slate-950">
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
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

          <div>
            <img
              ref={youngLadyRef}
              src={YoungLady}
              alt="Study woman"
              className={`absolute bottom-[-10px] left-[0px] z-[100] w-[200px] sm:w-[300px] md:w-[400px] transition-all duration-300 ease-in-out ${
                isHovered ? "translate-x-[-450px]" : "translate-x-[0px]"
              }`}
            />
          </div>

          <div
            ref={logoRef}
            className={`absolute left-0 top-0 z-[100] transform p-5 transition-opacity duration-500 ${
              isHovered ? "opacity-0" : "opacity-100"
            }`}
          >
            <img src={LOGO} alt="PostPilot" className="w-12 sm:w-16 rounded" />
          </div>

          <div 
            ref={formRef}
            className="z-[100] flex w-full max-w-[90%] sm:max-w-[500px] md:max-w-[700px] flex-col items-center justify-center overflow-hidden rounded-3xl bg-costom-lightgrey p-4 sm:p-8 opacity-90 shadow-[0_0_15px_5px_rgba(86,105,107,0.7)] lg:opacity-100"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-6">
              Welcome
            </div>
            {errorMessage && (
              <div className="w-full mb-4 p-4 bg-red-500 text-white rounded-md shadow-md">
                {errorMessage}
              </div>
            )}
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
              <div className="mb-6 flex w-full items-center justify-center">
                <ReCAPTCHA
                  sitekey={recaptchaSiteKey}
                  onChange={handleCaptchaChange}
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
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleFailure}
                render={(renderProps) => (
                  <button
                    className="flex items-center justify-center rounded-2xl bg-white px-4 py-2 transition duration-300 hover:bg-gray-200 hover:scale-105 hover:shadow-lg"
                    onClick={renderProps.onClick}
                    disabled={renderProps.disabled}
                  >
                    <img
                      src={googleIcon}
                      alt="Google Icon"
                      className="mr-2 w-6 h-6"
                    />
                    <span>Sign in with Google</span>
                  </button>
                )}
              />
            </div>
          </div>
          <Link 
            to="/" 
            className="absolute top-4 right-4 z-[200] bg-white text-black px-3 py-1 rounded-full text-sm hover:bg-black hover:text-white transition-colors duration-300"
          >
            Home
          </Link>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default LoginPage;
