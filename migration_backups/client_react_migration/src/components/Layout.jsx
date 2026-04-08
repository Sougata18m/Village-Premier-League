import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full animate-in fade-in duration-700">
        <Outlet />
      </main>
      <footer className="bg-slate-900 border-t border-white/5 py-10 text-center text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Village Premier League. All Rights Reserved.</p>
        <p className="mt-2 text-xs opacity-50 uppercase tracking-widest">Driven by Local Cricket Passion</p>
      </footer>
    </div>
  );
}
