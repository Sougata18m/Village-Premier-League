import { useState, useEffect } from 'react';
import { getStats } from '../api';
import { Target, Zap, TrendingUp } from 'lucide-react';

export default function Stats() {
  const [stats, setStats] = useState({ runs: [], wickets: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('runs');

  const loadStats = async () => {
    const data = await getStats();
    setStats(data || { runs: [], wickets: [] });
    setLoading(false);
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold text-accent-gold uppercase italic tracking-tighter">Performance Hub</h1>
        <p className="text-slate-400 font-medium">Tracking the tournament's top performers.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Top Run Getters */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black flex items-center gap-3 italic uppercase tracking-tight text-white">
            <Zap className="text-accent-gold w-6 h-6" /> Orange Cap Race
          </h2>
          
          <div className="glass-card p-0 overflow-hidden border-accent-gold/20 shadow-accent-gold/5">
            <table className="w-full text-left">
              <thead className="bg-accent-gold/10 text-[10px] font-black uppercase tracking-widest text-accent-gold">
                <tr>
                  <th className="px-6 py-4">Player</th>
                  <th className="px-6 py-4">Club</th>
                  <th className="px-6 py-4 text-right">Runs</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr><td colSpan="3" className="px-6 py-10 text-center animate-pulse text-slate-500">Syncing data...</td></tr>
                ) : stats.runs.length > 0 ? stats.runs.sort((a,b) => b.runs - a.runs).map((p, idx) => (
                  <StatRow key={p.name} player={p} value={p.runs} rank={idx + 1} />
                )) : (
                  <tr><td colSpan="3" className="px-6 py-10 text-center text-slate-500 italic">Statistic pending match results</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Wicket Takers */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black flex items-center gap-3 italic uppercase tracking-tight text-white">
            <Target className="text-sky-400 w-6 h-6" /> Purple Cap Race
          </h2>
          
          <div className="glass-card p-0 overflow-hidden border-sky-400/20 shadow-sky-400/5">
            <table className="w-full text-left">
              <thead className="bg-sky-400/10 text-[10px] font-black uppercase tracking-widest text-sky-400">
                <tr>
                  <th className="px-6 py-4">Player</th>
                  <th className="px-6 py-4">Club</th>
                  <th className="px-6 py-4 text-right">Wkts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr><td colSpan="3" className="px-6 py-10 text-center animate-pulse text-slate-500">Syncing data...</td></tr>
                ) : stats.wickets.length > 0 ? stats.wickets.sort((a,b) => b.wickets - a.wickets).map((p, idx) => (
                  <StatRow key={p.name} player={p} value={p.wickets} rank={idx + 1} highlightColor="text-sky-400" />
                )) : (
                  <tr><td colSpan="3" className="px-6 py-10 text-center text-slate-500 italic">Statistic pending match results</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="glass-card flex items-center gap-6 bg-gradient-to-r from-accent-gold/10 to-transparent border-accent-gold/10">
        <div className="p-4 rounded-full bg-accent-gold/20 text-accent-gold">
          <TrendingUp className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-lg font-black uppercase italic tracking-tight text-white">Tournament Momentum</h3>
          <p className="text-sm text-slate-400 max-w-xl italic">Stats are updated in real-time following the conclusion of each fixture by the VPL match commissioners.</p>
        </div>
      </div>
    </div>
  );
}

function StatRow({ player, value, rank, highlightColor = "text-accent-gold" }) {
  return (
    <tr className="hover:bg-white/5 transition-colors group">
      <td className="px-6 py-5">
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-black text-slate-600 w-4 tracking-tighter">{rank}</span>
          <span className="font-bold text-slate-200 group-hover:text-white transition-colors">{player.name}</span>
        </div>
      </td>
      <td className="px-6 py-5">
        <span className="text-xs font-black px-2 py-1 bg-white/5 rounded text-slate-400 uppercase tracking-widest group-hover:text-slate-200 transition-colors">
          {player.teamShort || player.team}
        </span>
      </td>
      <td className={`px-6 py-5 text-right font-black text-lg ${highlightColor} tabular-nums`}>
        {value}
      </td>
    </tr>
  );
}
