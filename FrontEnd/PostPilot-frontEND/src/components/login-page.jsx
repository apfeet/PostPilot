import React from "react";
import LOGO from "../assets/LOGO.webp";
import googleIcon from "../assets/GoogleLogin.png";
import YoungLady from "../assets/B8_1.png";

const LoginPage = () => {
  return (
    <div>
      <div className="relative z-[1] flex h-screen items-center justify-center overflow-hidden bg-costom-grey">
        <div className="absolute bottom-[-89px] left-[-200px] z-[2] h-[400px] w-[500px] rotate-45 rounded-3xl bg-blue-500 blur-xl"></div>
        {/* <div className="absolute bottom-[100px] left-[-200px] z-[2] h-[400px] w-[500px] rotate-45 rounded-3xl bg-blue-500 blur-xl"></div> */}
        <div>
          <img
            src={YoungLady}
            alt="Study women"
            className="absolute bottom-[-10px] left-[0px] z-[3] w-[400px]"
          />
          {/* <img
            src="{YoungLady}"
            alt="women"
            className="absolute bottom-[-10px] left-[0px] z-[3] w-[400px]"
          /> */}
        </div>
        <div className="absolute left-0 top-0 z-[3] p-5">
          <img src={LOGO} alt="PostPilot" className="w-16 rounded" />
        </div>
        <div className="z-[3] flex w-[700px] flex-col items-center justify-center overflow-hidden rounded-3xl bg-costom-lightgrey pb-4 pt-8">
          <div>
            <span className="text-5xl font-bold text-white">First Time</span>
            &nbsp;
            <span className="text-5xl font-medium text-white opacity-75">
              Here ?
            </span>
          </div>
          <div className="mb-3 mt-7 flex w-4/5 items-center justify-center">
            <label htmlFor="username" className="block text-gray-500"></label>
            <input
              id="username"
              type="text"
              className="w-6/12 rounded-2xl border bg-costom-cyan p-3 text-gray-600 opacity-90"
              placeholder="Email"
            />
          </div>
          <div className="mb-6 flex w-4/5 items-center justify-center">
            <label htmlFor="password" className="block"></label>
            <input
              id="password"
              type="password"
              className="w-6/12 rounded-2xl border border-gray-300 bg-costom-cyan p-3 text-gray-700"
              placeholder="Password"
            />
          </div>
          <div className="mt-8 flex w-[90%] justify-between">
            <div className="flex">
              {/* <a
                href="#"
                className="group relative inline-flex items-center justify-start overflow-hidden rounded-full px-5 py-3 font-bold"
              >
                <span className="absolute left-0 top-0 h-32 w-32 -translate-y-2 translate-x-12 rotate-45 bg-white opacity-[3%]"></span>
                <span className="absolute left-0 top-0 -mt-1 h-48 w-48 -translate-x-56 -translate-y-24 rotate-45 bg-white opacity-100 transition-all duration-500 ease-in-out group-hover:-translate-x-8"></span>
                <span className="relative w-20 text-center text-white transition-colors duration-200 ease-in-out group-hover:text-gray-900">
                  Send
                </span>
                <span className="absolute inset-0 rounded-full border-2 border-white"></span>
              </a> */}
              <a
                href="#"
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
              {/* <a
                href="#"
                className="group relative inline-flex items-center justify-start overflow-hidden rounded-full px-5 py-3 font-bold"
              >
                <span className="absolute left-0 top-0 h-32 w-32 -translate-y-2 translate-x-12 rotate-45 bg-white opacity-[3%]"></span>
                <span className="absolute left-0 top-0 -mt-1 h-48 w-48 -translate-x-56 -translate-y-24 rotate-45 bg-white opacity-100 transition-all duration-500 ease-in-out group-hover:-translate-x-8"></span>
                <span className="relative w-20 text-center text-white transition-colors duration-200 ease-in-out group-hover:text-gray-900">
                  Log-in
                </span>
                <span className="absolute inset-0 rounded-full border-2 border-white"></span>
              </a> */}
              <a
                href="#"
                className="mt-3 flex w-24 items-center justify-center rounded-2xl bg-white px-4 pb-1 pt-2 font-semibold text-black transition duration-300 hover:bg-black hover:text-white"
              >
                <span>Log-in</span>
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
