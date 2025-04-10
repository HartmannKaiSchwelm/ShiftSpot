import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import App from '../App';
import "../App.css"

function Landing() {
  const [showLogin, setShowLogin] = useState(false);
  const [betaEmail, setBetaEmail] = useState('');
  const [betaEmails, setBetaEmails] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInEmail, setLoggedInEmail] = useState("");

  useEffect(() => {
    fetch('/beta-emails.json')
      .then(res => res.json())
      .then(data => setBetaEmails(data.emails || []))
      .catch(() => setBetaEmails([]));
  }, []);

  const handleBetaSubmit = (e) => {
    e.preventDefault();
    const newEmails = [...betaEmails, betaEmail];
    setBetaEmails(newEmails);
    setBetaEmail('');
    alert('Danke! Wir melden uns bei dir für die Beta.');
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const email = e.target.emailaddress.value;
    if (betaEmails.includes(email)) {
      setIsLoggedIn(true);
      setLoggedInEmail(email);
      setShowLogin(false);
    } else {
      alert('Sorry, diese E-Mail ist nicht in der Beta-Liste.');
    }
  };
  const handleLogout = () =>{
    setIsLoggedIn(false);
    setLoggedInEmail("");
  }
  

  return (
    <div className="min-h-screen flex flex-col">
      <Header onLoginClick={() => setShowLogin(true)} isLoggedIn={isLoggedIn} loggedInEmail={loggedInEmail} onLogoutClick={handleLogout} />
      <main className="flex-grow pt-20">
        {isLoggedIn ? (
        <App betaEmails={betaEmails} />
        ) : (
          <>
          <section className="relative h-screen flex items-center justify-center text-center text-white pt-16">
          <video autoPlay loop muted className="absolute -top-20 left-0 w-full h-full object-cover z-[-1]">
            <source src="/videos/1776352-hd_1920_1080_25fps.mp4" type="video/mp4" />
          </video>
          <div className="z-10 text-shadow-lg text-shadow-blue-500">
            <h1 className="text-5xl font-bold mb-4">Rest Easy, Work Smart</h1>
            <p className="text-2xl mb-6">Personalized breaks to boost your focus and calm your mind.</p>
            <form onSubmit={handleBetaSubmit} className="flex gap-4 justify-center">
              <input
                type="email"
                value={betaEmail}
                onChange={(e) => setBetaEmail(e.target.value)}
                placeholder="Want to join the beta? Enter your E-Mail"
                className="p-2 rounded-lg border text-black w-78 bg-white/40 backdrop-blur-md"
                required
              />
              <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">Join!</button>
            </form>
          </div>
        </section>

        <section id="features" className="py-16 -mt-20 text-center bg-gray-100">
          <h2 className="text-4xl font-bold mb-8">Why Shift Spot?</h2>
          <div className="flex justify-center gap-8">
            <div className="bg-blue-100 p-6 rounded-lg shadow-md w-64">
              <h3 className="text-2xl font-semibold mb-4">Smart Breaks</h3>
              <p>AI-driven schedules tailored to your day.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md w-64">
              <h3 className="text-2xl font-semibold mb-4">Customize Your Vibe</h3>
              <p>Pick backgrounds and sounds that suit you.</p>
            </div>
            <div className="bg-blue-100 p-6 rounded-lg shadow-md w-64">
              <h3 className="text-2xl font-semibold mb-4">Spotify Sync</h3>
              <p>Chill to your favorite playlists.</p>
            </div>
          </div>
        </section>
        </>
        )}
      </main>
          
        
        

      <Footer />

      {showLogin && (
        <div className="fixed inset-0 bg-gray-400/80 bg-opacity-50 flex items-center justify-center z-20">
          <form onSubmit={handleLogin} className="bg-white p-6 rounded-lg flex flex-col gap-4">
            <h2 className="text-2xl text-center font-bold">Login</h2>
            <input type="text" name="emailaddress" placeholder="E-Mail address" className="p-2 border rounded" required />
            <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Login</button>
            <button type="button" onClick={() => setShowLogin(false)} className="text-blue-600">Close</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Landing;