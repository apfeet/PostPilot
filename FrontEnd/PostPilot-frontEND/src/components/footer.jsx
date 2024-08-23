import React from "react";
import LOGO from "../assets/LOGO.webp";

const Footer = () => {
  return (
    <nav className="min-h-20 w-full items-center bg-gradient-to-r from-black to-slate-900 text-white">
      <div className="flex min-h-20 items-center justify-between p-2">
        <ul>
          <li className="hidden lg:block">PostPilot </li>
          <li className="block lg:hidden">
            <img src={LOGO} className="mr-2 w-16 rounded" />
          </li>
        </ul>
        <ul>
          <li>
            <a href="#" className="size-4">
              <i className="ri-instagram-line"></i>&nbsp;PostPilot
            </a>
          </li>
          {/* <li><a href="#"></a></li> */}
        </ul>
        <img
          src={LOGO}
          alt="PostPilot-img"
          className="mr-2 hidden w-16 rounded sm:block"
        />
      </div>
    </nav>
  );
};

export default Footer;
