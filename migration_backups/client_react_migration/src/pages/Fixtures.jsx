import { useState, useEffect } from 'react';
import { getMatches, getTeams } from '../api';
import { MapPin, Clock, Camera } from 'lucide-react';

export default function Fixtures() {
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeYear, setActiveYear] = useState('2025');
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const years = ['2025', '2026', '2027']; // Logic from store.js can be simplified here

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [m, t] = await Promise.all([getMatches(activeYear), getTeams()]);
        setMatches(m);
        setTeams(t);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [activeYear]);

  const getTeam = (id) => teams.find(t => t.id === id) || { name: 'TBD', shortName: 'TBD', primaryColor: '#475569' };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold text-accent-gold uppercase italic tracking-tighter">Match Center</h1>
          <p className="text-slate-400 font-medium">Fixtures, schedules, and live results.</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-black uppercase tracking-widest text-slate-500">Season:</span>
          <select 
            value={activeYear} 
            onChange={(e) => setActiveYear(e.target.value)}
            className="bg-slate-800 border border-white/10 rounded-lg px-4 py-2 font-bold text-accent-gold focus:ring-2 ring-accent-gold outline-none"
          >
            {years.map(y => <option key={y} value={y}>Season {y}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-accent-gold animate-bounce font-black text-xl uppercase tracking-tighter italic">Updating Scoreboard...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {matches.length > 0 ? matches.map(match => (
            <MatchRow 
              key={match.id} 
              match={match} 
              teamA={getTeam(match.teamA)} 
              teamB={getTeam(match.teamB)} 
              onViewPhoto={(url) => setSelectedPhoto(url)} 
            />
          )) : (
            <div className="col-span-full py-20 text-center glass-card text-slate-500 italic">No matches scheduled for this season.</div>
          )}
        </div>
      )}

      {/* Photo Modal */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 animate-in fade-in duration-300"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center">
            <button className="absolute -top-12 right-0 text-white text-4xl hover:text-accent-gold">&times;</button>
            <img src={selectedPhoto} alt="Scorecard" className="max-w-full max-h-full rounded-lg shadow-2xl shadow-sky-900/20 object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}

function MatchRow({ match, teamA, teamB, onViewPhoto }) {
  const getStatusBadge = (status) => {
    switch(status) {
      case 'live': return <span className="badge bg-red-600 animate-pulse">Live Now</span>;
      case 'upcoming': return <span className="badge bg-accent-gold text-primary-blue">Scheduled</span>;
      default: return <span className="badge bg-emerald-600">Finished</span>;
    }
  };

  return (
    <div className="glass-card p-0 overflow-hidden group hover:border-accent-gold/30">
      <div className="p-4 bg-white/5 flex justify-between items-center border-b border-white/5">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Match {match.matchNumber || match.id} • {match.date}</span>
        {getStatusBadge(match.status)}
      </div>

      <div className="p-8 flex items-center justify-between gap-4">
        <FixtureTeam team={teamA} />
        <div className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center font-black italic text-xs shadow-inner">VS</div>
        </div>
        <FixtureTeam team={teamB} side="right" />
      </div>

      <div className="px-8 pb-8">
        <div className="bg-black/40 rounded-xl p-5 border border-white/5 text-center group-hover:bg-black/60 transition-colors">
          <p className="text-white font-black text-lg group-hover:text-accent-gold transition-colors italic">
            {match.resultText || (match.status === 'upcoming' ? 'Awaiting Toss' : 'Match in Progress')}
          </p>
          <div className="flex items-center justify-center gap-6 mt-4 opacity-50 text-[10px] font-bold uppercase tracking-widest group-hover:opacity-80 transition-opacity">
            <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-accent-gold" /> {match.venue || 'VPL Main Ground'}</span>
            <span className="flex items-center gap-1.5"><Clock className="w-3 h-3 text-sky-400" /> 2:30 PM IST</span>
          </div>
        </div>
        
        {match.photoUrl && (
          <button 
            onClick={() => onViewPhoto(match.photoUrl)}
            className="w-full mt-4 py-3 rounded-lg bg-sky-600/10 border border-sky-500/20 text-sky-400 text-[10px] font-black uppercase tracking-widest hover:bg-sky-600/20 transition-all flex items-center justify-center gap-2"
          >
            <Camera className="w-4 h-4" /> View Match Scorecard
          </button>
        )}
      </div>
    </div>
  );
}

function FixtureTeam({ team, side = 'left' }) {
  return (
    <div className={`flex items-center gap-6 flex-1 ${side === 'right' ? 'flex-row-reverse text-right' : ''}`}>
      <div 
        className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-black shadow-lg"
        style={{ backgroundColor: team.primaryColor, color: team.secondaryColor || '#fff', border: '3px solid rgba(255,255,255,0.1)' }}
      >
        {team.logo ? <img src={team.logo} className="w-full h-full rounded-full object-cover" /> : team.shortName}
      </div>
      <div className="flex flex-col">
        <span className="font-extrabold text-xl tracking-tighter uppercase italic">{team.shortName}</span>
        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest hidden sm:block">{team.name}</span>
      </div>
    </div>
  );
}
