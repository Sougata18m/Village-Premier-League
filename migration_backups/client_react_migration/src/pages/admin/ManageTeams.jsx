import { useState, useEffect } from 'react';
import { getTeams, saveTeam, deleteTeam } from '../../api';
import { Plus, Edit2, Trash2, X, Save, UserPlus } from 'lucide-react';

export default function ManageTeams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTeam, setCurrentTeam] = useState(null);

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      const data = await getTeams();
      setTeams(data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleEdit = (team) => {
    setCurrentTeam(team);
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setCurrentTeam({
      id: 't' + Date.now(),
      name: '',
      shortName: '',
      primaryColor: '#fbbf24',
      secondaryColor: '#0b1120',
      logo: '',
      players: []
    });
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Scuttle this franchise? This action is irreversible.')) {
      try {
        await deleteTeam(id);
        loadTeams();
      } catch (err) { alert('Failed to eliminate franchise.'); }
    }
  };

  if (loading) return <div className="text-center py-20 animate-pulse text-accent-gold font-bold italic">Accessing Franchise Databases...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">Franchise Registry</h1>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-widest italic">Manage VPL Teams and Rosters</p>
        </div>
        <button 
          onClick={handleAddNew}
          className="bg-accent-gold text-primary-blue px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-white transition-all shadow-lg shadow-accent-gold/10"
        >
          <Plus className="w-4 h-4" /> Recruit New Team
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map(team => (
          <div key={team.id} className="glass-card flex flex-col items-center text-center group border-white/5 hover:border-accent-gold/20 transition-all">
            <div 
              className="w-20 h-20 rounded-full flex items-center justify-center text-xl font-black mb-4 border-2 shadow-inner"
              style={{ backgroundColor: team.primaryColor, color: team.secondaryColor, borderColor: 'rgba(255,255,255,0.1)' }}
            >
              {team.logo ? <img src={team.logo} className="w-full h-full rounded-full object-cover" /> : team.shortName}
            </div>
            <h3 className="text-xl font-black group-hover:text-accent-gold transition-colors">{team.name}</h3>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1 mb-6">ID: {team.id}</p>
            
            <div className="flex gap-2 w-full">
              <button 
                onClick={() => handleEdit(team)}
                className="flex-1 bg-white/5 hover:bg-white/10 p-3 rounded-lg text-slate-400 hover:text-sky-400 transition-all flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest"
              >
                <Edit2 className="w-3 h-3" /> Edit
              </button>
              <button 
                onClick={() => handleDelete(team.id)}
                className="bg-white/5 hover:bg-rose-500/10 p-3 rounded-lg text-slate-400 hover:text-rose-400 transition-all flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest"
              >
                <Trash2 className="w-3 h-3" /> Scuttle
              </button>
            </div>
          </div>
        ))}
      </div>

      {isEditing && currentTeam && (
        <TeamEditor 
          team={currentTeam} 
          onClose={() => setIsEditing(false)} 
          onSave={loadTeams}
        />
      )}
    </div>
  );
}

function TeamEditor({ team, onClose, onSave }) {
  const [formData, setFormData] = useState(team);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await saveTeam(formData);
      onSave();
      onClose();
    } catch (err) {
      alert('Strategic error during franchise deployment.');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary-blue/95 animate-in fade-in duration-300">
      <div className="glass-card w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0 border-white/20">
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-slate-900/50">
          <h2 className="text-2xl font-black text-accent-gold italic uppercase">Franchise Profile: {formData.name || 'New Team'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-slate-400"><X /></button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">General Information</label>
              <input 
                type="text" placeholder="FULL TEAM NAME" 
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-slate-900 border border-white/10 rounded-xl p-4 text-white font-bold outline-none focus:ring-2 ring-accent-gold"
              />
              <input 
                type="text" placeholder="SHORT CODE (e.g. CSK)" 
                value={formData.shortName} onChange={e => setFormData({...formData, shortName: e.target.value})}
                className="w-full bg-slate-900 border border-white/10 rounded-xl p-4 text-white font-bold outline-none focus:ring-2 ring-accent-gold"
              />
            </div>

            <div className="space-y-4">
               <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Brand Identity</label>
               <div className="flex gap-4">
                  <div className="flex-1 space-y-2">
                    <span className="text-[10px] text-slate-600 font-bold uppercase">Primary</span>
                    <input type="color" value={formData.primaryColor} onChange={e => setFormData({...formData, primaryColor: e.target.value})} className="w-full h-12 bg-transparent border-none outline-none cursor-pointer" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <span className="text-[10px] text-slate-600 font-bold uppercase">Secondary</span>
                    <input type="color" value={formData.secondaryColor} onChange={e => setFormData({...formData, secondaryColor: e.target.value})} className="w-full h-12 bg-transparent border-none outline-none cursor-pointer" />
                  </div>
               </div>
               <input 
                type="text" placeholder="LOGO URL (Base64)" 
                value={formData.logo} onChange={e => setFormData({...formData, logo: e.target.value})}
                className="w-full bg-slate-900 border border-white/10 rounded-xl p-4 text-[10px] text-slate-400 font-bold outline-none"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Roster Management ({formData.players?.length || 0})</label>
              <button 
                type="button" 
                onClick={() => setFormData({...formData, players: [...(formData.players || []), "New Player"]})}
                className="text-sky-400 text-[10px] font-black uppercase flex items-center gap-1 hover:text-white"
              >
                <UserPlus className="w-3 h-3" /> Add Player
              </button>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
               {formData.players?.map((p, i) => (
                 <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                   <input 
                      type="text" 
                      value={typeof p === 'string' ? p : p.name} 
                      onChange={e => {
                        const newPlayers = [...formData.players];
                        newPlayers[i] = e.target.value;
                        setFormData({...formData, players: newPlayers});
                      }}
                      className="bg-transparent border-none text-sm font-bold w-full outline-none focus:text-accent-gold" 
                   />
                   <button 
                    type="button" 
                    onClick={() => {
                      const newPlayers = formData.players.filter((_, idx) => idx !== i);
                      setFormData({...formData, players: newPlayers});
                    }}
                    className="text-slate-600 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                 </div>
               ))}
            </div>
          </div>
        </form>

        <div className="p-6 bg-slate-900 flex justify-end gap-4 border-t border-white/10">
          <button onClick={onClose} className="px-8 py-3 rounded-lg font-bold text-slate-400 hover:text-white transition-colors">Discard Changes</button>
          <button onClick={handleSubmit} className="bg-accent-gold text-primary-blue px-10 py-3 rounded-lg font-black uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-accent-gold/20">
            <Save className="w-4 h-4" /> Save Franchise
          </button>
        </div>
      </div>
    </div>
  );
}
