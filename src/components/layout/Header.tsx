import React from 'react';
import { Clock } from 'lucide-react';

const Header = () => {
  return (
    <header className="relative w-full">
      {/* Desktop Navbar */}
      <nav className="hidden lg:flex justify-between items-center px-8 py-4">
        <div className="flex-1" /> {/* Espace à gauche */}
        <div className="logo flex justify-center flex-1">
          <img 
            src="/assets/images/logopageant.png" 
            alt="Logo Miss Orangina" 
            className="h-20"
            style={{ height: '4.5rem' }}
          />
        </div>
        <div className="flex-1 flex justify-end">
          <ul className="flex space-x-6 text-white">
            <li><a href="#about" className="hover:text-gray-300">À propos</a></li>
            <li><a href="#contact" className="hover:text-gray-300">Contact</a></li>
          </ul>
        </div>
      </nav>

      {/* Mobile Navbar */}
      <div className="lg:hidden flex flex-col items-center py-4">
        <img 
          src="/assets/images/logopageant.png" 
          alt="Logo Miss Orangina" 
          className="h-20"
          style={{ height: '4.5rem' }}
        />
        <button id="hamburger" className="mt-2">
          <div className="w-8 h-1 bg-white mb-1"></div>
          <div className="w-8 h-1 bg-white mb-1"></div>
          <div className="w-8 h-1 bg-white"></div>
        </button>
      </div>
      <div id="mobile-menu" className="hidden absolute top-full left-0 w-full text-center">
        <ul className="space-y-4 py-4">
          <li><a href="#about" className="hover:text-gray-300">À propos</a></li>
          <li><a href="#contact" className="hover:text-gray-300">Contact</a></li>
        </ul>
      </div>
    </header>
  );
};

export default Header;