import React from 'react';

function Header({ onLoginClick, onRegisterClick }) {
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full bg-transparent z-10 flex justify-between items-center p-4 ${
        isScrolled ? 'bg-white/80 backdrop-blur-md shadow-md' : ''
      }`}
    >
      <div className="text-2xl font-bold ">Shift Spot</div>
      <nav className="flex items-center gap-4">
        <a href="#home" className="text-blue-600 hover:underline">Home</a>
        <a href="#features" className="text-blue-600 hover:underline">Features</a>
        <a href="#pricing" className="text-blue-600 hover:underline">Pricing</a>
        <button onClick={onLoginClick} className="text-blue-600 hover:underline">Login</button>
        <button onClick={onRegisterClick} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Register</button>
      </nav>
    </header>
  );
}

export default Header;