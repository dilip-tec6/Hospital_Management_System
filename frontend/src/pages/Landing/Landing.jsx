import { Link } from "react-router-dom";
import { Heart, Users, Calendar, ShieldCheck } from "lucide-react";
import "./Landing.css";

function Landing() {
  return (
    <div className="landing">
      <nav className="landing-navbar">
        <div className="landing-logo">
          <Heart size={26} />
          <span>ArchZen Hospital</span>
        </div>
        <div className="landing-nav-links">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#services">Services</a>
          <a href="#contact">Contact</a>
        </div>
        <Link to="/login" className="btn btn-secondary">
          Admin Login
        </Link>
      </nav>

      <section className="hero">
        <div className="hero-overlay" />
        <div className="hero-content glass-card">
          <h1 className="hero-title">ArchZen Hospital</h1>
          <h2 className="hero-subtitle">Modern Hospital Management System</h2>
          <p className="hero-description">
            Manage patients, doctors, appointments, medical records, and
            billing efficiently from one secure dashboard.
          </p>
          <div className="hero-buttons">
            <Link to="/login" className="btn btn-primary">
              Enter Admin Panel
            </Link>
            <a href="#about" className="btn btn-secondary">
              Learn More
            </a>
          </div>
        </div>
      </section>

      <section id="about" className="features">
        <div className="feature-card glass-card">
          <Users size={32} />
          <h3>Patient Care</h3>
          <p>Comprehensive patient records at your fingertips.</p>
        </div>
        <div className="feature-card glass-card">
          <Calendar size={32} />
          <h3>Smart Scheduling</h3>
          <p>Effortless appointment booking and tracking.</p>
        </div>
        <div className="feature-card glass-card">
          <ShieldCheck size={32} />
          <h3>Secure &amp; Reliable</h3>
          <p>Your hospital data, protected and always available.</p>
        </div>
      </section>

      <footer className="landing-footer">
        <p>&copy; {new Date().getFullYear()} ArchZen Hospital. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Landing;