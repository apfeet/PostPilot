import React, { useState, useEffect } from "react";
import bgimage1 from "../assets/bg-image1.png";
import bgimage2 from "../assets/bg-image2.png";
import logo from "../assets/LOGO.webp";
import Typewriter from "./logcomponents/typewriter.jsx";
import Calendar from "./logcomponents/calendar.jsx";

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const words = ["Instagram.", "Facebook.", "TikTok.", "Twitter."];

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="no-scrollbar relative min-h-screen overflow-hidden bg-costom-grey">
      {/* Background Blocks */}
      <div className="absolute inset-0 z-10 overflow-hidden">
        <div
          className={`absolute -right-[130px] -top-[270px] h-[600px] w-[600px] rotate-[49deg] rounded-[50px] bg-gradient-to-r from-[#80b3ff] to-[#1e0b4b] opacity-60 blur-[10px] transition-all duration-1000 ease-out ${isLoaded ? "translate-x-0" : "translate-x-full"}`}
        ></div>
        <div
          className={`absolute -left-[130px] top-[360px] h-[600px] w-[600px] rotate-[49deg] rounded-[50px] bg-gradient-to-r from-[#68a5ff] to-[#77ff77] opacity-60 blur-[10px] transition-all duration-1000 ease-out ${isLoaded ? "translate-x-0" : "-translate-x-full"}`}
        ></div>
        <div
          className={`absolute -right-[233px] bottom-[100px] h-[600px] w-[600px] rotate-[49deg] rounded-[50px] bg-gradient-to-r from-[#ffffff] to-[#2e3f6e] opacity-60 blur-[10px] transition-all duration-1000 ease-out ${isLoaded ? "translate-x-0" : "translate-x-full"}`}
        ></div>
      </div>

      {/* Main content */}
      <div className="relative z-20 flex min-h-screen flex-col">
        {/* Header Section */}
        <div className="flex items-center justify-between p-8">
          <img
            src={logo}
            alt="PostPilot"
            className={`w-18 h-16 rounded-md transition-all duration-1000 ease-out ${isLoaded ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}`}
          />
          <button
            className={`rounded-full bg-transparent bg-white px-6 py-2 text-lg font-semibold shadow-md transition-all duration-1000 ease-out hover:bg-gray-400 sm:mr-4 lg:mr-8 ${isLoaded ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}`}
          >
            about us
          </button>
        </div>

        {/* Typewriter Text Section */}
        <p
          className={`mt-28 text-center text-5xl transition-all duration-1000 ease-out sm:ml-16 sm:mt-20 sm:text-left ${isLoaded ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}`}
        >
          <span>
            <span className="font-semibold text-white">Schedule</span>
            <span className="ml-3 text-white opacity-40">your</span>
          </span>
          <br className="block sm:hidden" />
          <span className="pt-5">
            <span className="ml-3 font-semibold text-teal-400">POST</span>
            <span className="ml-3 text-white opacity-40">on</span>
          </span>
          <br className="block sm:hidden" />
          <span className="ml-3 font-semibold text-white opacity-40">
            <Typewriter
              words={words}
              typeSpeed={200}
              deleteSpeed={150}
              pause={1500}
            />
          </span>
        </p>

        {/* Easy Practical Text Section */}
        <div
          className={`text-center transition-all duration-1000 ease-out sm:text-left ${isLoaded ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}`}
        >
          <h1 className="mt-10 text-5xl sm:ml-16">
            <span className="font-semibold text-white">Easy</span>
            <span className="ml-3 text-white opacity-25">and</span>
            <br className="block sm:hidden" />
            <span className="ml-3 font-semibold text-white">Practical</span>
            <br className="block sm:hidden" />
            <span className="ml-3 text-white opacity-25">to use</span>
          </h1>
        </div>

        {/* Start Button Section */}
        <div
          className={`mt-14 flex items-center justify-center transition-all duration-1000 ease-out ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`}
        >
          <button className="mt-16 rounded-lg bg-white px-8 py-3 text-lg font-medium text-black shadow-lg transition duration-300 hover:bg-black hover:text-white">
            Start
          </button>
        </div>

        {/* Create Schedule and Calendar Section */}
        <div className="mb-20 mt-20 flex flex-col items-center justify-between space-y-8 px-4 sm:flex-row sm:space-x-8 sm:space-y-0 sm:px-8 lg:px-16">
          <div
            className={`flex w-full flex-col items-center justify-between text-left transition-all duration-1000 ease-out sm:w-1/2 lg:w-1/3 ${isLoaded ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}`}
          >
            <p className="mb-2 text-3xl font-semibold text-white sm:text-4xl lg:text-5xl">
              Create Schedule
            </p>
            <p className="text-4xl font-bold text-[#68EDC6] opacity-75 sm:text-5xl sm:font-extrabold">
              Enjoy !
            </p>
            <p className="mt-9 flex text-5xl text-white">
              <span className="hidden lg:inline">is that </span>
              <span className="ml-0 block text-5xl font-bold lg:ml-2">
                simple
              </span>
            </p>
          </div>
          {/* Calendar Component */}
          <div
            className={`w-full max-w-md transition-all duration-1000 ease-out sm:w-1/2 lg:w-2/3 ${isLoaded ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}`}
          >
            <Calendar />
          </div>
        </div>

        {/* Background Images */}
        <div className="pointer-events-none absolute inset-0 z-10">
          <img
            src={bgimage1}
            alt="image 1"
            className={`absolute right-40 top-10 hidden w-72 transition-all duration-1000 ease-out lg:block ${isLoaded ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}`}
          />
          <img
            src={bgimage2}
            alt="image 2"
            className={`absolute right-40 top-[16rem] hidden w-96 transition-all duration-1000 ease-out lg:block ${isLoaded ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}`}
          />
        </div>

        {/* Footer Section */}
        <footer
          className={`mt-auto w-full items-center bg-gradient-to-r from-black to-slate-900 text-white transition-all duration-1000 ease-out ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`}
        >
          <div className="flex min-h-20 items-center justify-between p-2">
            <ul>
              <li className="hidden lg:block">PostPilot </li>
              <li className="block lg:hidden">
                <img src={logo} className="mr-2 w-16 rounded" />
              </li>
            </ul>
            <ul>
              <li>
                <a href="#" className="size-4">
                  <i className="ri-instagram-line"></i>&nbsp;PostPilot
                </a>
              </li>
            </ul>
            <img
              src={logo}
              alt="PostPilot-img"
              className="mr-2 hidden w-16 rounded sm:block"
            />
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Hero;
