import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import GameList from './pages/GameList';
import MyGames from './pages/MyGames';
import CreateGame from './pages/CreateGame';
import GameDetail from './pages/GameDetail';
import ReportedGames from './pages/ReportedGames';
import AIAssistant from './components/AIAssistant';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="app-container">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<GameList />} />
              <Route path="/mygames" element={<MyGames />} />
              <Route path="/create" element={<CreateGame />} />
              <Route path="/game/:id" element={<GameDetail />} />
              <Route path="/admin/reported" element={<ReportedGames />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>

        {/* AI Assistant - Always visible */}
        <AIAssistant />
      </Router>
    </AuthProvider>
  );
}

export default App;
