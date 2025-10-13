import React from 'react';

function Footer() {
  return (
    <footer className="bg-dark text-light py-3 mt-5">
      <div className="container text-center">
        &copy; {new Date().getFullYear()} MovieBooking. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
