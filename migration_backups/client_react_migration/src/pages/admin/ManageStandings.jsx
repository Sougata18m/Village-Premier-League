import { useState, useEffect } from 'react';
import { getStandings, saveStandings, getTeams } from '../../api';
import { Save, Trophy, ShieldAlert } from 'lucide-react';

export default function ManageStandings() {
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeYear, setActiveYear] = useState('2025');

  useEffect(() => {
    loadData();
  }, [activeYear]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [raw, teams] = await Promise.all([
        getStandings(activeYear),
        getTeams()
      ]);

      // Initialize with all teams if data is missing
      const fullData = teams.map(t => {
        const entry = raw.find(e => e.id === t.id) || { 
          id: t.id, p: 0, w: 0, l: 0, t: 0, nr: 0, pts: 0, nrr: 0 
        };
        return { ...entry, name: t.name, shortName: t.shortName };
      });

      setStandings(fullData);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleUpdate = (id, field, value) => {
    setStandings(prev => prev.map(row => 
      row.id === id ? { ...row, [field]: value } : row
    ));
  };

  const handleSave = async () => {
    try {
      await saveStandings(activeYear, standings);
      alert('Standings Synchronized with Command Center.');
    } catch (err) {
      alert('Failed to transmit standings data.');
    }
  };

  if (loading) return <div className="text-center py-20 animate-pulse text-accent-gold font-black italic">Recalculating League Dynamics...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">Standings Override</h1>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-widest italic">Manual Point Distribution Control</p>
        </div>
        <div className="flex gap-4">
           <select 
              value={activeYear} onChange={e => setActiveYear(e.target.value)}
              className="bg-slate-900 border border-white/10 rounded-xl px-4 py-2 font-bold text-accent-gold outline-none"
            >
              {['2025','2026','2027'].map(y => <option key={y} value={y}>Season {y}</option>)}
           </select>
           <button 
            onClick={handleSave}
            className="bg-accent-gold text-primary-blue px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-white transition-all shadow-lg shadow-accent-gold/10"
          >
            <Save className="w-4 h-4" /> Finalize Table
          </button>
        </div>
      </div>

      <div className="glass-card p-0 overflow-hidden border-rose-500/20">
         <div className="p-4 bg-rose-500/5 border-b border-rose-500/10 flex items-center gap-3 text-rose-400">
            <ShieldAlert className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-widest italic">Manual Override Mode: Direct Value Manipulation Enabled</span>
         </div>
         <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left">
              <thead className="bg-white/5 text-[10px] font-black uppercase tracking-widest text-slate-500">
                <tr>
                  <th className="px-6 py-5">Franchise</th>
                  <th className="px-3 py-5 text-center">P</th>
                  <th className="px-3 py-5 text-center">W</th>
                  <th className="px-3 py-5 text-center">L</th>
                  <th className="px-3 py-5 text-center">T/NR</th>
                  <th className="px-3 py-5 text-center">Pts</th>
                  <th className="px-6 py-5 text-center">NRR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {standings.map(row => (
                  <tr key={row.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-5">
                      <div className="font-bold text-white">{row.name}</div>
                      <div className="text-[10px] text-slate-600 font-bold uppercase">{row.shortName}</div>
                    </td>
                    <td className="px-3 py-5">
                      <input type="number" value={row.p} onChange={e => handleUpdate(row.id, 'p', e.target.value)} className="w-12 bg-slate-800 border-none rounded p-1 text-center font-bold" />
                    </td>
                    <td className="px-3 py-5">
                      <input type="number" value={row.w} onChange={e => handleUpdate(row.id, 'w', e.target.value)} className="w-12 bg-slate-800 border-none rounded p-1 text-center font-bold text-emerald-400" />
                    </td>
                    <td className="px-3 py-5">
                      <input type="number" value={row.l} onChange={e => handleUpdate(row.id, 'l', e.target.value)} className="w-12 bg-slate-800 border-none rounded p-1 text-center font-bold text-rose-400" />
                    </td>
                    <td className="px-3 py-5 flex items-center gap-1 justify-center">
                      <input type="number" title="Ties" value={row.t} onChange={e => handleUpdate(row.id, 't', e.target.value)} className="w-10 bg-slate-800 border-none rounded p-1 text-center font-bold text-slate-400" />
                      <span className="text-slate-700">/</span>
                      <input type="number" title="No Result" value={row.nr} onChange={e => handleUpdate(row.id, 'nr', e.target.value)} className="w-10 bg-slate-800 border-none rounded p-1 text-center font-bold text-slate-400" />
                    </td>
                    <td className="px-3 py-5">
                      <input type="number" value={row.pts} onChange={e => handleUpdate(row.id, 'pts', e.target.value)} className="w-14 bg-accent-gold/10 border-none rounded p-1 text-center font-black text-accent-gold" />
                    </td>
                    <td className="px-6 py-5">
                      <input type="number" step="0.001" value={row.nrr} onChange={e => handleUpdate(row.id, 'nrr', e.target.value)} className="w-24 bg-slate-800 border-none rounded p-1 text-center font-bold" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
