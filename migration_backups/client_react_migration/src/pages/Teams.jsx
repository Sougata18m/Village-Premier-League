import { useState, useEffect } from 'react';
import { getTeams } from '../api';
import { User, ChevronRight } from 'lucide-react';

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const activeYear = '2025'; // Mock for now

  useEffect(() => {
    getTeams().then(data => {
      setTeams(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="text-center py-20 text-accent-gold animate-pulse text-xl font-bold uppercase tracking-widest">Scouting Franchises...</div>;

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold text-accent-gold uppercase italic tracking-tighter">Franchises</h1>
        <p className="text-slate-400">Meet the powerhouses competing for the VPL title.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {teams.length > 0 ? teams.map(team => (
          <TeamCard key={team.id} team={team} onOpenSquad={() => setSelectedTeam(team)} activeYear={activeYear} />
        )) : (
          <div className="col-span-full py-20 text-center glass-card text-slate-500 italic">No teams registered for this season yet.</div>
        )}
      </div>

      {/* Squad Modal */}
      {selectedTeam && (
        <SquadModal 
          team={selectedTeam} 
          activeYear={activeYear} 
          onClose={() => setSelectedTeam(null)} 
        />
      )}
    </div>
  );
}

function TeamCard({ team, onOpenSquad, activeYear }) {
  const squads = team.squads || {};
  const activeSquad = squads[activeYear] || team.players || [];

  return (
    <div 
      className="glass-card flex flex-col items-center text-center relative overflow-hidden group transition-all"
      style={{ borderTop: `6px solid ${team.primaryColor || '#fbbf24'}` }}
    >
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors" />
      
      <div 
        className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/10 shadow-2xl mb-6 bg-slate-900 flex items-center justify-center text-2xl font-black group-hover:scale-105 transition-transform"
        style={{ color: team.primaryColor }}
      >
        {team.logo ? <img src={team.logo} alt={team.shortName} className="w-full h-full object-cover" /> : team.shortName}
      </div>

      <h2 className="text-2xl font-black mb-1 group-hover:text-accent-gold transition-colors">{team.name}</h2>
      <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] mb-8">Squad Size: {activeSquad.length}</p>

      <button 
        onClick={onOpenSquad}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all"
        style={{ backgroundColor: team.primaryColor, color: team.secondaryColor || '#0b1120' }}
      >
        Explore Squad <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

function SquadModal({ team, activeYear, onClose }) {
  const squads = team.squads || {};
  const squad = squads[activeYear] || team.players || [];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary-blue/95 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="glass-card w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col p-0 border-white/20">
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-slate-900/50">
          <div>
            <h2 className="text-2xl font-black text-accent-gold italic uppercase">{team.name}</h2>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Season {activeYear} Roster</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white">
            <User className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {squad.length > 0 ? squad.map((player, idx) => {
            const p = typeof player === 'string' ? { name: player, runs: 0, wickets: 0 } : player;
            return (
              <div key={idx} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/20 transition-all group">
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-xl border border-white/10 shadow-inner group-hover:border-accent-gold transition-colors">
                  {p.image ? <img src={p.image} className="w-full h-full rounded-full object-cover" /> : '👤'}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg group-hover:text-accent-gold transition-colors">{p.name}</h3>
                  <div className="flex gap-4 mt-1 text-[10px] font-black uppercase tracking-widest text-slate-500">
                    <span className="flex items-center gap-1 group-hover:text-slate-300">Runs: <b className="text-white">{p.runs || 0}</b></span>
                    <span className="flex items-center gap-1 group-hover:text-slate-300">Wkt: <b className="text-white">{p.wickets || 0}</b></span>
                  </div>
                </div>
              </div>
            );
          }) : (
            <div className="text-center py-10 text-slate-500">No players listed for this season.</div>
          )}
        </div>

        <div className="p-4 bg-slate-900/80 border-t border-white/10 text-center">
          <button onClick={onClose} className="w-full py-3 font-bold uppercase tracking-widest text-xs text-slate-400 hover:text-white transition-colors">Close Roster</button>
        </div>
      </div>
    </div>
  );
}
