import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProfileProvider } from './context/UserProfileContext';
import Landing from './pages/Landing';
import IDEPage from './pages/IDEPage';
import ChangelogPage from './pages/ChangelogPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <UserProfileProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/ide" element={<IDEPage />} />
          <Route path="/changelog" element={<ChangelogPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </UserProfileProvider>
  );
}

export default App;
