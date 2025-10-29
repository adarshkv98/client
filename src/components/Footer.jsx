import React from "react";

const Footer = () => {
  return (
    <footer
      className="text-center py-4 text-white-50 mt-5"
      style={{
        background: "linear-gradient(90deg, #0f0c29, #302b63, #24243e)",
      }}
    >
      <div className="container">
        <p className="mb-1">&copy; {new Date().getFullYear()} CineAura</p>
        <small>All Rights Reserved | Experience the Aura of Cinema</small>
      </div>

      {/* Custom Styles */}
      <style>{`
        * {
          font-family: 'Poppins', sans-serif;
        }
        footer p, footer small {
          color: #f0e6ff;
          text-shadow: 0 0 5px rgba(255,255,255,0.3);
        }
      `}</style>
    </footer>
  );
};

export default Footer;
