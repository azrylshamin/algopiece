import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout';
import { Home, Algorithms, AlgorithmDetail, Playground, Profile } from './pages';
import './index.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/algorithms" element={<Algorithms />} />
          <Route path="/algorithms/:id" element={<AlgorithmDetail />} />
          <Route path="/playground" element={<Playground />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
