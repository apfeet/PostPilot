import React from "react";
import LOGO from "../assets/LOGO.webp";
import googleIcon from "../assets/GoogleLogin.png";

const LoginPage = () => {
  return (
    <div className="relative flex h-screen items-center justify-center bg-costom-grey">
      <div className="absolute left-0 top-0 p-5">
        <img src={LOGO} alt="PostPilot" className="w-16 rounded" />
      </div>
      <div className="bg-costom-lightgrey flex w-[700px] flex-col items-center justify-center rounded-3xl pb-4 pt-8">
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
            <a
              href="#"
              class="group relative inline-flex items-center justify-start overflow-hidden rounded-full px-5 py-3 font-bold"
            >
              <span class="absolute left-0 top-0 h-32 w-32 -translate-y-2 translate-x-12 rotate-45 bg-white opacity-[3%]"></span>
              <span class="absolute left-0 top-0 -mt-1 h-48 w-48 -translate-x-56 -translate-y-24 rotate-45 bg-white opacity-100 transition-all duration-500 ease-in-out group-hover:-translate-x-8"></span>
              <span class="relative w-20 text-center text-white transition-colors duration-200 ease-in-out group-hover:text-gray-900">
                Send
              </span>
              <span class="absolute inset-0 rounded-full border-2 border-white"></span>
            </a>

            <div className="relative ml-3 h-12 rounded-2xl bg-stone-500">
              <a href="#" className="group flex items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl">
                  <img
                    src={googleIcon}
                    alt="GoogleIcon"
                    className="w-11 rounded-full border-none p-1"
                  />
                </div>
                <div className="duration-600 ml-0 hidden opacity-0 transition-all ease-in-out group-hover:ml-2 group-hover:block group-hover:opacity-100">
                  Google Auth
                </div>
              </a>
            </div>
          </div>
          {/* <div className="ml-14 flex h-12 items-center justify-center">
                <span className="origin-left scale-x-0 text-white duration-300">
                  Google Auth
                </span>
              </div> */}
          <div>
            <a
              href="#"
              class="group relative inline-flex items-center justify-start overflow-hidden rounded-full px-5 py-3 font-bold"
            >
              <span class="absolute left-0 top-0 h-32 w-32 -translate-y-2 translate-x-12 rotate-45 bg-white opacity-[3%]"></span>
              <span class="absolute left-0 top-0 -mt-1 h-48 w-48 -translate-x-56 -translate-y-24 rotate-45 bg-white opacity-100 transition-all duration-500 ease-in-out group-hover:-translate-x-8"></span>
              <span class="relative w-20 text-center text-white transition-colors duration-200 ease-in-out group-hover:text-gray-900">
                Log-in
              </span>
              <span class="absolute inset-0 rounded-full border-2 border-white"></span>
            </a>
          </div>
          {/* <div>
            <button className="flex w-40 flex-row justify-center rounded-[20px] bg-blue-500 p-2 text-white hover:bg-blue-700">
              
            </button>
          </div> */}
        </div>
        <div className="mt-4 text-sm text-gray-700"></div>
      </div>
    </div>
  );
};

export default LoginPage;
