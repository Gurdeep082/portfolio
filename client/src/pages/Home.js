import React, { useState, useEffect, useRef } from "react";
import SpaceBackground from "../components/spacebackground";
import LightBackground from "../components/lightbackground";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";
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
  faLinkedin,
  faNodeJs,
  faReact,
} from "@fortawesome/free-brands-svg-icons";
import {
  faDatabase,
  faEnvelope,
  faLocation,
  faPhone,
  faSquareArrowUpRight,
  faStarHalfStroke,
  faUser,
  faVolumeUp,
  faVolumeOff,
} from "@fortawesome/free-solid-svg-icons";
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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const audioRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const [canPlay, setCanPlay] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !message) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const response = await axios.post(
        "https://portfolio-quwt.onrender.com/send-message",
        {
          name,
          email,
          message,
        }
      );

      if (response.status === 200) {
        alert("Message sent successfully!"); // Show popup alert
      }
    } catch (error) {
      alert("Failed to send the message.");
    }
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
    const handleClickOutside = (event) => {
      const nav = document.querySelector(".navbar");
      if (menuOpen && nav && !nav.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
  }, []);

  const handleThemeChange = (selectedTheme) => {
    setTheme(selectedTheme);
    localStorage.setItem("theme", selectedTheme);
    setDropdownOpen(false);
  };

  const toggleMute = () => {
    if (isMuted && canPlay) {
      audioRef.current.play().catch(e => console.error('Audio play failed:', e));
    }
    setIsMuted(!isMuted);
  };

  const handleCanPlay = () => {
    setCanPlay(true);
  };

  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration in milliseconds
      easing: "ease-in-out",
      once: false, // Allows animation to replay when scrolling back
      mirror: true, // Animates elements when scrolling back up
    });
  }, []);

  return (
    <div className={`home-container ${theme}`}>
      <button onClick={toggleMute} style={{ position: 'fixed', top: 10, right: 10, zIndex: 1000, background: 'transparent', border: 'none', color: theme === 'light' ? 'black' : 'white', fontSize: '20px', cursor: 'pointer' }}>
        <FontAwesomeIcon icon={isMuted ? faVolumeOff : faVolumeUp} />
      </button>
      {theme === "light" && <LightBackground />}
      {theme === "dark" && <SpaceBackground />}
      <div style={{ position: "relative", zIndex: 1 }}>
        {/* 🔝 Navbar */}
        <nav className="navbar">
  <h1>Gurdeep</h1>

  {/* Theme Selector (Always outside menu) */}

  
<div className="main-div">
  {/* Hamburger Menu Icon (For small screens) */}
  <div
    className={`menu-icon ${theme}`}
    onClick={() => setMenuOpen(!menuOpen)}
  >
    ☰
  </div>

  <div className={`nav-right ${menuOpen ? "active" : ""} ${theme}`}>
    <ul className="nav-list">
      <li>
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            document
              .querySelector(".home-container")
              .scrollIntoView({ behavior: "smooth" });
            setMenuOpen(false);
          }}
        >
          Home
        </a>
      </li>
      <li>
        <a
          href="#about"
          onClick={(e) => {
            e.preventDefault();
            document
              .querySelector("#about")
              .scrollIntoView({ behavior: "smooth" });
            setMenuOpen(false);
          }}
        >
          Skills
        </a>
      </li>
      <li>
        <a
          href="#projects"
          onClick={(e) => {
            e.preventDefault();
            document
              .querySelector("#projects")
              .scrollIntoView({ behavior: "smooth" });
            setMenuOpen(false);
          }}
        >
          Projects
        </a>
      </li>
      <li>
        <a
          href="#contact"
          onClick={(e) => {
            e.preventDefault();
            document
              .querySelector("#contact")
              .scrollIntoView({ behavior: "smooth" });
            setMenuOpen(false);
          }}
        >
          Contact
        </a>
      </li>
    </ul>
  </div> 
  <div className="theme-selector">
              <button onClick={() => setDropdownOpen(!dropdownOpen)}>
                {theme === "light" ? (
                  <FaSun />
                ) : theme === "dark" ? (
                  <FaMoon />
                ) : (
                  <FaDesktop />
                )}
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
          <button className="role-btn">
            {" "}
            <FontAwesomeIcon icon={faStarHalfStroke} /> Fullstack Developer
          </button>
          <h2 data-aos="fade-right">Hello, I'm</h2>
          <h1 data-aos="fade-right" className="animated-text">
            GURDEEP SINGH
          </h1>
          <p data-aos="fade-right">
            As a dedicated and passionate Fullstack Developer with years of
            experience, I specialize in creating dynamic, responsive, and
            user-friendly web applications.
          </p>
          <div className="social-icons">
            <a
              className="link"
              href="https://github.com/Gurdeep082"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub />
            </a>
            <a
              className="link"
              href="https://www.youtube.com/@TechTroubleshooters_1"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaYoutube />
            </a>
            <a
              className="link"
              href="https://instagram.com/_gurdeep03_"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram />
            </a>
          </div>
        </div>

        <section id="about" className="about">
          <h2
            data-aos="fade-up"
            style={{
              marginTop: "250px",
              textAlign: "center",
              fontSize: "30px",
              backgroundColor: "transparent",
            }}
          >
            Skills
          </h2>
          <div className="skills-container">
            <div data-aos="zoom-in" className="skill">
              <h3>
                <FontAwesomeIcon icon={faHtml5} /> HTML
              </h3>
            </div>
            <div data-aos="zoom-in" className="skill">
              <h3>
                <FontAwesomeIcon icon={faCss3} /> CSS
              </h3>
            </div>
            <div data-aos="zoom-in" className="skill">
              <h3>
                <FontAwesomeIcon icon={faJs} /> JavaScript
              </h3>
            </div>
            <div data-aos="zoom-in" className="skill">
              <h3>
                <FontAwesomeIcon icon={faReact} /> React
              </h3>
            </div>
            <div data-aos="zoom-in" className="skill">
              <h3>
                <FontAwesomeIcon icon={faNodeJs} /> Node.js
              </h3>
            </div>
            <div data-aos="zoom-in" className="skill">
              <h3>
                <FontAwesomeIcon icon={faDatabase} /> MongoDB
              </h3>
            </div>
          </div>

          <div className="skills-container1">
            <div data-aos="fade-up" className="skill1">
              <img src="Problemsolving.jpg" alt="Problem Solving" />
              <h3>Problem Solving</h3>
              <p style={{ textAlign: "justify", padding: "20px " }}>
                The skill to identify, analyze, and develop solutions to
                overcome challenges is key to personal and professional growth.
              </p>
            </div>
            <div data-aos="fade-up" className="skill1">
              <img src="Teamwork.jpeg" alt="Teamwork" />
              <h3>Teamwork</h3>
              <p style={{ textAlign: "justify", padding: "20px " }}>
                Teamwork skills allow people to work well together, improving
                collaboration, communication, and shared success.
              </p>
            </div>
            <div data-aos="fade-up" className="skill1">
              <img src="communication.jpg" alt="Communication Skill" />
              <h3>Communication</h3>
              <p style={{ textAlign: "justify", padding: "20px " }}>
                The ability to effectively communicate with others, both
                verbally and non-verbally, is essential in all aspects of life.
              </p>
            </div>
            <div data-aos="fade-up" className="skill1">
              <img src="SocialSkills.jpg" alt="Social Skill" />
              <h3>Social Skill</h3>
              <p style={{ textAlign: "justify", padding: "20px " }}>
                Social skills help individuals engage effectively in diverse
                social settings, enhancing relationships and teamwork.
              </p>
            </div>
          </div>
        </section>

        <section id="projects" className="projects">
          <h2
            data-aos="fade-up"
            style={{ textAlign: "center", fontSize: "30px",backgroundColor: "transparent" }}
          >
            Projects
          </h2>
          <div className="project-container">
            <div data-aos="zoom-in" className="slideshow">
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
              <h3>
                ServiceHub :{" "}
                <a
                  style={{ textDecoration: "none" }}
                  href="https://servicehub-08.netlify.app/"
                >
                  View Project <FontAwesomeIcon icon={faSquareArrowUpRight} />
                </a>
              </h3>
              <p style={{ textAlign: "justify", padding: "20px " }}>
                "ServiceHub connects you with trusted professionals for home
                services like cooking, plumbing, pest control, and more. Built
                with React.js for a seamless experience."
              </p>
            </div>
            <div data-aos="zoom-in" className="slideshow">
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
              <h3>
                ILmKosh :{" "}
                <a
                  style={{ textDecoration: "none" }}
                  href="https://ilm-kosh.netlify.app/"
                >
                  View Project <FontAwesomeIcon icon={faSquareArrowUpRight} />
                </a>
              </h3>
              <p style={{ textAlign: "justify", padding: "20px " }}>
                "ILmkosh is an innovative book reading platform built with MERN
                stack It allows users to read and upload books effortlessly,
                fostering a community of knowledge sharing and discovery."
              </p>
            </div>
          </div>
        </section>

        {/* 📩 Contact Section */}
        <h2 data-aos="fade-up" className="contacth2" style={{backgroundColor:"transparent"}}>
          Contact
        </h2>
        <div id="contact" className="contact">
          <div data-aos="fade-right" className="contact-form">
            <form onSubmit={handleSubmit}>
              <h3>Get in touch</h3>
              <p>
                I enjoy working with dedicated creatives from businesses that
                make the world beautiful. We can do so much together. Let's
                talk.
              </p>
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
          <div data-aos="fade-left" className="contactinfo">
            <p>
              <FontAwesomeIcon icon={faUser} /> Gurdeep Singh
            </p>
            <p>
              {" "}
              <FontAwesomeIcon icon={faPhone} /> (+91) 9034607228
            </p>
            <a
              href="https://www.linkedin.com/in/gurdeep-singh03/"
              target="_blank"
              rel="noopener noreferrer"
            >
              {" "}
              <FontAwesomeIcon icon={faLinkedin} />{" "}
              linkedin.com/in/gurdeep-singh03/
            </a>
            <p>
              <FontAwesomeIcon icon={faEnvelope} /> sainigurdeep082@gmail.com
            </p>
            <p>
              <FontAwesomeIcon icon={faLocation} /> Ambala, India
            </p>
          </div>
        </div>

        {/* 📌 Footer */}
        <footer>
          <p >© 2025 Gurdeep Singh</p>
          <div
            style={{
              display: "flex",
              margin: "20px 40px auto auto",
              marginRight: "30px",
              gap: "10px",
            }}
          >
            <FaGithub />
            <FaYoutube />
            <FaInstagram />
          </div>
        </footer>
      </div>
      <audio ref={audioRef} src="/music/space-440026.mp3" loop muted={isMuted} preload="auto" onCanPlay={handleCanPlay} onError={(e) => console.error('Audio error:', e)} />
    </div>
  );
};

export default Home;
