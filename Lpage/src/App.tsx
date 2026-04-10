import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import IDEPage from './pages/IDEPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/ide" element={<IDEPage />} />
      </Routes>
    </Router>
  );
}

export default App;
