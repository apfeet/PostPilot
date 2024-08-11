import React from "react";
import bgimage1 from "../assets/bg-image1.png";
import bgimage2 from "../assets/bg-image2.png";
import logo from "../assets/LOGO.webp";
import Typewriter from "../logcomponents/typewriter";

const Hero = () => {
  const words = ["Instagram.", "Facebook.", "TikTok.", "Twitter."];

  return (
    <div className="relative z-0 min-h-screen bg-costom-grey">
      <div className="z-10 flex items-center justify-between p-8">
        <img src={logo} alt="PostPilot" className="w-18 h-16 rounded-md" />

        <button className="rounded-full bg-transparent bg-white px-6 py-2 text-lg font-semibold shadow-md transition duration-300 hover:bg-gray-400 sm:mr-4 lg:mr-8">
          about us
        </button>
      </div>
      <p className="mt-28 text-center text-5xl sm:ml-16 sm:mt-20 sm:text-left">
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

      <div className="text-center sm:text-left">
        <h1 className="mt-10 text-5xl sm:ml-16">
          <span className="font-semibold text-white">Easy</span>
          <span className="ml-3 text-white opacity-25">and</span>
          <br className="block sm:hidden" />
          <span className="ml-3 font-semibold text-white">Practical</span>
          <br className="block sm:hidden" />
          <span className="ml-3 text-white opacity-25">to use</span>
        </h1>
      </div>

      <div className="mt-14 flex items-center justify-center">
        <button className="rounded-lg bg-white px-8 py-3 text-lg font-medium text-black shadow-lg transition duration-300 hover:bg-black hover:text-white">
          Start
        </button>
      </div>

      <div>
        <img
          src={bgimage1}
          alt="image 1"
          className="absolute right-40 top-10 z-[-10] hidden w-72 lg:block"
        />
        <img
          src={bgimage2}
          alt="image 2"
          className="absolute right-40 top-[16rem] z-[-10] hidden w-96 lg:block"
        />
      </div>
    </div>
  );
};

export default Hero;
