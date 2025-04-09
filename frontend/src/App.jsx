import { useState, useEffect, useRef } from 'react'; // Add useRef
import './App.css';
import Sound1 from '../public/sounds/Rain_On_Rooftop.mp3';

function App() {
  const [breaks, setBreaks] = useState([]);
  const [form, setForm] = useState({ start: '11:00', end: '17:00', style: 'deep', crashTime: '15:00' });
  const [isResting, setIsResting] = useState(false);
  const [currentBreak, setCurrentBreak] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [fadeClass, setFadeClass] = useState('');
  const audioRef = useRef(null); // Persist audio object

  useEffect(() => {
    console.log('useEffect triggered, breaks:', breaks);
    const breaksArray = Array.isArray(breaks) ? breaks : breaks.breaks || [];
    if (breaksArray.length) {
      const now = new Date();
      const today = now.toISOString().slice(0, 10);
      console.log('Current time:', now.toLocaleTimeString());
      const nextBreak = breaksArray.find(b => {
        const breakTime = new Date(`${today} ${b.time}`);
        console.log(`Checking break: ${b.time}, vs Now: ${now.toLocaleTimeString()}, Future? ${breakTime > now}`);
        return breakTime > now;
      });
      if (nextBreak) {
        const timeout = new Date(`${today} ${nextBreak.time}`).getTime() - now.getTime();
        console.log('Next break found:', nextBreak.time, 'Timeout (secs):', timeout / 1000);
        if (timeout > 0) {
          const timer = setTimeout(() => {
            alert(`Break at ${nextBreak.time}!`);
            setCurrentBreak(nextBreak);
            console.log('Alert fired, currentBreak set:', nextBreak);
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
    console.log('Raw response:', data);
    setBreaks(data);
  };

  const startRest = () => {
    setFadeClass('fade-in');
    setIsResting(true);
    audioRef.current = new Audio(Sound1); // Store in ref
    console.log('Audio path:', Sound1);
    audioRef.current.loop = true;
    audioRef.current.play().catch(e => console.error('Audio play failed:', e));
    const durationSecs = parseInt(currentBreak.duration) * 60;
    setTimeLeft(durationSecs);
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 6) {
          setFadeClass('fade-out');
        }
        if (prev <= 1) {
          clearInterval(interval);
          setIsResting(false);
          if (audioRef.current) {
            audioRef.current.pause(); // Stop sound
            audioRef.current.currentTime = 0; // Reset to start
            console.log('Audio stopped');
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
        <h1>Resting...</h1>
        <p>Back in {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center">
      <form onSubmit={handleSubmit}>
        <input type="time" value={form.start} onChange={e => setForm({ ...form, start: e.target.value })} />
        <input type="time" value={form.end} onChange={e => setForm({ ...form, end: e.target.value })} />
        <select value={form.style} onChange={e => setForm({ ...form, style: e.target.value })}>
          <option value="deep">Deep Focus</option>
          <option value="casual">Casual</option>
          <option value="mixed">Mixed</option>
        </select>
        <input type="time" value={form.crashTime} onChange={e => setForm({ ...form, crashTime: e.target.value })} />
        <button>Plan Breaks</button>
      </form>
      {currentBreak && <button onClick={startRest}>I’m Resting Now</button>}
      <pre>{JSON.stringify(breaks, null, 2)}</pre>
    </div>
  );
}

export default App;