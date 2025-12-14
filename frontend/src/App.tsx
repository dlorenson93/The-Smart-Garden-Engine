import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import './styles/theme.css';
import './styles/mobile.css';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Onboarding from './pages/Onboarding';
import ProfileSetup from './pages/ProfileSetup';
import Dashboard from './pages/Dashboard';
import Gardens from './pages/Gardens';
import GardenDetail from './pages/GardenDetail';
import BedDetail from './pages/BedDetail';
import PlantingDetail from './pages/PlantingDetail';
import Tasks from './pages/Tasks';
import SeasonalRecommendations from './pages/SeasonalRecommendations';
import SeasonalRecommendationsTest from './pages/SeasonalRecommendationsTest';
import SurplusSummary from './pages/SurplusSummary';
import TerraInfo from './pages/TerraInfo';
import SeedsInventory from './pages/SeedsInventory';
import CommandCenter from './pages/CommandCenter';
import Settings from './pages/Settings';
import Timeline from './pages/Timeline';
import Search from './pages/Search';
import Soil from './pages/Soil';
import Community from './pages/Community';
import AIAssistantPage from './pages/AIAssistantPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <Onboarding />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/profile/setup"
            element={
              <ProtectedRoute>
                <ProfileSetup />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/command-center"
            element={
              <ProtectedRoute>
                <CommandCenter />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/gardens"
            element={
              <ProtectedRoute>
                <Gardens />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/gardens/:id"
            element={
              <ProtectedRoute>
                <GardenDetail />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/beds/:id"
            element={
              <ProtectedRoute>
                <BedDetail />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/plantings/:id"
            element={
              <ProtectedRoute>
                <PlantingDetail />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <Tasks />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/soil"
            element={
              <ProtectedRoute>
                <Soil />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/gardens/:gardenId/soil"
            element={
              <ProtectedRoute>
                <Soil />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/beds/:bedId/soil"
            element={
              <ProtectedRoute>
                <Soil />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/recommendations"
            element={
              <ProtectedRoute>
                <SeasonalRecommendations />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/surplus"
            element={
              <ProtectedRoute>
                <SurplusSummary />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/terra"
            element={
              <ProtectedRoute>
                <TerraInfo />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/seeds"
            element={
              <ProtectedRoute>
                <SeedsInventory />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/timeline"
            element={
              <ProtectedRoute>
                <Timeline />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <Search />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/community"
            element={
              <ProtectedRoute>
                <Community />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/ai-assistant"
            element={
              <ProtectedRoute>
                <AIAssistantPage />
              </ProtectedRoute>
            }
          />
          
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
