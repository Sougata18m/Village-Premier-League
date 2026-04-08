import { useState, useEffect } from 'react';
import { getStats, saveStats, getTeams } from '../../api';
import { Save, Plus, Trash2, Zap, Target, Search } from 'lucide-react';

export default function ManageStats() {
  const [stats, setStats] = useState({ runs: [], wickets: [] });
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [s, t] = await Promise.all([getStats(), getTeams()]);
      setStats(s);
      setTeams(t);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleAddField = (type) => {
    setStats({
      ...stats,
      [type]: [...stats[type], { name: '', team: '', [type]: 0 }]
    });
  };

  const handleUpdate = (type, index, field, value) => {
    const newSection = [...stats[type]];
    newSection[index] = { ...newSection[index], [field]: value };
    setStats({ ...stats, [type]: newSection });
  };

  const handleRemove = (type, index) => {
    const newSection = stats[type].filter((_, i) => i !== index);
    setStats({ ...stats, [type]: newSection });
  };

  const handleSave = async () => {
    try {
      await saveStats(stats);
      alert('Global Stats Records Updated.');
    } catch (err) { console.error(err); }
  };

  if (loading) return <div className="text-center py-20 animate-pulse text-accent-gold font-bold">Synchronizing Player Analytics...</div>;

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">Performance Matrix</h1>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-widest italic">Manage Global Player Statistics</p>
        </div>
        <button 
          onClick={handleSave}
          className="bg-accent-gold text-primary-blue px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-white transition-all shadow-lg shadow-accent-gold/10"
        >
          <Save className="w-4 h-4" /> Commit Data
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Runs Section */}
        <section className="space-y-6">
          <div className="flex justify-between items-center bg-accent-gold/5 p-4 rounded-xl border border-accent-gold/10">
            <h2 className="text-lg font-black text-accent-gold uppercase italic flex items-center gap-2">
              <Zap className="w-5 h-5" /> Batting Leaderboard
            </h2>
            <button onClick={() => handleAddField('runs')} className="p-2 bg-accent-gold text-primary-blue rounded-lg hover:bg-white transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {stats.runs.map((row, idx) => (
              <StatEntry 
                key={idx} 
                data={row} 
                teams={teams} 
                valField="runs" 
                onUpdate={(f, v) => handleUpdate('runs', idx, f, v)}
                onRemove={() => handleRemove('runs', idx)}
              />
            ))}
          </div>
        </section>

        {/* Wickets Section */}
        <section className="space-y-6">
          <div className="flex justify-between items-center bg-sky-400/5 p-4 rounded-xl border border-sky-400/10">
            <h2 className="text-lg font-black text-sky-400 uppercase italic flex items-center gap-2">
              <Target className="w-5 h-5" /> Bowling Leaderboard
            </h2>
            <button onClick={() => handleAddField('wickets')} className="p-2 bg-sky-400 text-primary-blue rounded-lg hover:bg-white transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {stats.wickets.map((row, idx) => (
              <StatEntry 
                key={idx} 
                data={row} 
                teams={teams} 
                valField="wickets" 
                onUpdate={(f, v) => handleUpdate('wickets', idx, f, v)}
                onRemove={() => handleRemove('wickets', idx)}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function StatEntry({ data, teams, valField, onUpdate, onRemove }) {
  return (
    <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5 hover:border-white/10 transition-all">
      <div className="flex-1 space-y-1">
        <input 
          type="text" 
          placeholder="PLAYER NAME" 
          value={data.name} 
          onChange={e => onUpdate('name', e.target.value)}
          className="w-full bg-slate-900/50 border-none text-xs font-bold text-white placeholder:text-slate-600 focus:ring-0 rounded"
        />
        <select 
          value={data.team} 
          onChange={e => onUpdate('team', e.target.value)}
          className="w-full bg-transparent border-none text-[10px] font-bold text-slate-500 uppercase tracking-widest focus:ring-0 outline-none"
        >
          <option value="">SELECT CLUB</option>
          {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </div>

      <div className="flex items-center gap-3">
        <input 
          type="number" 
          value={data[valField]} 
          onChange={e => onUpdate(valField, e.target.value)}
          className="w-16 bg-white/5 border border-white/10 rounded-lg p-2 text-center font-black text-white focus:ring-1 ring-accent-gold"
        />
        <button onClick={onRemove} className="p-2 text-slate-600 hover:text-rose-500 transition-colors">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
