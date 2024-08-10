import React, { useState } from "react"; // Import React and useState hook
import LOGO from "../assets/LOGO.webp"; // Import the logo image
import googleIcon from "../assets/GoogleLogin.png"; // Import the Google icon image
import YoungLady from "../assets/B8_1.png"; // Import the image of the young lady

const LoginPage = () => {
  // Define a functional component
  const [isHovered, setIsHovered] = useState(false); // State to track hover effect on the button
  const [isLogin, setIsLogin] = useState(true); // State to track login/register mode

  const handleClick = () => {
    setIsLogin(!isLogin); // Toggle between login and register
  };

  return (
    <div>
      <div className="relative z-[0] flex h-screen items-center justify-center overflow-hidden bg-costom-grey">
        {/* Main container with full screen height and background color */}

        <div>
          <img
            src={YoungLady}
            alt="Study women"
            className={`absolute bottom-[-10px] left-[0px] z-[100] w-[400px] transition-all duration-300 ease-in-out ${
              isHovered ? "translate-x-[-450px]" : "translate-x-[0px]"
            }`}
          />
        </div>

        <div
          className={`absolute left-0 top-0 z-[100] transform p-5 transition-opacity duration-500 ${
            isHovered ? "opacity-0" : "opacity-100"
          }`}
        >
          <img src={LOGO} alt="PostPilot" className="w-16 rounded" />
          {/* Logo with fade effect based on hover state */}
        </div>

        <div className="z-[100] flex w-[700px] flex-col items-center justify-center overflow-hidden rounded-3xl bg-costom-lightgrey pb-4 pt-8 shadow-[0_0_15px_5px_rgba(86,105,107,0.7)]">
          {/* Form container with shadow and rounded corners */}

          <div>
            <div className="text-5xl font-bold text-white">
              {isLogin ? "First Time Here ?" : "Login"}
              {/* Conditional text for login/register */}
            </div>
          </div>

          <div className="mb-3 mt-7 flex w-4/5 items-center justify-center">
            <label htmlFor="username" className="block text-gray-500"></label>
            <input
              id="username"
              type="text"
              className="w-6/12 rounded-2xl border bg-costom-cyan p-3 text-gray-600 opacity-90"
              placeholder="Email"
            />
            {/* Username input field */}
          </div>

          <div className="mb-6 flex w-4/5 items-center justify-center">
            <label htmlFor="password" className="block"></label>
            <input
              id="password"
              type="password"
              className="w-6/12 rounded-2xl border border-gray-300 bg-costom-cyan p-3 text-gray-700"
              placeholder="Password"
            />
            {/* Password input field */}
          </div>

          <div className="mt-8 flex w-[90%] justify-between">
            <div className="flex">
              <a
                href="#"
                className="relative bottom-0 flex h-12 w-24 items-center justify-center rounded-2xl bg-white font-semibold text-black transition duration-300 hover:bg-black hover:text-white"
              >
                <span>Send</span>
                {/* Button to send the login/register form */}
              </a>

              <div className="relative ml-3 h-12 rounded-2xl bg-stone-500">
                <a href="#" className="group flex items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl">
                    <img
                      src={googleIcon}
                      alt="GoogleIcon"
                      className="mr-0 w-11 rounded-full border-none p-1"
                    />
                    {/* Google icon inside the button */}
                  </div>
                  <div className="overflow-hidden">
                    <div className="flex w-0 items-center justify-center opacity-0 transition-all duration-300 ease-in-out group-hover:w-24 group-hover:opacity-100">
                      <span className="text-white">Google </span>&nbsp;
                      <span className="mr-1 text-white">Auth</span>
                      {/* Text that appears on hover */}
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
                onClick={handleClick} // Toggle between login and register
              >
                <span>{isLogin ? "Log-in" : "Register"}</span>
                {/* Conditional text for the button */}
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
