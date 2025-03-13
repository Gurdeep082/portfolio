import React, { useState, useEffect } from "react";
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
import { faDatabase } from "@fortawesome/free-solid-svg-icons";
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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

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
      <video className="video-bg" autoPlay loop muted playsInline>
        <source src="/7670836-uhd_3840_2160_30fps.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* 🔝 Navbar */}
      <nav className="navbar">
        <h1>Gurdeep</h1>
        <div className="nav-right">
          <ul className="nav-list">
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="#about">Skills</a>
            </li>
            <li>
              <a href="#projects">Projects</a>
            </li>
            <li>
              <a href="#contact">Contact</a>
            </li>
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
        <button className="role-btn">Fullstack Developer</button>
        <h2>Hello, I'm</h2>
        <h1>GURDEEP SINGH</h1>
        <p>
          As a dedicated and passionate Fullstack Developer with a year of
          professional experience, I specialize in creating dynamic, responsive,
          and user-friendly web applications.
        </p>
        <div className="social-icons">
          <a href="https://github.com/Gurdeep082">
            <FaGithub />
          </a>
          <a href="https://www.youtube.com/@TechTroubleshooters_1">
            <FaYoutube />
          </a>
          <a href="https://instagram.com/_gurdeep03_">
            <FaInstagram />
          </a>
        </div>
      </div>

      <section id="about" className="about">
        <h2 style={{ marginTop: "100px" }}>Skills</h2>
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

        <div className="skills-container">
            <div  className="skill1">
                <img style={{width:"200px",height:"200px"}} src="Problemsolving.jpg" alt="Problem Solving"/>
                <h3>Problem Solving</h3>
            </div>
            <div  className="skill1">
                <img style={{width:"200px",height:"200px"}} src="Teamwork.jpeg" alt="Teamwork"/>
                <h3>Teamwork</h3>
            </div>
            <div className="skill1">
                <img style={{width:"200px",height:"200px"}} src="communication.jpg" alt="Communication Skill"/>
                <h3>Communication</h3>
            </div>
            <div  className="skill1">
                <img style={{width:"200px",height:"200px"}} src="SocialSkills.jpg" alt="Social Skill"/>
                <h3>Social Skill</h3>
            </div>
        </div>    
      </section>

      <section id="projects" className="projects">
        <h2>Projects</h2>
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
            <h3>ServiceHub <a href="https://servicehub-08.netlify.app/">View Project</a></h3>
            
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
            <h3>ILmKosh <a href="https://ilm-kosh.netlify.app/">View Project</a></h3>
            
          </div>
        </div>


      </section>

      {/* 📩 Contact Section */}
      <section id="contact" className="contact">
        <h2>Contact</h2>
        <form>
          <input type="text" placeholder="Name" />
          <input type="email" placeholder="Email" />
          <textarea placeholder="Message"></textarea>
          <button type="submit">Send</button>
        </form>
      </section>

      {/* 📌 Footer */}
      <footer>
        <p>© 2025 Gurdeep Singh</p>
      </footer>
    </div>
  );
};

export default Home;
