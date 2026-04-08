import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Trophy } from 'lucide-react';
import { useState } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { isLoggedIn } from '../api';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const adminActive = isLoggedIn();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Teams', href: '/teams' },
    { name: 'Fixtures', href: '/fixtures' },
    { name: 'Standings', href: '/standings' },
    { name: 'Stats', href: '/stats' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900/70 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 text-accent-gold font-extrabold text-2xl tracking-tighter uppercase italic">
              <Trophy className="w-8 h-8" />
              <span>VPL</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={cn(
                  "text-sm font-semibold tracking-wide transition-colors hover:text-accent-gold",
                  location.pathname === link.href ? "text-accent-gold" : "text-slate-300"
                )}
              >
                {link.name}
              </Link>
            ))}
            {adminActive ? (
              <Link to="/admin" className="bg-sky-500 text-white px-5 py-2 rounded-lg font-black text-xs uppercase tracking-widest hover:bg-white hover:text-sky-500 transition-all">
                Dashboard
              </Link>
            ) : (
              <Link to="/admin/login" className="bg-accent-gold text-primary-blue px-5 py-2 rounded-lg font-black text-xs uppercase tracking-widest hover:bg-white hover:scale-105 transition-all">
                Admin Login
              </Link>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-300 hover:text-white focus:outline-none"
            >
              {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-slate-900 border-b border-white/10 animate-in slide-in-from-top duration-300">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium",
                  location.pathname === link.href ? "text-accent-gold border-r-4 border-accent-gold bg-accent-gold/10" : "text-slate-300 hover:bg-white/5"
                )}
              >
                {link.name}
              </Link>
            ))}
            {adminActive ? (
              <Link
                to="/admin"
                onClick={() => setIsOpen(false)}
                className="block w-full mt-4 bg-sky-500 text-white text-center py-3 rounded-lg font-bold"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                to="/admin/login"
                onClick={() => setIsOpen(false)}
                className="block w-full mt-4 bg-accent-gold text-primary-blue text-center py-3 rounded-lg font-bold"
              >
                Admin Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
