import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
});

export const getTeams = () => api.get('/teams').then(res => res.data);
export const saveTeam = (team) => api.post('/teams', team).then(res => res.data);
export const deleteTeam = (id) => api.delete(`/teams/${id}`).then(res => res.data);

export const getMatches = (year) => api.get('/matches', { params: { year } }).then(res => res.data);
export const saveMatch = (match) => api.post('/matches', match).then(res => res.data);
export const deleteMatch = (id) => api.delete(`/matches/${id}`).then(res => res.data);

export const getStats = () => api.get('/stats').then(res => res.data);
export const saveStats = (stats) => api.post('/stats', stats).then(res => res.data);

export const getStandings = (year) => api.get('/manual-points', { params: { year } }).then(res => res.data);
export const saveStandings = (year, tableData) => api.post('/manual-points', { year, tableData }).then(res => res.data);

export const login = (user, pass) => api.post('/auth/login', { user, pass }).then(res => {
  if (res.data.success) {
    localStorage.setItem('vpl_auth', 'true');
    localStorage.setItem('vpl_token', res.data.token);
  }
  return res.data;
});

export const logout = () => {
  localStorage.removeItem('vpl_auth');
  localStorage.removeItem('vpl_token');
};

export const isLoggedIn = () => {
  return localStorage.getItem('vpl_auth') === 'true';
};

export default api;
