import { useState, useEffect } from 'react';
import { getMatches, saveMatch, deleteMatch, getTeams } from '../../api';
import { Plus, Edit3, Trash2, Camera, User, Calendar, MapPin, Save, X } from 'lucide-react';

export default function ManageFixtures() {
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentMatch, setCurrentMatch] = useState(null);
  const [activeYear, setActiveYear] = useState('2025');

  useEffect(() => {
    loadData();
  }, [activeYear]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [m, t] = await Promise.all([getMatches(activeYear), getTeams()]);
      setMatches(m);
      setTeams(t);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleAddNew = () => {
    setCurrentMatch({
      id: 'm' + Date.now(),
      matchNumber: '',
      date: new Date().toISOString().split('T')[0],
      venue: 'Village Ground',
      teamA: '',
      teamB: '',
      status: 'upcoming',
      resultText: '',
      photoUrl: null
    });
    setIsEditing(true);
  };

  const handleEdit = (match) => {
    setCurrentMatch(match);
    setIsEditing(true);
  };

  const getTeamName = (id) => teams.find(t => t.id === id)?.shortName || 'TBD';

  if (loading) return <div className="text-center py-20 animate-pulse text-accent-gold font-bold">Synchronizing Mission Logs...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">Strategic Fixtures</h1>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-widest italic">Maintain Tournament Timeline and Results</p>
        </div>
        <div className="flex gap-4">
           <select 
              value={activeYear} onChange={e => setActiveYear(e.target.value)}
              className="bg-slate-900 border border-white/10 rounded-xl px-4 py-2 font-bold text-accent-gold outline-none"
            >
              {['2025','2026','2027'].map(y => <option key={y} value={y}>Season {y}</option>)}
           </select>
           <button 
            onClick={handleAddNew}
            className="bg-accent-gold text-primary-blue px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-white transition-all shadow-lg shadow-accent-gold/10"
          >
            <Plus className="w-4 h-4" /> Deploy New Fixture
          </button>
        </div>
      </div>

      <div className="glass-card p-0 overflow-hidden border-white/5">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-[10px] font-black uppercase tracking-widest text-slate-500">
            <tr>
              <th className="px-6 py-5">Match Info</th>
              <th className="px-6 py-5">Battle</th>
              <th className="px-6 py-5">Status</th>
              <th className="px-6 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {matches.length > 0 ? matches.map(m => (
              <tr key={m.id} className="hover:bg-white/5 transition-colors group">
                <td className="px-6 py-6">
                  <div className="font-bold text-white uppercase italic tracking-tighter">{m.matchNumber || m.id}</div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{m.date} @ {m.venue}</div>
                </td>
                <td className="px-6 py-6">
                  <div className="flex items-center gap-3">
                    <span className="font-black text-accent-gold italic">{getTeamName(m.teamA)}</span>
                    <span className="text-[10px] text-slate-600 font-bold">VS</span>
                    <span className="font-black text-sky-400 italic">{getTeamName(m.teamB)}</span>
                  </div>
                </td>
                <td className="px-6 py-6 font-bold uppercase italic tracking-tight">
                  <span className={m.status === 'live' ? 'text-rose-500 animate-pulse' : (m.status === 'completed' ? 'text-emerald-500' : 'text-slate-400')}>
                    {m.status}
                  </span>
                </td>
                <td className="px-6 py-6 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => handleEdit(m)} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"><Edit3 className="w-4 h-4" /></button>
                    <button onClick={async () => {
                      if(window.confirm('Strike this fixture from the timeline?')) {
                        await deleteMatch(m.id);
                        loadData();
                      }
                    }} className="p-2 bg-white/5 hover:bg-rose-500/10 rounded-lg text-slate-400 hover:text-rose-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="4" className="px-6 py-20 text-center text-slate-500 italic">No fixtures detected in current sector.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {isEditing && currentMatch && (
        <FixtureEditor 
          match={currentMatch} 
          teams={teams}
          onClose={() => setIsEditing(false)} 
          onSave={loadData}
        />
      )}
    </div>
  );
}

