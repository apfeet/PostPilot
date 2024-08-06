import React from 'react';
import '../components/Footer.css';
import LOGO_full from '../assets/LOGO_full.webp';

const Footer = () => {
  return (
    <footer>

        <div className="postpilot">PostPilot</div>
        <div className="links-connect">
          <div className="instagram-connect-us"></div>
        </div>
        <div className="postpilot-logo">
          <img src={LOGO_full} alt="PostPilot Logo" />
        </div>

    </footer>);
};

export default Footer;

