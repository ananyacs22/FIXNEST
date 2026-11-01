
import React, { useState } from "react";
import ReportIssue from "./ReportIssue";
import AdminDashboard from "./components/AdminDashboard";
import AdminLogin from "./AdminLogin";
import Auth from "./Auth";

// HOME PAGE
function HomePage({ onResidentLogin, onAdminLogin }) {
  const features = [
    {
      icon: "📸",
      title: "Easy Issue Reporting",
      description:
        "Report problems in your neighbourhood with photos and location details.",
    },
    {
      icon: "🤝",
      title: "Community Engagement",
      description:
        "Connect with neighbours, support reports and work together.",
    },
    {
      icon: "📊",
      title: "Transparent Tracking",
      description:
        "Track the progress of reported issues from submission to resolution.",
    },
  ];

  return (
    <div style={{ fontFamily: "Arial, sans-serif", color: "#173858" }}>
      {/* NAVBAR */}
      <nav style={styles.navbar}>
        <h2 style={styles.logo}>
          FIX<span style={{ color: "#287bd1" }}>NEST</span>
        </h2>

        <div style={styles.navLinks}>
          <a href="#home" style={styles.navLink}>Home</a>
          <a href="#about" style={styles.navLink}>About</a>
          <a href="#features" style={styles.navLink}>Features</a>

          <button
            style={styles.navButton}
            onClick={onResidentLogin}
          >
            Resident Login
          </button>

          <button
            style={styles.adminButton}
            onClick={onAdminLogin}
          >
            Admin Login
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section id="home" style={styles.hero}>
        <div style={styles.heroOverlay}></div>

        <div style={styles.heroContent}>
          <div style={styles.tagline}>
            SMARTER COMMUNITIES · BETTER LIVING
          </div>

          <h1 style={styles.heroTitle}>
            A Better Community
            <br />
            Starts With <span style={{ color: "#287bd1" }}>You.</span>
          </h1>

          <p style={styles.heroDescription}>
            Report community issues, connect with your neighbours
            and make your residential community a better place to live.
          </p>

          <div style={styles.heroButtons}>
            <button
              style={styles.primaryButton}
              onClick={onResidentLogin}
            >
              Get Started →
            </button>

            <a href="#features" style={styles.secondaryButton}>
              Explore Features
            </a>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" style={styles.about}>
        <p style={styles.sectionTag}>ABOUT FIXNEST</p>

        <h2 style={styles.sectionTitle}>
          Building Better Neighbourhoods Together
        </h2>

        <p style={styles.sectionDescription}>
          FIXNEST is a community-driven platform that makes it easier
          for residents to report local problems, interact with their
          neighbours and monitor the progress of community issues.
          Our goal is to create cleaner, safer and better-connected
          residential communities.
        </p>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" style={styles.features}>
        <p style={styles.sectionTag}>WHAT WE OFFER</p>

        <h2 style={styles.sectionTitle}>
          Everything Your Community Needs
        </h2>

        <div style={styles.featureGrid}>
          {features.map((feature, index) => (
            <div key={index} style={styles.featureCard}>
              <div style={styles.featureIcon}>{feature.icon}</div>

              <h3>{feature.title}</h3>

              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section style={styles.cta}>
        <h2>Be a Part of the Change.</h2>

        <p>
          Your community deserves better. Start making a difference today.
        </p>

        <button
          style={styles.primaryButton}
          onClick={onResidentLogin}
        >
          Join FIXNEST →
        </button>
      </section>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <h2>
          FIX<span style={{ color: "#60a5fa" }}>NEST</span>
        </h2>

        <p>Building better communities, one report at a time.</p>

        <p>© 2026 FIXNEST. All rights reserved.</p>
      </footer>
    </div>
  );
}


// MAIN APP
function App() {
  const [page, setPage] = useState("home");

  const [residentUser, setResidentUser] = useState(() => {
    try {
      const user = JSON.parse(localStorage.getItem("fixnestUser"));
      return user?.role === "resident" ? user : null;
    } catch {
      return null;
    }
  });

  const [adminUser, setAdminUser] = useState(() => {
    try {
      const user = JSON.parse(localStorage.getItem("fixnestUser"));
      return user?.role === "admin" ? user : null;
    } catch {
      return null;
    }
  });

  // RESIDENT LOGIN
  const handleResidentLogin = (user) => {
    setResidentUser(user);
    setPage("residentDashboard");
  };

  // ADMIN LOGIN
  const handleAdminLogin = (user) => {
    if (user?.role !== "admin") return;

    setAdminUser(user);
    setPage("admin");
  };

  // LOGOUT AND RETURN HOME
  const handleGoHome = () => {
    localStorage.removeItem("fixnestToken");
    localStorage.removeItem("fixnestUser");

    setResidentUser(null);
    setAdminUser(null);
    setPage("home");
  };

  // LANDING PAGE
  if (page === "home") {
    return (
      <HomePage
        onResidentLogin={() => setPage("resident")}
        onAdminLogin={() =>
          setPage(adminUser ? "admin" : "adminLogin")
        }
      />
    );
  }

  return (
    <div className="app">

      {/* PORTAL NAVIGATION */}
      <div style={styles.portalNavbar}>
        <h2 style={styles.portalLogo}>
          FIX<span style={{ color: "#60a5fa" }}>NEST</span>
        </h2>

        <div style={styles.portalButtons}>
          {residentUser && (page === "reportIssue" || page === "communityIssues") && (
  <button
    style={styles.portalButton}
    onClick={() => setPage("residentDashboard")}
  >
    📊 Dashboard
  </button>
)}
          <button
            style={styles.portalButton}
            onClick={handleGoHome}
          >
            🏠 Home
          </button>
        </div>
      </div>

      {/* RESIDENT LOGIN / DASHBOARD */}
      {page === "resident" && !residentUser && (
  <Auth onAuthSuccess={handleResidentLogin} />
)}
{page === "residentDashboard" && residentUser && (
  <div style={{
    minHeight: "85vh",
    background: "linear-gradient(135deg, #eef6ff, #ffffff)",
    padding: "70px 8%",
    fontFamily: "Arial, sans-serif"
  }}>
    <div style={{ textAlign: "center", marginBottom: "55px" }}>
      <h1 style={{
        fontSize: "38px",
        color: "#173b68",
        marginBottom: "12px"
      }}>
        Welcome to FIXNEST
      </h1>

      <p style={{
        fontSize: "17px",
        color: "#64748b"
      }}>
        Your community, your voice. What would you like to do today?
      </p>
    </div>

    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
      gap: "30px",
      maxWidth: "850px",
      margin: "auto"
    }}>
      <div
        onClick={() => setPage("reportIssue")}
        style={{
          background: "#ffffff",
          padding: "40px 30px",
          borderRadius: "20px",
          textAlign: "center",
          cursor: "pointer",
          boxShadow: "0 10px 30px rgba(30, 64, 120, 0.10)",
          border: "1px solid #dbeafe"
        }}
      >
        <div style={{ fontSize: "48px" }}>📝</div>
        <h2 style={{ color: "#1d4ed8" }}>Report an Issue</h2>
        <p style={{ color: "#64748b", lineHeight: "1.6" }}>
          Report problems in your community and get them resolved.
        </p>
        <span style={{ color: "#2563eb", fontWeight: "bold" }}>
          Get Started →
        </span>
      </div>

      <div
        onClick={() => setPage("communityIssues")}
        style={{
          background: "#ffffff",
          padding: "40px 30px",
          borderRadius: "20px",
          textAlign: "center",
          cursor: "pointer",
          boxShadow: "0 10px 30px rgba(30, 64, 120, 0.10)",
          border: "1px solid #dbeafe"
        }}
      >
        <div style={{ fontSize: "48px" }}>🏘️</div>
        <h2 style={{ color: "#1d4ed8" }}>Community Issues</h2>
        <p style={{ color: "#64748b", lineHeight: "1.6" }}>
          Explore reported problems and see what's happening around you.
        </p>
        <span style={{ color: "#2563eb", fontWeight: "bold" }}>
          Explore Issues →
        </span>
      </div>
    </div>
  </div>
)}

{page === "reportIssue" && residentUser && (
  <ReportIssue view="report" />
)}

{page === "communityIssues" && residentUser && (
  <ReportIssue view="community" />
)}

      {/* ADMIN LOGIN */}
      {page === "adminLogin" && (
        <AdminLogin onLogin={handleAdminLogin} />
      )}

      {/* ADMIN DASHBOARD */}
      {page === "admin" && (
        adminUser ? (
          <AdminDashboard />
        ) : (
          <AdminLogin onLogin={handleAdminLogin} />
        )
      )}
    </div>
  );
}


// STYLES
const styles = {
  navbar: {
  padding: "15px 5%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#ffffff",
  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
  flexWrap: "wrap",
  gap: "15px",
},

  logo: {
    fontSize: "27px",
    fontWeight: "900",
    letterSpacing: "1px",
    margin: 0,
    color: "#173858",
  },

  navLinks: {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "15px",
  flexWrap: "wrap",
  width: "100%",
},
  navLink: {
    textDecoration: "none",
    color: "#294968",
    fontWeight: "600",
  },

  navButton: {
    background: "#287bd1",
    color: "white",
    border: "none",
    padding: "11px 19px",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
  },

  adminButton: {
    background: "#173858",
    color: "white",
    border: "none",
    padding: "11px 19px",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
  },

  hero: {
    minHeight: "650px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    backgroundImage:
      "url('https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=2000&q=85')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    padding: "70px 20px",
    boxSizing: "border-box",
  },

  heroOverlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(239,247,255,0.78)",
    backdropFilter: "blur(7px)",
  },

  heroContent: {
    position: "relative",
    zIndex: 1,
    textAlign: "center",
    maxWidth: "1000px",
  },

  tagline: {
    display: "inline-block",
    background: "rgba(255,255,255,0.9)",
    color: "#287bd1",
    padding: "13px 25px",
    borderRadius: "30px",
    fontSize: "15px",
    fontWeight: "bold",
    letterSpacing: "2px",
    marginBottom: "25px",
  },

  heroTitle: {
  fontSize: "clamp(34px, 7vw, 78px)",
  lineHeight: 1.2,
  fontWeight: "900",
  color: "#173858",
  margin: "15px 0 25px",
  overflowWrap: "break-word",
},

  heroDescription: {
  fontSize: "clamp(16px, 2.5vw, 21px)",
  lineHeight: 1.7,
  color: "#385b7c",
  maxWidth: "850px",
  margin: "0 auto 35px",
  padding: "0 10px",
  boxSizing: "border-box",
},

  heroButtons: {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "15px",
  flexWrap: "wrap",
  width: "100%",
  padding: "0 10px",
  boxSizing: "border-box",
},

  primaryButton: {
  background: "#287bd1",
  color: "#ffffff",
  border: "none",
  padding: "16px 28px",
  borderRadius: "11px",
  fontSize: "16px",
  fontWeight: "bold",
  cursor: "pointer",
  boxShadow: "0 8px 20px rgba(40,123,209,0.2)",
  maxWidth: "100%",
},

  secondaryButton: {
    background: "#ffffff",
    color: "#173858",
    border: "1px solid #b7d0e8",
    padding: "18px 35px",
    borderRadius: "11px",
    fontSize: "17px",
    fontWeight: "bold",
    textDecoration: "none",
    display: "inline-block",
  },

about: {
  padding: "65px 5%",
  textAlign: "center",
  background: "#ffffff",
  boxSizing: "border-box",
},
  sectionTag: {
    color: "#287bd1",
    fontWeight: "bold",
    letterSpacing: "2px",
    fontSize: "13px",
  },

  sectionTitle: {
  fontSize: "clamp(25px, 5vw, 36px)",
  color: "#173858",
  margin: "15px 0 25px",
  lineHeight: 1.3,
},

  sectionDescription: {
  maxWidth: "850px",
  margin: "auto",
  color: "#587087",
  fontSize: "clamp(15px, 2.5vw, 18px)",
  lineHeight: 1.8,
  padding: "0 10px",
  boxSizing: "border-box",
},

  features: {
  padding: "65px 5%",
  background: "#f3f8fd",
  textAlign: "center",
  boxSizing: "border-box",
},

  featureGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
    gap: "25px",
    marginTop: "45px",
  },

  featureCard: {
  background: "#ffffff",
  padding: "30px 20px",
  borderRadius: "15px",
  boxShadow: "0 5px 20px rgba(23,56,88,0.07)",
  textAlign: "center",
  width: "100%",
  boxSizing: "border-box",
},

  featureIcon: {
    fontSize: "42px",
    marginBottom: "15px",
  },

  cta: {
  padding: "60px 5%",
  textAlign: "center",
  background: "#e5f1fc",
  boxSizing: "border-box",
},
  footer: {
    padding: "35px 20px",
    textAlign: "center",
    background: "#173858",
    color: "#ffffff",
    lineHeight: 1.8,
  },

  portalNavbar: {
    background: "#173858",
    padding: "14px 6%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
  },

  portalLogo: {
    color: "#ffffff",
    margin: 0,
    fontSize: "25px",
  },

  portalButtons: {
    display: "flex",
    gap: "12px",
  },

  portalButton: {
    background: "#287bd1",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    padding: "11px 20px",
    fontWeight: "bold",
    cursor: "pointer",
  },
};

export default App;
