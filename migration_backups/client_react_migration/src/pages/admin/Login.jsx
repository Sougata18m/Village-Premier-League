import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api';
import { Lock, User, ShieldAlert } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const data = await login(username, password);
      if (data.success) {
        navigate('/admin');
      }
    } catch (err) {
      setError('Invalid mission protocols. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary-blue flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,#1e3a8a,transparent_70%)] opacity-30" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-accent-gold/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl animate-pulse" />

      <div className="glass-card w-full max-w-md relative z-10 border-white/20 p-10 space-y-8 animate-in zoom-in duration-500">
        <div className="text-center space-y-2">
          <div className="inline-flex p-4 rounded-2xl bg-accent-gold/10 text-accent-gold mb-4 border border-accent-gold/20">
            <ShieldAlert className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">Command Center</h1>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-[0.3em]">Restricted Access Only</p>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-lg text-rose-400 text-xs font-bold text-center animate-in shake duration-300">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-accent-gold transition-colors" />
              <input
                type="text"
                placeholder="OPERATOR ID"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white font-bold placeholder:text-slate-600 focus:ring-2 ring-accent-gold outline-none transition-all"
                required
              />
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-accent-gold transition-colors" />
              <input
                type="password"
                placeholder="ACCESS KEY"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white font-bold placeholder:text-slate-600 focus:ring-2 ring-accent-gold outline-none transition-all"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent-gold text-primary-blue py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-white transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Establish Connection'}
          </button>
        </form>

        <div className="pt-4 text-center">
          <a href="/" className="text-xs text-slate-500 hover:text-accent-gold transition-colors font-bold uppercase tracking-widest italic">
            &larr; Return to Public Sector
          </a>
        </div>
      </div>
    </div>
  );
}
