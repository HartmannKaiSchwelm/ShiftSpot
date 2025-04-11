import React from 'react';
import { useState } from 'react';
import ForestImage from '/images/sebastian-unrau-unsplash.jpg'; 
import BeachImage from '/images/rowan-heuvel-U6t80TWJ1DM-unsplash.jpg';
import MountainImage from '/images/kalen-emsley-Bkci_8qcdvQ-unsplash.jpg';
const backgrounds = [
  { name: 'Forest', url: ForestImage },
  { name: 'Beach', url: BeachImage },
  { name: 'Mountain', url: MountainImage },
]; 
function UserSettingsPage({ onBackgroundChange, currentBackground, onBackClick }) { 
  const [selectedBackground, setSelectedBackground] = useState(currentBackground);// Fügt currentBackground und onBackClick hinz
  return (<>
    <div className="p-6 bg-gray-50 h-[100px]">
  <button
    onClick={onBackClick}
    className="mb-4 text-blue-600 hover:underline"
  >
    ← Back to Rest Planning
  </button></div>
  <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">User Settings</h1>
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">User Settings</h1>
      <div className="max-w-md mx-auto bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Choose Background</h2>
        <div className="grid grid-cols-3 gap-2">
          {backgrounds.map(bg => (
         <button
         key={bg.name}
         onClick={() => {
           onBackgroundChange(bg.url);
           setSelectedBackground(bg.url); // Setzt das ausgewählte Bild
         }}
         className={`w-full h-20 rounded-lg overflow-hidden hover:ring-2 hover:ring-blue-600 ${
           selectedBackground === bg.url ? 'ring-4 ring-blue-600' : ''
         }`} // Fügt Rahmen hinzu, wenn ausgewählt
         style={{ background: `url(${bg.url}) no-repeat center/cover` }}
       >
              <span className="block text-white text-sm font-semibold bg-black/50 p-1">{bg.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
    </>
  );

}
export default UserSettingsPage;