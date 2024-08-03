import React from 'react'
import '../components/Hero.css'
import Logo from '../assets/LOGO.webp'
import image1 from '../assets/image1.png'
import image2 from '../assets/image2.png'



const Hero = () => {
  var TxtType = function (el, toRotate, period) {
    this.toRotate = toRotate;
    this.el = el;
    this.loopNum = 0;
    this.period = parseInt(period, 10) || 2000;
    this.txt = '';
    this.tick();
    this.isDeleting = false;
  };

  TxtType.prototype.tick = function () {
    var i = this.loopNum % this.toRotate.length;
    var fullTxt = this.toRotate[i];

    if (this.isDeleting) {
      this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
      this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    this.el.innerHTML = '<span class="wrap">' + this.txt + '</span>';

    var that = this;
    var delta = 200 - Math.random() * 100;

    if (this.isDeleting) { delta /= 2; }

    if (!this.isDeleting && this.txt === fullTxt) {
      delta = this.period;
      this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
      this.isDeleting = false;
      this.loopNum++;
      delta = 500;
    }

    setTimeout(function () {
      that.tick();
    }, delta);
  };

  window.onload = function () {
    var elements = document.getElementsByClassName('typewrite');
    for (var i = 0; i < elements.length; i++) {
      var toRotate = elements[i].getAttribute('data-type');
      var period = elements[i].getAttribute('data-period');
      if (toRotate) {
        new TxtType(elements[i], JSON.parse(toRotate), period);
      }
    }

    // INJECT CSS
    var css = document.createElement("style");
    css.innerHTML = ".typewrite > .wrap { border-right: 0.12em solid #90BEDE}";
    document.body.appendChild(css);
  };



  return (<div className='hero'>
    <div className='header'>
      <div className="logo"><img src={Logo} alt="PostPilot" /></div>
      <button className='about-us'>about us</button>
    </div>
    <div className='heading-upper' style={{fontSize:35}}> <span style={{ color: 'white' }}>Schedule</span>&nbsp;<span style={{ color: 'white', fontWeight: '300' }}>your</span>&nbsp;<span style={{ color: '#68EDC6' }}>POST</span>&nbsp;<span style={{ color: 'white', fontWeight: '300' }}>on</span>&nbsp;
        <a class="typewrite" data-period="2000" data-type='[ "Instagram.", "Facebook.", "TikTok.", "Twitter." ]' style={{ color: 'white' }} >
        <span class="wrap"></span>
        </a>
    </div>
    
    <h1 style={{fontSize:40}}><span style={{ color: 'white' }}>Easy</span>&nbsp;<span style={{ color: 'white', opacity: 0.25, fontWeight: '300' }}>and</span>&nbsp;<span style={{ color: 'white' }}>Practical</span>&nbsp;<span style={{ color: 'white', opacity: 0.25, fontWeight: '300' }}>to use</span></h1>
    <div className='button-start-div'><button className='button-start'>Start</button></div>
    <div className="images">
      <div className='image1'><img src={image1} alt="image 1" /></div>
      <div className="image2"><img src={image2} alt="image 2" /></div>
    </div>
    <div className="background-containers">
      <div className="container1"></div>
      <div className="container2"></div>
      <div className="container3"></div>
    </div>
  </div>)
}

export default Hero 