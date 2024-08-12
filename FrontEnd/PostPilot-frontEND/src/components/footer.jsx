import React from "react";
import LOGO from '../assets/LOGO.webp';

const Footer = () => {
  return (
    <nav className="min-h-20 w-full items-center bg-gradient-to-r from-gray-900 to-slate-600 text-white">
      <div className="flex items-center justify-between p-2 min-h-20">
        <ul>
          <li className="hidden lg:block">PostPilot </li>
          <li className="lg:hidden block"><img src={LOGO} className=" mr-2 w-16 rounded " /></li>
        </ul>
        <ul>
          <li>
            <a href="#" className="size-4"><i className="ri-instagram-line"></i>&nbsp;PostPilot</a>
          </li>
          {/* <li><a href="#"></a></li> */}
        </ul>
        <img src={LOGO} alt="PostPilot-img" className="hidden sm:block mr-2 w-16 rounded" />
      </div>
    </nav>
  );
};

export default Footer;
