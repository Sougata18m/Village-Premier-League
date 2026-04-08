import { useState, useEffect } from 'react';
import { getTeams, getMatches } from '../../api';
import { Users, Calendar, Trophy, Zap } from 'lucide-react';

export default function DashboardOverview() {
  const [stats, setStats] = useState({
    teams: 0,
    matches: 0,
    liveMatches: 0,
    completedMatches: 0
  });

  useEffect(() => {
    async function loadData() {
      const [teams, matches] = await Promise.all([getTeams(), getMatches('2025')]);
      setStats({
        teams: teams.length,
        matches: matches.length,
        liveMatches: matches.filter(m => m.status === 'live').length,
        completedMatches: matches.filter(m => m.status === 'completed').length
      });
    }
    loadData();
  }, []);

  const cards = [
    { name: 'Total Franchises', value: stats.teams, icon: Users, color: 'text-accent-gold' },
    { name: 'Total Fixtures', value: stats.matches, icon: Calendar, color: 'text-sky-400' },
    { name: 'Live Actions', value: stats.liveMatches, icon: Zap, color: 'text-rose-500' },
    { name: 'Finished Games', value: stats.completedMatches, icon: Trophy, color: 'text-emerald-500' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="space-y-1">
        <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">Command Overview</h1>
        <p className="text-slate-500 text-sm font-bold uppercase tracking-widest italic">VPL Control Center Dashboard</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div key={card.name} className="glass-card flex flex-col items-center justify-center text-center space-y-3 p-8">
            <div className={`p-4 rounded-2xl bg-white/5 border border-white/5 ${card.color}`}>
              <card.icon className="w-8 h-8" />
            </div>
            <div className="text-3xl font-black text-white tabular-nums">{card.value}</div>
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{card.name}</div>
          </div>
        ))}
      </div>

      <div className="glass-card bg-gradient-to-br from-accent-gold/20 to-transparent border-accent-gold/20 p-8 space-y-4">
        <h2 className="text-xl font-black italic uppercase tracking-tighter text-white">System Protocol</h2>
        <p className="text-sm text-slate-300 leading-relaxed max-w-3xl italic">
          Welcome back, Commissioner. All match records, franchise registries, and tournament analytics are accessible via the secure protocols in the sidebar. Remember to update the Match Scorecards immediately after every fixture to ensure the global standings are synchronized.
        </p>
      </div>
    </div>
  );
}
