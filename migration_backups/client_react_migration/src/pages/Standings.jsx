import { useState, useEffect } from 'react';
import { getStandings, getTeams } from '../api';
import { Trophy, ChevronUp, ChevronDown } from 'lucide-react';

export default function Standings() {
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeYear, setActiveYear] = useState('2025');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [rawStandings, teams] = await Promise.all([
          getStandings(activeYear),
          getTeams()
        ]);

        const fullData = rawStandings.map(entry => {
          const team = teams.find(t => t.id === entry.id) || {};
          return { ...entry, ...team };
        });

        // Sort: Points DESC, NRR DESC
        fullData.sort((a, b) => {
          if (b.pts !== a.pts) return b.pts - a.pts;
          return b.nrr - a.nrr;
        });

        setStandings(fullData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [activeYear]);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold text-accent-gold uppercase italic tracking-tighter">Standings</h1>
          <p className="text-slate-400 font-medium">Tournament leaderboard and qualification race.</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-black uppercase tracking-widest text-slate-500">Season:</span>
          <select 
            value={activeYear} 
            onChange={(e) => setActiveYear(e.target.value)}
            className="bg-slate-800 border border-white/10 rounded-lg px-4 py-2 font-bold text-accent-gold outline-none focus:ring-2 ring-accent-gold"
          >
            {['2025', '2026', '2027'].map(y => <option key={y} value={y}>Season {y}</option>)}
          </select>
        </div>
      </div>

      <div className="glass-card p-0 overflow-hidden border-white/5">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white/5 text-[10px] font-black uppercase tracking-widest text-slate-500">
              <tr>
                <th className="px-6 py-5">#</th>
                <th className="px-6 py-5">Team</th>
                <th className="px-6 py-5 text-center">P</th>
                <th className="px-6 py-5 text-center">W</th>
                <th className="px-6 py-5 text-center">L</th>
                <th className="px-6 py-5 text-center">T/NR</th>
                <th className="px-6 py-5 text-center">Pts</th>
                <th className="px-6 py-5 text-center">NRR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-20 text-center text-accent-gold font-bold italic animate-pulse">
                    Calculating Tournament Math...
                  </td>
                </tr>
              ) : standings.length > 0 ? standings.map((row, idx) => (
                <tr key={row.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-6 font-black text-slate-600 group-hover:text-accent-gold">{idx + 1}</td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center font-black text-xs border border-white/10 shadow-lg"
                        style={{ backgroundColor: row.primaryColor, color: row.secondaryColor || '#fff' }}
                      >
                        {row.logo ? <img src={row.logo} className="w-full h-full rounded-full object-cover" /> : row.shortName}
                      </div>
                      <div>
                        <span className="font-bold text-lg group-hover:text-accent-gold transition-colors">{row.name}</span>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{row.shortName}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-center font-bold">{row.p}</td>
                  <td className="px-6 py-6 text-center font-bold text-emerald-500">{row.w}</td>
                  <td className="px-6 py-6 text-center font-bold text-rose-500">{row.l}</td>
                  <td className="px-6 py-6 text-center font-bold text-slate-400">{Number(row.t || 0) + Number(row.nr || 0)}</td>
                  <td className="px-6 py-6 text-center">
                    <span className="inline-block px-3 py-1 bg-accent-gold text-primary-blue rounded font-black text-sm shadow-lg shadow-accent-gold/10">
                      {row.pts}
                    </span>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <div className="flex flex-col items-center">
                      <span className={`font-black tracking-tighter ${row.nrr > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {row.nrr > 0 ? <ChevronUp className="inline w-3 h-3 mb-1" /> : <ChevronDown className="inline w-3 h-3 mb-1" />}
                        {Math.abs(row.nrr).toFixed(3)}
                      </span>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="8" className="px-6 py-20 text-center text-slate-500 italic">
                    Tournament hasn't started yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-4">
        <h3 className="text-xs font-black uppercase tracking-widest text-accent-gold flex items-center gap-2">
          <Trophy className="w-4 h-4" /> Qualification Rules
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed italic">
          Teams are ranked by points. In case of a tie, Net Run Rate (NRR) is used. The top 4 teams at the end of the league stage progress to the playoffs. Win = 2 pts, Tie/NR = 1 pt, Loss = 0 pts.
        </p>
      </div>
    </div>
  );
}
