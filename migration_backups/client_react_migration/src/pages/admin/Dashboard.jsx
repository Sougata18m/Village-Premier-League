import { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { logout, isLoggedIn } from '../../api';
import { 
  BarChart3, 
  Users, 
  Calendar, 
  Trophy, 
  LogOut, 
  Menu, 
  X,
  LayoutDashboard,
  Globe
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function Dashboard() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Manage Teams', href: '/admin/teams', icon: Users },
    { name: 'Manage Fixtures', href: '/admin/fixtures', icon: Calendar },
    { name: 'Points Table', href: '/admin/standings', icon: Trophy },
    { name: 'Statistics', href: '/admin/stats', icon: BarChart3 },
    { name: 'View Public Site', href: '/', icon: Globe },
  ];

  return (
    <div className="flex h-screen bg-primary-blue overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {!isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden" 
          onClick={() => setSidebarOpen(true)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "bg-slate-900 border-r border-white/5 w-64 flex flex-col transition-all duration-300 z-30 fixed md:static h-full",
        !isSidebarOpen && "-translate-x-full md:translate-x-0 md:w-20"
      )}>
        <div className="p-6 flex items-center justify-between">
          <Link to="/admin" className={cn("text-accent-gold font-black italic uppercase tracking-tighter flex items-center gap-2", !isSidebarOpen && "md:hidden")}>
            <Trophy className="w-6 h-6" />
            <span>VPL Admin</span>
          </Link>
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-1 hover:bg-white/5 rounded-lg text-slate-400">
            {isSidebarOpen ? <X className="md:hidden" /> : <Menu />}
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-xl transition-all group",
                location.pathname === item.href 
                  ? "bg-accent-gold text-primary-blue font-bold shadow-lg shadow-accent-gold/10" 
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className={cn("text-sm", !isSidebarOpen && "md:hidden")}>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className={cn("text-sm font-bold", !isSidebarOpen && "md:hidden")}>Terminal Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-primary-dark">
        <header className="bg-slate-900/50 backdrop-blur-md border-b border-white/5 p-6 md:hidden">
           <button onClick={() => setSidebarOpen(true)} className="p-2 bg-white/5 rounded-lg text-slate-400"><Menu /></button>
        </header>

        <div className="p-6 md:p-10 max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
