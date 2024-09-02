import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import bgimage1 from "../assets/bg-image1.png";
import bgimage2 from "../assets/bg-image2.png";
import logo from "../assets/LOGO.webp";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Typewriter from "./logcomponents/typewriter";

// Custom hooks
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
};

const useAnimations = () => {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".event-cards",
        start: "top 80%",
        end: "bottom 20%",
        scrub: 1,
      },
    });

    tl.fromTo(".event-card", 
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.2, duration: 1 }
    );

    gsap.fromTo(".info-box",
      { y: 50, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        duration: 1,
        scrollTrigger: {
          trigger: ".info-box",
          start: "top 80%",
          end: "bottom 20%",
        }
      }
    );
  }, []);
};

// Sub-components
const Header = () => (
  <header className="z-10 flex items-center justify-between p-4 md:p-8">
    <img src={logo} alt="PostPilot" className="w-16 h-14 md:w-18 md:h-16 rounded-md" />
    <button className="rounded-full bg-transparent bg-white px-4 py-1 md:px-6 md:py-2 text-sm md:text-lg font-semibold shadow-md transition duration-300 hover:bg-gray-400">
      About Us
    </button>
  </header>
);

const HeroSection = () => {
  const words = ["Instagram", "Facebook", "TikTok", "Twitter"];

  return (
    <section className="mt-16 md:mt-28 text-center md:text-left">
      <h1 className="text-3xl md:text-5xl md:flex">
        <span className="font-semibold text-white">Schedule</span>
        <span className="ml-2 text-white opacity-40">your</span>
        <br className="md:hidden" />
        <span className="ml-2 font-semibold text-teal-400">POST</span>
        <span className="ml-2 text-white opacity-40">on </span>
        <br className="md:hidden" />
        <div style={{ height: '1.2em', overflow: 'hidden' ,marginLeft:"0.25em"}}> 
          <span className="font-semibold text-white opacity-40 ">
            <Typewriter
              words={words}
              typeSpeed={200}
              deleteSpeed={150}
              pause={1500}
            />
          </span>
        </div>
      </h1>
    </section>
  );
};

const FeatureSection = ({ onStartClick }) => (
  <>
    <section className="mt-8 md:mt-10 text-center md:text-left">
      <h2 className="text-3xl md:text-4xl">
        <span className="font-semibold text-white">Easy</span>
        <span className="ml-2 text-white opacity-25">and</span>
        <br className="md:hidden" />
        <span className="font-semibold text-white ml-2">Practical</span>
        <br className="md:hidden" />
        <span className="ml-2 text-white opacity-25">to use</span>
      </h2>
    </section>
    <section className="mt-10 flex justify-center">
      <button 
        className="rounded-lg bg-white px-6 py-2 md:px-8 md:py-3 text-lg font-medium text-black shadow-lg transition duration-300 hover:bg-black hover:text-white"
        onClick={onStartClick}
      >
        Start
      </button>
    </section>
  </>
);

const EventCard = ({ title, time, bgClass }) => (
  <div className={`event-card w-full p-4 bg-gradient-to-r ${bgClass} rounded-lg shadow-lg`}>
    <h3 className="text-xl md:text-2xl font-bold text-white">{title}</h3>
    <p className="text-white mt-2">{time}</p>
  </div>
);

const EventCards = () => (
  <div className="event-cards space-y-4 md:space-y-6 w-full md:w-1/2">
    <EventCard
      title="Event 1: TikTok video"
      time="8:00 AM"
      bgClass="from-blue-500 to-purple-500"
    />
    <EventCard
      title="Event 2: Instagram Post"
      time="10:00 AM"
      bgClass="from-green-400 to-blue-400"
    />
    <EventCard
      title="Event 3: Twitter Post"
      time="12:00 PM"
      bgClass="from-red-400 to-yellow-400"
    />
  </div>
);

const InfoBox = () => (
  <section className="mt-16 md:mt-24">
    <div className="info-box p-6 bg-white bg-opacity-90 rounded-lg shadow-lg">
      <h2 className="text-2xl md:text-3xl font-bold text-black mb-4">
        More About the Project
      </h2>
      <p className="text-lg text-gray-700">
        This project aims to streamline your social media management.
      </p>
      <p className="text-lg text-gray-700 mt-2">
        Create, schedule, and enjoy seamless content posting across platforms.
      </p>
      <p className="text-lg text-gray-700 mt-2">
        The main goal is to serve this in a super easy way.
      </p>
    </div>
  </section>
);

const BackgroundImages = () => (
  <div className="hidden md:block">
    <img
      src={bgimage1}
      alt="image 1"
      className="absolute right-40 top-10 z-[-10] w-72"
    />
    <img
      src={bgimage2}
      alt="image 2"
      className="absolute right-40 top-[16rem] z-[-10] w-96"
    />
  </div>
);

const Footer = () => (
  <footer className="bg-gray-900 text-white p-4 md:p-6 mt-16">
    <div className="flex flex-col md:flex-row justify-between items-center">
      <p className="text-sm mb-4 md:mb-0">&copy; 2024 PostPilot. All rights reserved.</p>
      <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
        <a href="#" className="hover:underline">Privacy Policy</a>
        <a href="#" className="hover:underline">Terms of Service</a>
        <a href="#" className="hover:underline">Contact Us</a>
      </div>
    </div>
  </footer>
);

// Main component
const Hero = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  useAnimations();

  const handleStartClick = () => {
    navigate('/login-register');
  };

  return (
    <div className="relative z-0 min-h-screen bg-gradient-to-br from-gray-800 to-blue-900">
      <Header />
      <main className="px-4 md:px-8">
        <HeroSection />
        <FeatureSection onStartClick={handleStartClick} />
        <section className="mt-16 md:mt-24 flex flex-col md:flex-row items-center justify-between relative">
          <div className="text-center md:text-left mb-10 md:mb-0">
            <p className="text-3xl md:text-4xl font-bold text-white">Create</p>
            <p className="text-3xl md:text-4xl font-bold text-white">Schedule</p>
            <p className="text-2xl md:text-3xl text-white mt-2">Enjoy!</p>
            <p className="text-2xl md:text-3xl text-white mt-4">
              Is that <span className="font-bold">Simple</span>
            </p>
          </div>
          <EventCards />
        </section>
        <InfoBox />
      </main>
      {!isMobile && <BackgroundImages />}
      <Footer />
    </div>
  );
};

export default Hero;