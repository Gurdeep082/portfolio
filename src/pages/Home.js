import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaSun,
  FaMoon,
  FaDesktop,
  FaGithub,
  FaYoutube,
  FaInstagram,
} from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCss3,
  faHtml5,
  faJs,
  faNodeJs,
  faReact,
} from "@fortawesome/free-brands-svg-icons";
import { faDatabase,faSquareArrowUpRight,faStarHalfStroke } from "@fortawesome/free-solid-svg-icons";
import "./Home.css"; // External CSS for styling


const projectImages = [
  "image1.png",
  "image2.png",
  "image3.png",
  "image4.png",
  "image5.png",
  "image6.png",
];
const projectImages2 = [
  "project1.png",
  "project2.png",
  "project3.png",
  "project4.png",
  "project5.png",
  "project6.png",
];

const Home = () => {
  const [theme, setTheme] = useState("light");
  const [videoSrc, setVideoSrc] = useState("/white.mp4");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name || !email || !message) {
      setResponseMessage('Please fill in all fields.');
      return;
    }

    setIsSending(true);
    setResponseMessage('');

    try {
      const response = await axios.post('http://localhost:5000/send-message', {
        name,
        email,
        message,
      });

      if (response.status === 200) {
        setResponseMessage('Message sent successfully!');
      }
    } catch (error) {
      setResponseMessage('Failed to send the message.');
      console.error('Error sending message:', error);
    }

    setIsSending(false);
  };

  useEffect(() => {
    if (theme === "system") {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setTheme(prefersDark ? "dark" : "light");
    }
  }, [theme]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % projectImages.length);
    }, 2000); // Auto-slide every 3 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Change background video based on theme
    setVideoSrc(theme === "dark" ? "/7670836-uhd_3840_2160_30fps.mp4" : "white.mp4");
  }, [theme]);

  const themeIcons = {
    light: <FaSun />,
    dark: <FaMoon />,
    system: <FaDesktop />,
  };

  const handleThemeChange = (selectedTheme) => {
    setTheme(selectedTheme);
    setDropdownOpen(false);
  };

  return (
    <div className={`home-container ${theme}`}>
      {/* 🎥 Video Background */}
      <video className="video-bg" autoPlay loop muted playsInline key={videoSrc}>
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

    {/* 🔝 Navbar */}
        <nav className="navbar">
          <h1>Gurdeep</h1>
          <div className="nav-right">
            <ul className="nav-list">
            <li><a href="/" onClick={(e) => {e.preventDefault(); document.querySelector('.home-container').scrollIntoView({ behavior: 'smooth' });}}>Home</a></li>
            <li><a href="#about" onClick={(e) => {e.preventDefault(); document.querySelector('#about').scrollIntoView({ behavior: 'smooth' });}}>Skills</a></li>
            <li><a href="#projects" onClick={(e) => {e.preventDefault(); document.querySelector('#projects').scrollIntoView({ behavior: 'smooth' });}}>Projects</a></li>
            <li><a href="#contact" onClick={(e) => {e.preventDefault(); document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' });}}>Contact</a></li>
            </ul>

            {/* 🌙 Theme Selector */}
          <div className="theme-selector">
            <button onClick={() => setDropdownOpen(!dropdownOpen)}>
              {themeIcons[theme]}
            </button>

            {dropdownOpen && (
              <div className="dropdown">
                <div onClick={() => handleThemeChange("light")}>
                  <FaSun /> Light
                </div>
                <div onClick={() => handleThemeChange("dark")}>
                  <FaMoon /> Dark
                </div>
                <div onClick={() => handleThemeChange("system")}>
                  <FaDesktop /> System
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      

      {/* 👋 Introduction Section */}
      <div className="intro">
        <button className="role-btn"> <FontAwesomeIcon icon={faStarHalfStroke}/> Fullstack Developer</button>
        <h2>Hello, I'm</h2>
        <h1 className="animated-text">GURDEEP SINGH</h1>
        <p>
          As a dedicated and passionate Fullstack Developer with a year of
          professional experience, I specialize in creating dynamic, responsive,
          and user-friendly web applications.
        </p>
        <div className="social-icons">
          <a className="link" href="https://github.com/Gurdeep082">
            <FaGithub />
          </a>
          <a className="link" href="https://www.youtube.com/@TechTroubleshooters_1">
            <FaYoutube />
          </a>
          <a className="link" href="https://instagram.com/_gurdeep03_">
            <FaInstagram />
          </a>
        </div>
      </div>

      <section id="about" className="about">
        <h2 style={{ marginTop: "250px" ,textAlign:"center",fontSize:"30px" }}>Skills</h2>
        <div className="skills-container">
          <div className="skill">
            <h3>
              <FontAwesomeIcon icon={faHtml5} /> HTML
            </h3>
          </div>
          <div className="skill">
            <h3>
              <FontAwesomeIcon icon={faCss3} /> CSS
            </h3>
          </div>
          <div className="skill">
            <h3>
              <FontAwesomeIcon icon={faJs} /> JavaScript
            </h3>
          </div>
          <div className="skill">
            <h3>
              <FontAwesomeIcon icon={faReact} /> React
            </h3>
          </div>
          <div className="skill">
            <h3>
              <FontAwesomeIcon icon={faNodeJs} /> Node.js
            </h3>
          </div>
          <div className="skill">
            <h3>
              <FontAwesomeIcon icon={faDatabase} /> MongoDB
            </h3>
          </div>
        </div>

        <div className="skills-container1">
            <div  className="skill1">
                <img style={{width:"250px",height:"200px", marginTop:"20px"}} src="Problemsolving.jpg" alt="Problem Solving"/>
                <h3>Problem Solving</h3>
                <p style={{textAlign:"justify",padding:"20px "} }>The skill to identify, analyze, and develop solutions to overcome challenges is key to personal and professional growth.</p>
            </div>
            <div  className="skill1">
                <img style={{width:"250px",height:"200px",marginTop:"20px"}} src="Teamwork.jpeg" alt="Teamwork"/>
                <h3>Teamwork</h3>
                <p style={{textAlign:"justify",padding:"20px "} }>Teamwork skills enable individuals to collaborate effectively with others in various group settings, fostering better cooperation, communication, and collective success.</p>
            </div>
            <div className="skill1">
                <img style={{width:"250px",height:"200px",marginTop:"20px"}} src="communication.jpg" alt="Communication Skill"/>
                <h3>Communication</h3>
                <p style={{textAlign:"justify",padding:"20px "} }>The ability to effectively communicate with others, both verbally and non-verbally, is essential in all aspects of life.</p>
            </div>
            <div  className="skill1">
                <img style={{width:"250px",height:"200px",marginTop:"20px"}} src="SocialSkills.jpg" alt="Social Skill"/>
                <h3>Social Skill</h3>
                <p style={{textAlign:"justify",padding:"20px "} }>Social skills enable individuals to interact effectively with others in a variety of social situations, fostering better relationships and collaboration</p>
            </div>
        </div>    
      </section>

      <section id="projects" className="projects">
        <h2 style={{textAlign:"center",fontSize:"30px"}}>Projects</h2>
        <div className="project-container">
          <div className="slideshow">
            <div
              className="slides"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {projectImages.map((src, index) => (
                <div key={index} className="slide">
                  <img src={src} alt={`Project ${index + 1}`} />
                </div>
              ))}
            </div>
            <h3>ServiceHub : <a style={{textDecoration:"none"}} href="https://servicehub-08.netlify.app/">View Project <FontAwesomeIcon icon={faSquareArrowUpRight} /></a></h3>
            <p style={{textAlign:"justify",padding:"20px "} }>"ServiceHub connects you with trusted professionals for home services like cooking, plumbing, pest control, and more. Built with React.js for a seamless experience."</p>
            
          </div>
          <div className="slideshow">
            
            <div 
              className="slides"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {projectImages2.map((src, index) => (
                <div key={index} className="slide">
                  <img src={src} alt={`Project ${index + 1}`} />
                </div>
              ))}
            </div>
            <h3>ILmKosh : <a style={{textDecoration:"none"}} href="https://ilm-kosh.netlify.app/">View Project <FontAwesomeIcon icon={faSquareArrowUpRight} /></a></h3>
            <p style={{textAlign:"justify",padding:"20px "} }>"ILmkosh is an innovative book reading platform built with MERN stack It allows users to read and upload books effortlessly, fostering a community of knowledge sharing and discovery."</p>
            
          </div>
        </div>


      </section>

      {/* 📩 Contact Section */}
      <div id="contact" className="contact">
        <h2>Contact</h2>
        <div className="contact-form">
          <form onSubmit={handleSubmit}>
            <h3>Get in touch</h3>
            <p>I enjoy working with dedicated creatives from businesses that make the world beautiful.
            We can do so much together. Let's talk.</p>
            <input 
              type="text" 
              placeholder="Your Name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
            />
            <input 
              type="email" 
              placeholder="Your Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
            <textarea 
              placeholder="Your Message" 
              value={message} 
              onChange={(e) => setMessage(e.target.value)} 
              required
            ></textarea>
            <button type="submit">Send Message</button>
          </form>
        </div>
      </div>

      {/* 📌 Footer */}
      <footer>
        <p>© 2025 Gurdeep Singh</p>
        <div style={{ display: "flex",margin:"20px 40px auto auto",marginRight:"30px" ,gap:"10px"}}>
        <FaGithub />
        <FaYoutube />
        <FaInstagram />
        </div>
      </footer>
    </div>
  );
};

export default Home;
