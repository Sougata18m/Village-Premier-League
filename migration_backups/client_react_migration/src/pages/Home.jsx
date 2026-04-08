import { useState, useEffect } from 'react';
import { getMatches, getTeams, getStandings, getStats } from '../api';
import { Trophy, Calendar, Zap } from 'lucide-react';

export default function Home() {
  const [featuredMatch, setFeaturedMatch] = useState(null);
  const [standings, setStandings] = useState([]);
  const [teams, setTeams] = useState([]);
  const [topTeams, setTopTeams] = useState([]);
  const [stats, setStats] = useState({ runs: [], wickets: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [allMatches, allTeams, allStandings, allStats] = await Promise.all([
          getMatches('2025'),
          getTeams(),
          getStandings('2025'),
          getStats()
        ]);

        setTeams(allTeams);
        setTopTeams(Array.isArray(allStandings) ? allStandings.slice(0, 3) : []);
        setStats(allStats || { runs: [], wickets: [] });
        
        // Find featured match (Live or most recent upcoming)
        let featured = allMatches.find(m => m.status === 'live') || 
                       allMatches.find(m => m.status === 'upcoming');
        if (!featured && allMatches.length > 0) featured = allMatches[allMatches.length - 1];
        setFeaturedMatch(featured);

        // Process standings with team info
        const topStandings = allStandings.slice(0, 3).map(entry => {
          const team = allTeams.find(t => t.id === entry.id) || {};
          return { ...entry, ...team };
        });
        setStandings(topStandings);
      } catch (err) {
        console.error("Failed to load home data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const getTeamInfo = (id) => teams.find(t => t.id === id) || { name: 'TBD', shortName: 'TBD', primaryColor: '#94a3b8' };

  if (loading) return <div className="text-center py-20 animate-pulse text-accent-gold">Loading VPL Action...</div>;

  return (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-5xl md:text-7xl font-extrabold text-accent-gold tracking-tighter uppercase italic">
          Village Premier League
        </h1>
        <p className="text-slate-400 text-lg md:text-xl font-medium tracking-wide">
          Experience the thrill of local cricket in high definition.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Featured Match */}
        <div className="glass-card animate-in slide-in-from-left duration-1000">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Zap className="text-accent-gold w-6 h-6" /> Featured Match
            </h2>
            {featuredMatch?.status === 'live' && (
              <span className="badge bg-red-600 text-white animate-pulse">Live</span>
            )}
            {featuredMatch?.status === 'upcoming' && (
              <span className="badge bg-accent-gold text-primary-blue">Upcoming</span>
            )}
          </div>

          {featuredMatch ? (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <TeamDisplay team={getTeamInfo(featuredMatch.teamA)} />
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-black italic text-sm italic">VS</div>
                  <span className="text-[10px] text-slate-500 mt-2 uppercase tracking-[0.2em]">Match {featuredMatch.id}</span>
                </div>
                <TeamDisplay team={getTeamInfo(featuredMatch.teamB)} />
              </div>

              <div className="bg-black/40 border border-white/5 rounded-xl p-6 text-center shadow-inner">
                <p className="text-xl font-bold text-white mb-2 italic">
                  {featuredMatch.resultText || (featuredMatch.status === 'upcoming' ? 'Countdown to toss' : 'In Progress')}
                </p>
                <div className="flex items-center justify-center gap-4 text-xs text-slate-400 uppercase tracking-widest">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {featuredMatch.date}</span>
                  <span>•</span>
                  <span>{featuredMatch.venue || 'VPL Ground'}</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-slate-500 text-center py-10 italic">No scheduled matches at the moment.</p>
          )}
        </div>

        {/* Standings Snippet */}
        <div className="glass-card animate-in slide-in-from-right duration-1000">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Trophy className="text-accent-gold w-6 h-6" /> Top Standings
            </h2>
            <a href="/standings" className="text-accent-gold text-xs font-bold uppercase hover:underline">Full Table</a>
          </div>

          <div className="overflow-hidden rounded-xl border border-white/5">
            <table className="w-full text-left">
              <thead className="bg-white/5 text-[10px] uppercase tracking-widest text-slate-400">
                <tr>
                  <th className="px-6 py-4">Club</th>
                  <th className="px-6 py-4">Pts</th>
                  <th className="px-6 py-4">NRR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {standings.length > 0 ? standings.map((row, idx) => (
                  <tr key={row.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-1.5 h-6 rounded-full" 
                          style={{ backgroundColor: row.primaryColor }}
                        />
                        <span className="font-bold group-hover:text-accent-gold transition-colors">{row.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-black text-accent-gold">{row.pts}</td>
                    <td className="px-6 py-4 text-slate-400 font-medium tabular-nums text-sm">
                      {row.nrr > 0 ? '+' : ''}{Number(row.nrr).toFixed(3)}
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="3" className="px-6 py-20 text-center text-slate-600 italic">No rankings established in this sector yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function TeamDisplay({ team }) {
  return (
    <div className="flex flex-col items-center gap-4 group">
      <div 
        className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-black border-4 shadow-2xl transition-transform group-hover:scale-110"
        style={{ 
          backgroundColor: team.primaryColor, 
          color: team.secondaryColor || '#fff',
          borderColor: 'rgba(255,255,255,0.1)'
        }}
      >
        {team.logo ? <img src={team.logo} alt={team.shortName} className="w-full h-full rounded-full object-cover" /> : team.shortName}
      </div>
      <span className="font-extrabold text-lg tracking-tight uppercase tracking-widest">{team.shortName}</span>
    </div>
  );
}
