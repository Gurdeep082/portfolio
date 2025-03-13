import React, { useState, useEffect } from 'react';
import { FaSun, FaMoon, FaDesktop, FaGithub, FaYoutube, FaInstagram } from 'react-icons/fa';
import './Home.css'; // External CSS for cleaner code
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCss3 ,faHtml5,faJs, faNodeJs, faReact } from '@fortawesome/free-brands-svg-icons';
import { faDatabase } from '@fortawesome/free-solid-svg-icons';


const Home = () => {
    const [theme, setTheme] = useState('light');
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        if (theme === 'system') {
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            setTheme(prefersDark ? 'dark' : 'light');
        }
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
            <video className="video-bg" autoPlay loop muted playsInline>
                <source src="/7670836-uhd_3840_2160_30fps.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            {/* 🔝 Navbar */}
            <nav className="navbar">
                <h1>Gurdeep</h1>
                <div className="nav-right">
                    <ul className="nav-list">
                        <li><a href="/">Home</a></li>
                        <li><a href="#about">Skills</a></li>
                        <li><a href="#contact">Projects</a></li>
                        <li><a href="#login">Contact</a></li>
                    </ul>

                    {/* 🌙 Theme Selector */}
                    <div className="theme-selector">
                        <button onClick={() => setDropdownOpen(!dropdownOpen)}>
                            {themeIcons[theme]}
                        </button>

                        {dropdownOpen && (
                            <div className="dropdown">
                                <div onClick={() => handleThemeChange('light')}><FaSun /> Light</div>
                                <div onClick={() => handleThemeChange('dark')}><FaMoon /> Dark</div>
                                <div onClick={() => handleThemeChange('system')}><FaDesktop /> System</div>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* 📌 Main Content */}

                <div className="intro">
                    <button className="role-btn">Fullstack Developer</button>
                    <h2>Hello, I'm</h2>
                    <h1>GURDEEP SINGH</h1>
                    <p>
                        As a dedicated and passionate Fullstack Developer with a year of professional experience,
                        I specialize in creating dynamic, responsive, and user-friendly web applications.
                    </p>
                    <div className="social-icons">
                        <a href="https://github.com/Gurdeep082"><FaGithub /></a>
                        <a href="https://www.youtube.com/@TechTroubleshooters_1"><FaYoutube /></a>
                        <a href="https://instagram.com/_gurdeep03_"><FaInstagram /></a>
                    </div>
                </div>


            <section id="about" className="about">
                <h2 style={{marginTop:'100px'}}>Skills</h2>
                <div className="skills-container">
                    <div className="skill" > 
                        <h3><FontAwesomeIcon icon={faHtml5} />    HTML</h3>
                        
                    </div>
                    <div className="skill">
                        
                        <h3> <FontAwesomeIcon icon={faCss3} />  CSS</h3>
                        
                    </div>
                    <div className="skill">
                        <h3> <FontAwesomeIcon icon={faJs} />  JavaScript</h3>
                        
                    </div>
                    <div className="skill">
                        <h3><FontAwesomeIcon icon={faReact} />  React</h3>  
                        
                    </div>
                    <div className="skill">
                        <h3><FontAwesomeIcon icon={faNodeJs} />  Node.js</h3>
                        
                    </div>
                    <div className="skill">
                        <h3><FontAwesomeIcon icon={faDatabase} />  MongoDB</h3>
                       
                    </div>
                </div>
            </section>
            <section id="contact" className="contact">
                <h2>Projects</h2>
                <div className="projects-container">
                    <div className="project">
                        <img src="/project1.jpg" alt="Project 1" />
                        <h3>Project 1</h3>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                            Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        </p>
                    </div>
                    <div className="project">
                        <img src="/project2.jpg" alt="Project 2" />
                        <h3>Project 2</h3>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit.

                        </p>
                    </div>
                    <div className="project">
                        <img src="/project3.jpg" alt="Project 3" />

                        <h3>Project 3</h3>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                            Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        </p>
                    </div>
                </div>
            </section>
            <section id="login" className="login">
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
