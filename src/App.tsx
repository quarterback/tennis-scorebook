
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Index from '@/pages/Index';
import Schools from '@/pages/Schools';
import Districts from '@/pages/Districts';
import Teams from '@/pages/Teams';
import Matches from '@/pages/Matches';
import Rankings from '@/pages/Rankings';
import Dashboard from '@/pages/Dashboard';
import Layout from '@/components/layout/Layout';
import { DataProvider } from '@/context/DataContext';
import { MatchesProvider } from '@/context/MatchesContext';
import MatchEntry from '@/pages/MatchEntry'; // Add import for new page

const App = () => {
  return (
    <DataProvider>
      <MatchesProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/schools" element={<Schools />} />
              <Route path="/districts" element={<Districts />} />
              <Route path="/teams" element={<Teams />} />
              <Route path="/matches" element={<Matches />} />
              <Route path="/rankings" element={<Rankings />} />
              <Route path="/match-entry" element={<MatchEntry />} /> {/* Add new route */}
            </Routes>
          </Layout>
          <Toaster />
        </Router>
      </MatchesProvider>
    </DataProvider>
  );
};

export default App;
