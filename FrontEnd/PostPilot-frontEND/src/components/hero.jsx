import React from "react";
import bgimage1 from "../assets/bg-image1.png";
import bgimage2 from "../assets/bg-image2.png";
import logo from "../assets/LOGO.webp";
import Typewriter from "./logcomponents/typewriter.jsx";
import Calendar from "./logcomponents/calendar.jsx";

const Hero = () => {
  const words = ["Instagram.", "Facebook.", "TikTok.", "Twitter."];
  return (
    <div className="relative z-0 flex min-h-screen flex-col bg-costom-grey">
      {" "}
      {/* Minimum z-index for background color */}
      {/* Header Section */}
      <div className="z-30 flex items-center justify-between p-8">
        {" "}
        {/* Higher z-index for logo and button */}
        <img src={logo} alt="PostPilot" className="w-18 h-16 rounded-md" />
        <button className="rounded-full bg-transparent bg-white px-6 py-2 text-lg font-semibold shadow-md transition duration-300 hover:bg-gray-400 sm:mr-4 lg:mr-8">
          about us
        </button>
      </div>
      {/* Typewriter Text Section */}
      <p className="z-20 mt-28 text-center text-5xl sm:ml-16 sm:mt-20 sm:text-left">
        {" "}
        {/* Higher z-index for text */}
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
      <div className="z-20 text-center sm:text-left">
        {" "}
        {/* Higher z-index for text */}
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
      <div className="z-20 mt-14 flex items-center justify-center">
        {" "}
        {/* Higher z-index for button */}
        <button className="mt-16 rounded-lg bg-white px-8 py-3 text-lg font-medium text-black shadow-lg transition duration-300 hover:bg-black hover:text-white">
          Start
        </button>
      </div>
      {/* Create Schedule and Calendar Section */}
      <div className="z-20 mb-20 mt-20 flex flex-col items-center justify-between space-y-8 px-4 sm:flex-row sm:space-x-8 sm:space-y-0 sm:px-8 lg:px-16">
        <div className="flex w-full flex-col items-center justify-between text-left sm:w-1/2 lg:w-1/3">
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
        <div className="w-full max-w-md sm:w-1/2 lg:w-2/3">
          <Calendar />
        </div>
      </div>
      {/* Background Images */}
      <div className="z-10">
        {" "}
        {/* Lower z-index for background images */}
        <img
          src={bgimage1}
          alt="image 1"
          className="absolute right-40 top-10 z-[-1] hidden w-72 lg:block"
        />
        <img
          src={bgimage2}
          alt="image 2"
          className="absolute right-40 top-[16rem] z-[-1] hidden w-96 lg:block"
        />
      </div>
      {/* Footer Section */}
      <footer className="z-30 mt-auto w-full items-center bg-gradient-to-r from-black to-slate-900 text-white">
        {" "}
        {/* Higher z-index for footer */}
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
  );
};

export default Hero;
