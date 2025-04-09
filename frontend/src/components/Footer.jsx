import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <p>© 2025 Shift Spot. All rights reserved.</p>
      <div className="flex gap-4">
        <a href="#about" className="hover:underline">About</a>
        <a href="#contact" className="hover:underline">Contact</a>
        <a href="#privacy" className="hover:underline">Privacy</a>
      </div>
    </footer>
  );
}

export default Footer;