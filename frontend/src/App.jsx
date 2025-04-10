import React, { useState, useEffect, useRef } from 'react';
import Sound1 from '../public/sounds/Rain_On_Rooftop.mp3';
import Notification from './components/Notification';
function App({ betaEmails }) {
  const [breaks, setBreaks] = useState([]);
  const [form, setForm] = useState({ start: '08:00', end: '17:00', style: 'deep', crashTime: '12:00' });
  const [isResting, setIsResting] = useState(false);
  const [currentBreak, setCurrentBreak] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [fadeClass, setFadeClass] = useState('');
  const audioRef = useRef(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    console.log('useEffect triggered, breaks:', breaks);
    const breaksArray = Array.isArray(breaks) ? breaks : breaks.breaks || [];
    if (breaksArray.length) {
      const now = new Date();
      const today = now.toISOString().slice(0, 10);
      console.log('Current time:', now.toLocaleTimeString());
      const nextBreak = breaksArray.find(b => {
        const breakTime = new Date(`${today} ${b.time}`);
        return breakTime > now;
      });
      if (nextBreak) {
        const timeout = new Date(`${today} ${nextBreak.time}`).getTime() - now.getTime();
        if (timeout > 0) {
          const timer = setTimeout(() => {
            setCurrentBreak(nextBreak); // Zuerst setzen
            setNotification(`Break at ${nextBreak.time}!`); // Danach verwenden
          }, timeout);
          return () => clearTimeout(timer);
        }
      }
    }
  }, [breaks]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:3000/schedule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    setBreaks(data);
  };

  const startRest = () => {
    setFadeClass('fade-in');
    setIsResting(true);
    audioRef.current = new Audio(Sound1);
    audioRef.current.loop = true;
    audioRef.current.play().catch(e => console.error('Audio play failed:', e));
    const durationSecs = parseInt(currentBreak.duration) * 60;
    setTimeLeft(durationSecs);
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 6) setFadeClass('fade-out');
        if (prev <= 1) {
          clearInterval(interval);
          setIsResting(false);
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
          }
          setFadeClass('');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  if (isResting) {
    return (
      <div className={`rest-screen ${fadeClass}`}>
        <h1 className="text-4xl font-bold mb-4">Resting...</h1>
        <p className="text-2xl">
          Back in {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Shift Spot Beta</h1>
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label className="text-gray-700 font-semibold mb-1">Start Time</label>
            <input
              type="time"
              value={form.start}
              onChange={e => setForm({ ...form, start: e.target.value })}
              className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-700 font-semibold mb-1">End Time</label>
            <input
              type="time"
              value={form.end}
              onChange={e => setForm({ ...form, end: e.target.value })}
              className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-700 font-semibold mb-1">Break Style</label>
            <select
              value={form.style}
              onChange={e => setForm({ ...form, style: e.target.value })}
              className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="deep">Deep Focus</option>
              <option value="casual">Casual</option>
              <option value="mixed">Mixed</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-gray-700 font-semibold mb-1">Crash Time</label>
            <input
              type="time"
              value={form.crashTime}
              onChange={e => setForm({ ...form, crashTime: e.target.value })}
              className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Plan Breaks
          </button>
        </form>
      </div>
      {notification && (
  <Notification message={notification} onClose={() => setNotification(null)} />
)}
      {currentBreak && (
        <div className="max-w-md mx-auto mt-4">
          <button
            onClick={startRest}
            className="w-full bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            I’m Resting Now
          </button>
        </div>
      )}
      {breaks.length > 0 && (
        <div className="max-w-md mx-auto mt-6 bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Your Breaks</h2>
          <ul className="list-disc list-inside text-gray-600">
            {breaks.map((b, i) => (
              <li key={i}>
                {b.time} - {b.duration} mins
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;