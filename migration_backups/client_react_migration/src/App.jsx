import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Teams from './pages/Teams';
import Fixtures from './pages/Fixtures';
import Standings from './pages/Standings';
import Stats from './pages/Stats';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import ManageTeams from './pages/admin/ManageTeams';
import ManageFixtures from './pages/admin/ManageFixtures';
import ManageStandings from './pages/admin/ManageStandings';
import ManageStats from './pages/admin/ManageStats';

import DashboardOverview from './pages/admin/DashboardOverview';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="teams" element={<Teams />} />
        <Route path="fixtures" element={<Fixtures />} />
        <Route path="standings" element={<Standings />} />
        <Route path="stats" element={<Stats />} />
      </Route>
      
      <Route path="/admin/login" element={<Login />} />
      <Route path="/admin" element={<Dashboard />}>
        <Route index element={<DashboardOverview />} />
        <Route path="teams" element={<ManageTeams />} />
        <Route path="fixtures" element={<ManageFixtures />} />
        <Route path="standings" element={<ManageStandings />} />
        <Route path="stats" element={<ManageStats />} />
      </Route>
    </Routes>
  );
}

export default App;
