// Simple localStorage-based Store for the VPL application

const defaultTeams = [];

const defaultMatches = [];
/* 
Match object structure:
{
    id: 'm1',
    matchNumber: 'Match 1',
    date: '2026-04-10',
    venue: 'Village Ground',
    teamA: 't1',
    teamB: 't2',
    status: 'upcoming', // 'upcoming', 'live', 'completed'
    photoUrl: null, // Base64 string for scorecard photo
    resultText: '', // "CSK won by 5 wickets"
    winner: null // To keep point table working
}
*/

const defaultStats = {
    runs: [], // { name: 'Player X', team: 't1', runs: 0 }
    wickets: [] // { name: 'Player Y', team: 't2', wickets: 0 }
};

window.Store = {
    init() {
        if (!localStorage.getItem('vpl_cleared_dummy_2')) {
            localStorage.removeItem('vpl_teams');
            localStorage.removeItem('vpl_matches');
            localStorage.removeItem('vpl_stats');
            localStorage.setItem('vpl_cleared_dummy_2', 'true');
        }

        if (!localStorage.getItem('vpl_teams')) {
            localStorage.setItem('vpl_teams', JSON.stringify(defaultTeams));
        }
        if (!localStorage.getItem('vpl_matches')) {
            localStorage.setItem('vpl_matches', JSON.stringify(defaultMatches));
        }
        if (!localStorage.getItem('vpl_stats')) {
            localStorage.setItem('vpl_stats', JSON.stringify(defaultStats));
        }

        // Initialize Season UI automatically when Store is loaded
        setTimeout(() => this.injectSeasonSelector(), 0);
    },

    // Season / Year Filtering
    getAvailableYears() {
        const years = [];
        for (let y = 2025; y <= 2050; y++) {
            years.push(y.toString());
        }
        return years.reverse(); // descending: 2050 down to 2025
    },
    getActiveYear() {
        let active = sessionStorage.getItem('vpl_active_year');
        if (!active) {
            active = '2025';
            sessionStorage.setItem('vpl_active_year', active);
        }
        return active;
    },
    setActiveYear(year) {
        sessionStorage.setItem('vpl_active_year', year);
        window.location.reload();
    },
    injectSeasonSelector() {
        const navs = document.querySelectorAll('header nav, .admin-sidebar nav.admin-nav:first-of-type');
        if (navs.length === 0) return;
        
        const years = this.getAvailableYears();
        const active = this.getActiveYear();
        
        const selectHTML = `
            <select id="vpl-season-selector" style="background: rgba(0,0,0,0.2); color: var(--accent-gold); border: 1px solid var(--accent-gold); border-radius: 4px; padding: 0.3rem; margin-left: 1rem; font-weight: bold; cursor: pointer;" onchange="Store.setActiveYear(this.value)">
                ${years.map(y => `<option value="${y}" ${y === active ? 'selected' : ''}>Season ${y}</option>`).join('')}
            </select>
        `;
        
        navs.forEach(nav => {
            // Check if already injected
            if (!nav.querySelector('#vpl-season-selector')) {
                // If the nav is a flex container, appending is easy
                nav.insertAdjacentHTML('beforeend', selectHTML);
            }
        });
    },

    // Teams
    getTeams() {
        return JSON.parse(localStorage.getItem('vpl_teams'));
    },
    saveTeam(team) {
        const teams = this.getTeams();
        const idx = teams.findIndex(t => t.id === team.id);
        if (idx !== -1) {
            teams[idx] = team;
        } else {
            teams.push(team);
        }
        localStorage.setItem('vpl_teams', JSON.stringify(teams));
    },
    deleteTeam(id) {
        const teams = this.getTeams().filter(t => t.id !== id);
        localStorage.setItem('vpl_teams', JSON.stringify(teams));
    },

    // Matches
    getMatches(year = this.getActiveYear()) {
        let matches = JSON.parse(localStorage.getItem('vpl_matches')) || [];
        // Sort descending (newest first)
        matches.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        if (year && year !== 'All') {
            matches = matches.filter(m => new Date(m.date).getFullYear().toString() === year.toString());
        }
        return matches;
    },
    saveMatch(match) {
        const matches = JSON.parse(localStorage.getItem('vpl_matches'));
        const idx = matches.findIndex(m => m.id === match.id);
        if (idx !== -1) {
            matches[idx] = match;
        } else {
            matches.push(match);
        }
        localStorage.setItem('vpl_matches', JSON.stringify(matches));
    },
    deleteMatch(id) {
        const matches = JSON.parse(localStorage.getItem('vpl_matches')).filter(m => m.id !== id);
        localStorage.setItem('vpl_matches', JSON.stringify(matches));
    },

    // Stats
    getStats() {
        return JSON.parse(localStorage.getItem('vpl_stats'));
    },
    saveStats(stats) {
        localStorage.setItem('vpl_stats', JSON.stringify(stats));
    },

    // Points Table Engine - Manual Management
    getManualPoints(year = this.getActiveYear()) {
        const data = JSON.parse(localStorage.getItem('vpl_manual_points')) || {};
        return data[year] || [];
    },

    saveManualPoints(year, tableData) {
        const data = JSON.parse(localStorage.getItem('vpl_manual_points')) || {};
        data[year] = tableData.map(e => ({
            id: e.id,
            p: Number(e.p) || 0,
            w: Number(e.w) || 0,
            l: Number(e.l) || 0,
            t: Number(e.t) || 0,
            nr: Number(e.nr) || 0,
            pts: Number(e.pts) || 0,
            nrr: Number(e.nrr) || 0
        }));
        localStorage.setItem('vpl_manual_points', JSON.stringify(data));
    },

    getPointsTable(year = this.getActiveYear()) {
        const manualData = this.getManualPoints(year);
        const teams = this.getTeams();
        
        let table = teams.map(t => {
            const entry = manualData.find(e => e.id === t.id) || { 
                id: t.id, p: 0, w: 0, l: 0, t: 0, nr: 0, pts: 0, nrr: 0 
            };
            return { 
                ...entry, 
                name: t.name, 
                shortName: t.shortName, 
                logo: t.logo,
                primaryColor: t.primaryColor,
                secondaryColor: t.secondaryColor,
                nrrDisplay: (Number(entry.nrr) > 0 ? '+' : '') + Number(entry.nrr).toFixed(3)
            };
        });

        // Sort by Points (DESC), then NRR (DESC)
        return table.sort((a, b) => {
            if (Number(b.pts) !== Number(a.pts)) return Number(b.pts) - Number(a.pts);
            return Number(b.nrr) - Number(a.nrr);
        });
    },

    convertOversToBalls(oversStr) {
        const parts = String(oversStr).split('.');
        const overs = parseInt(parts[0]) || 0;
        const balls = parts.length > 1 ? parseInt(parts[1]) || 0 : 0;
        return (overs * 6) + balls;
    },

    // Authentication (Client-side Gatekeeper)
    login(user, pass) {
        if (user === 'VPLWEB' && pass === 'vpl2025@') {
            sessionStorage.setItem('vpl_auth', 'true');
            return true;
        }
        return false;
    },
    logout() {
        sessionStorage.removeItem('vpl_auth');
        window.location.href = 'login.html';
    },
    isLoggedIn() {
        return sessionStorage.getItem('vpl_auth') === 'true';
    },
    requireAuth() {
        if (!this.isLoggedIn()) {
            window.location.href = 'login.html';
        }
    }
};

// Initialize if empty
Store.init();