function FixtureEditor({ match, teams, onClose, onSave }) {
  const [formData, setFormData] = useState(match);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, photoUrl: reader.result });
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary-blue/95 animate-in fade-in duration-300">
       <div className="glass-card w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0 border-white/20">
          <div className="p-6 border-b border-white/10 flex justify-between items-center bg-slate-900/50">
            <h2 className="text-2xl font-black text-accent-gold italic uppercase">Fixture Deployment: {formData.matchNumber || formData.id}</h2>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-slate-400"><X /></button>
          </div>

          <form className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
            <div className="grid md:grid-cols-2 gap-8">
               <div className="space-y-4">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Temporal & Spatial Data</label>
                  <input type="text" placeholder="MATCH IDENTIFIER (e.g. Semi Final 1)" value={formData.matchNumber} onChange={e => setFormData({...formData, matchNumber: e.target.value})} className="w-full bg-slate-900 border border-white/10 rounded-xl p-4 text-white font-bold outline-none ring-accent-gold focus:ring-2" />
                  <div className="grid grid-cols-2 gap-4">
                    <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="bg-slate-900 border border-white/10 rounded-xl p-4 text-white font-bold outline-none" />
                    <input type="text" placeholder="VENUE" value={formData.venue} onChange={e => setFormData({...formData, venue: e.target.value})} className="bg-slate-900 border border-white/10 rounded-xl p-4 text-white font-bold outline-none" />
                  </div>
               </div>

               <div className="space-y-4">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Combatants</label>
                  <div className="grid grid-cols-2 gap-4">
                    <select value={formData.teamA} onChange={e => setFormData({...formData, teamA: e.target.value})} className="bg-slate-900 border border-white/10 rounded-xl p-4 text-white font-bold">
                       <option value="">TEAM ALPHA</option>
                       {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                    <select value={formData.teamB} onChange={e => setFormData({...formData, teamB: e.target.value})} className="bg-slate-900 border border-white/10 rounded-xl p-4 text-white font-bold">
                       <option value="">TEAM BRAVO</option>
                       {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                  </div>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full bg-slate-900 border border-white/10 rounded-xl p-4 text-white font-bold">
                    <option value="upcoming">UPCOMING</option>
                    <option value="live">LIVE ACTION</option>
                    <option value="completed">MISSION COMPLETE</option>
                  </select>
               </div>
            </div>

            <div className="space-y-4">
               <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Mission Debrief (Results)</label>
               <input type="text" placeholder="RESULT TEXT (e.g. CSK WON BY 20 RUNS)" value={formData.resultText} onChange={e => setFormData({...formData, resultText: e.target.value})} className="w-full bg-slate-900 border border-white/10 rounded-xl p-4 text-white font-black italic tracking-tight outline-none focus:ring-2 ring-emerald-500" />
               
               <div className="flex items-center gap-6 p-6 border-2 border-dashed border-white/10 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors group cursor-pointer relative">
                  <div className="p-4 bg-slate-800 rounded-xl text-sky-400 group-hover:scale-110 transition-transform">
                    <Camera className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-black text-white uppercase tracking-tight">Match Evidence (Scorecard)</div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Upload verified match scorecard image (Base64)</div>
                  </div>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                  {formData.photoUrl && <div className="p-4 bg-emerald-500/20 text-emerald-500 rounded-lg font-black text-[10px] uppercase">EVIDENCE UPLOADED</div>}
               </div>
            </div>
          </form>

          <div className="p-6 bg-slate-900 flex justify-end gap-4 border-t border-white/10">
            <button onClick={onClose} className="px-8 py-3 rounded-lg font-bold text-slate-400 hover:text-white transition-colors">Abort</button>
            <button 
              type="button"
              onClick={async () => { 
                try {
                  await saveMatch(formData);
                  onSave(); 
                  onClose(); 
                } catch (err) { alert('Telemetric error during fixture data uplink.'); }
              }} 
              className="bg-emerald-600 text-white px-10 py-3 rounded-lg font-black uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-emerald-600/20"
            >
              <Save className="w-4 h-4" /> Finalize Record
            </button>
          </div>
       </div>
    </div>
  );
}
