const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs-extra');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));

// Data directory setup
const DATA_DIR = path.join(__dirname, 'data');
const FILES = {
    teams: path.join(DATA_DIR, 'teams.json'),
    matches: path.join(DATA_DIR, 'matches.json'),
    stats: path.join(DATA_DIR, 'stats.json'),
    points: path.join(DATA_DIR, 'points.json'),
    manual_points: path.join(DATA_DIR, 'manual_points.json')
};

// Initialize data files if they don't exist
const readData = async (fileKey, defaultVal = []) => {
    try {
        const filePath = FILES[fileKey] || path.join(DATA_DIR, `${fileKey}.json`);
        if (!await fs.pathExists(filePath)) return defaultVal;
        return await fs.readJson(filePath);
    } catch (err) {
        return defaultVal;
    }
};

// Initialize data files if they don't exist
async function initDB() {
    await fs.ensureDir(DATA_DIR);
    if (!await fs.pathExists(FILES.teams)) await fs.writeJson(FILES.teams, []);
    if (!await fs.pathExists(FILES.matches)) await fs.writeJson(FILES.matches, []);
    if (!await fs.pathExists(FILES.stats)) await fs.writeJson(FILES.stats, { runs: [], wickets: [] });
    if (!await fs.pathExists(FILES.points)) await fs.writeJson(FILES.points, {});
    if (!await fs.pathExists(FILES.manual_points)) await fs.writeJson(FILES.manual_points, {});
}

initDB().catch(console.error);

// Helper for data access
const getData = async (fileKey) => await fs.readJson(FILES[fileKey]);
const saveData = async (fileKey, data) => await fs.writeJson(FILES[fileKey], data, { spaces: 2 });

// --- API Routes ---

// Auth (Simple Gatekeeper)
app.post('/api/auth/login', (req, res) => {
    const { user, pass } = req.body;
    if (user === 'VPLWEB' && pass === 'vpl2025@') {
        res.json({ success: true, token: 'vpl-secret-token' });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

// Teams
app.get('/api/teams', async (req, res) => {
    res.json(await getData('teams'));
});

app.post('/api/teams', async (req, res) => {
    const teams = await getData('teams');
    const newTeam = req.body;
    const idx = teams.findIndex(t => t.id === newTeam.id);
    if (idx !== -1) teams[idx] = newTeam;
    else teams.push(newTeam);
    await saveData('teams', teams);
    res.json({ success: true, team: newTeam });
});

app.delete('/api/teams/:id', async (req, res) => {
    const teams = (await getData('teams')).filter(t => t.id !== req.params.id);
    await saveData('teams', teams);
    res.json({ success: true });
});

// Matches
app.get('/api/matches', async (req, res) => {
    const year = req.query.year;
    let matches = await getData('matches');
    matches.sort((a, b) => new Date(b.date) - new Date(a.date));
    if (year && year !== 'All') {
        matches = matches.filter(m => new Date(m.date).getFullYear().toString() === year.toString());
    }
    res.json(matches);
});

app.post('/api/matches', async (req, res) => {
    const matches = await getData('matches');
    const newMatch = req.body;
    const idx = matches.findIndex(m => m.id === newMatch.id);
    if (idx !== -1) matches[idx] = newMatch;
    else matches.push(newMatch);
    await saveData('matches', matches);
    res.json({ success: true, match: newMatch });
});

app.delete('/api/matches/:id', async (req, res) => {
    const matches = (await getData('matches')).filter(m => m.id !== req.params.id);
    await saveData('matches', matches);
    res.json({ success: true });
});

// Stats
app.get('/api/stats', async (req, res) => {
  res.json(await readData('stats', { runs: [], wickets: [] }));
});

app.post('/api/stats', async (req, res) => {
    await saveData('stats', req.body);
    res.json({ success: true });
});

// Manual Points
app.get('/api/manual-points', async (req, res) => {
    const { year } = req.query;
    const data = await getData('manual_points');
    res.json(data[year] || []);
});

app.post('/api/manual-points', async (req, res) => {
    const { year, tableData } = req.body;
    const data = await getData('manual_points');
    data[year] = tableData;
    await saveData('manual_points', data);
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`VPL Backend running on http://localhost:${PORT}`);
});
