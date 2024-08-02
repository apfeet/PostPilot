import React from 'react'
import '../components/Hero.css'
import Logo from '../assets/LOGO.webp'

const Hero = () => {
  return (
    <div className='header'>
      <div className="logo"><img src={Logo} alt="PostPilot" /></div>
      <button>about us</button>
      
    </div>
  )
}

export default Hero