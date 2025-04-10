import React, { useEffect } from 'react';

function Notification({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // Schließt nach 5 Sekunden
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-20 right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg z-50">
      <p>{message}</p>
      <button onClick={onClose} className="ml-4 text-white hover:text-gray-200">
        ✕
      </button>
    </div>
  );
}

export default Notification;