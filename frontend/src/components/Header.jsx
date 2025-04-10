import React from 'react';

function Header({ onLoginClick, isLoggedIn, loggedInEmail, onLogoutClick }) {
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
      <div className="text-2xl font-bold text-blue-600">Shift Spot</div>
      <nav className="flex items-center gap-4">
        <a href="#home" className="text-blue-600 hover:underline">Home</a>
        <a href="#features" className="text-blue-600 hover:underline">Features</a>
        {isLoggedIn ? (
          <div className="flex items-center gap-4">
            <span className="text-blue-600">Hallo, {loggedInEmail}</span>
            <button
              onClick={onLogoutClick}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={onLoginClick}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Login
          </button>
        )}
      </nav>
    </header>
  );
}

export default Header;