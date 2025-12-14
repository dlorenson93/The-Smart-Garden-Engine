import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import axios from 'axios';
import { tasksApi, plantingsApi, gardensApi, profileApi } from '../lib/api';
import '../styles/dashboard.css';
import '../styles/backgrounds.css';

// New UI Components
import Button from '../components/ui/Button';
import InsightBanner from '../components/ui/InsightBanner';
import VineyardDivider from '../components/ui/VineyardDivider';

// Dashboard Card Components
import DashboardGrid from '../components/dashboard/DashboardGrid';
import WeatherCard from '../components/dashboard/cards/WeatherCard';
import TodayTasksCard from '../components/dashboard/cards/TodayTasksCard';
import GardensOverviewCard from '../components/dashboard/cards/GardensOverviewCard';
import RecentHarvestsCard from '../components/dashboard/cards/RecentHarvestsCard';
import SellHarvestCard from '../components/dashboard/cards/SellHarvestCard';
import DidYouKnowCard from '../components/dashboard/cards/DidYouKnowCard';
import CommunityCard from '../components/dashboard/cards/CommunityCard';

const API_URL = import.meta.env.VITE_API_URL || '/api/v1';

interface WeatherData {
  current: {
    temp: number;
    feelsLike: number;
    condition: string;
    icon: string;
    humidity: number;
    windSpeed: number;
    precipitation: number;
  };
  forecast: Array<{
    date: string;
    dayOfWeek: string;
    high: number;
    low: number;
    condition: string;
    icon: string;
    precipitationChance: number;
  }>;
  sunrise: string;
  sunset: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [todayTasks, setTodayTasks] = useState<any[]>([]);
  const [upcomingTasks, setUpcomingTasks] = useState<any[]>([]);
  const [recentPlantings, setRecentPlantings] = useState<any[]>([]);
  const [gardens, setGardens] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherError, setWeatherError] = useState<string>('');
  const [wateringIntelligence, setWateringIntelligence] = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [photos, setPhotos] = useState<any[]>([]);

  useEffect(() => {
    // Check onboarding status on mount
    const checkOnboarding = () => {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          if (!user.onboardingCompleted) {
            navigate('/onboarding', { replace: true });
            return;
          }
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }
    };

    checkOnboarding();
    loadDashboard();
    loadWeather();
    loadWateringIntelligence();
  }, [navigate]);

  const loadWeather = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Loading weather from:', `${API_URL}/weather/current`);
      const response = await axios.get(`${API_URL}/weather/current`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 12000, // 12 second timeout - gives backend time to fetch from API
      });
      console.log('Weather response:', response.data);
      setWeather(response.data.weather);
      setWeatherError('');
    } catch (err: any) {
      console.error('Error loading weather:', err);
      console.error('Error response:', err.response?.data);
      
      // Don't block dashboard if weather fails
      if (err.code === 'ECONNABORTED') {
        setWeatherError('Weather service timed out');
      } else {
        const errorMsg = err.response?.data?.error?.message || 'Weather unavailable';
        setWeatherError(errorMsg);
      }
    }
  };

  const loadWateringIntelligence = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/watering/intelligence`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000,
      });
      setWateringIntelligence(response.data);
    } catch (err) {
      console.error('Error loading watering intelligence:', err);
      // Silent fail - feature is optional
    }
  };

  const loadDashboard = async () => {
    try {
      const [todayRes, upcomingRes, plantingsRes, gardensRes, profileRes] = await Promise.all([
        tasksApi.getAll('today'),
        tasksApi.getAll('upcoming'),
        plantingsApi.getAll(),
        gardensApi.getAll(),
        profileApi.get().catch(() => ({ data: null })),
      ]);

      setTodayTasks(todayRes.data);
      setUpcomingTasks(upcomingRes.data);
      setRecentPlantings(plantingsRes.data.slice(0, 5));
      setGardens(gardensRes.data);
      setProfile(profileRes.data);

      // Generate alerts
      const newAlerts = [];
      const overdueTasks = todayRes.data.filter((t: any) => !t.completed);
      if (overdueTasks.length > 0) {
        newAlerts.push({ type: 'warning', message: `${overdueTasks.length} task${overdueTasks.length > 1 ? 's' : ''} need attention today` });
      }
      
      // Check for frost alerts
      if (profileRes.data?.lastFrostDate || profileRes.data?.firstFrostDate) {
        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        // Spring frost warning (March-May)
        if (currentMonth >= 3 && currentMonth <= 5 && profileRes.data.lastFrostDate) {
          newAlerts.push({ type: 'info', message: `Last spring frost expected: ${profileRes.data.lastFrostDate}` });
        }
        // Fall frost warning (September-November)
        if (currentMonth >= 9 && currentMonth <= 11 && profileRes.data.firstFrostDate) {
          newAlerts.push({ type: 'info', message: `First fall frost expected: ${profileRes.data.firstFrostDate}` });
        }
      }

      setAlerts(newAlerts);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      await tasksApi.complete(taskId);
      loadDashboard();
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const getSunriseSunsetCountdown = () => {
    if (weather?.sunrise && weather?.sunset) {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      
      // Parse sunrise/sunset times (format: "6:30 AM")
      const parseSunTime = (timeStr: string) => {
        const [time, period] = timeStr.split(' ');
        let [hour, minute] = time.split(':').map(Number);
        if (period === 'PM' && hour !== 12) hour += 12;
        if (period === 'AM' && hour === 12) hour = 0;
        return hour + minute / 60;
      };
      
      const sunriseHour = parseSunTime(weather.sunrise);
      const sunsetHour = parseSunTime(weather.sunset);
      const currentHour = hours + minutes / 60;
      
      if (currentHour < sunriseHour) {
        const hoursUntil = Math.floor(sunriseHour - currentHour);
        return { event: 'Sunrise', time: weather.sunrise, hours: hoursUntil };
      } else if (currentHour < sunsetHour) {
        const hoursUntil = Math.floor(sunsetHour - currentHour);
        return { event: 'Sunset', time: weather.sunset, hours: hoursUntil };
      } else {
        const hoursUntil = Math.floor(24 - currentHour + sunriseHour);
        return { event: 'Sunrise', time: weather.sunrise, hours: hoursUntil };
      }
    }
    
    // Fallback to approximate times if weather data not available
    const now = new Date();
    const hours = now.getHours();
    const month = now.getMonth();
    let sunrise = 6;
    let sunset = 18;
    
    if (month >= 5 && month <= 7) { // Summer
      sunrise = 5;
      sunset = 20;
    } else if (month >= 11 || month <= 1) { // Winter
      sunrise = 7;
      sunset = 17;
    }
    
    if (hours < sunrise) {
      return { event: 'Sunrise', time: `${sunrise}:00 AM`, hours: sunrise - hours };
    } else if (hours < sunset) {
      return { event: 'Sunset', time: `${sunset - 12}:00 PM`, hours: sunset - hours };
    } else {
      return { event: 'Sunrise', time: `${sunrise}:00 AM`, hours: 24 - hours + sunrise };
    }
  };

  const getWeatherIcon = (condition: string) => {
    const icons: any = {
      sunny: '☀️',
      cloudy: '☁️',
      rainy: '🌧️',
      partly: '⛅',
    };
    return icons[condition] || '🌤️';
  };

  if (loading) {
    return (
      <Layout>
        <div className="dashboard-loading">
          Loading your garden dashboard...
        </div>
      </Layout>
    );
  }

  const sunInfo = getSunriseSunsetCountdown();
  const totalPlantings = recentPlantings.length;
  const totalGardens = gardens.length;
  const totalBeds = gardens.reduce((sum, g) => sum + (g.beds?.length || 0), 0);

  return (
    <Layout>
      <div className="tp-paper">
        {/* Vintage Vineyard Hero - Matches Logo Aesthetic */}
        <div className="tp-hero" role="banner" aria-label="Dashboard welcome banner">
          {/* Layer 1: Vineyard Texture */}
          <div className="tp-hero-texture" aria-hidden="true" />

          {/* Layer 2: Soft Green→Purple Overlay */}
          <div className="tp-hero-overlay" aria-hidden="true" />

          {/* Layer 3: Bottom Fade (Blends into Paper) */}
          <div className="tp-hero-fade" aria-hidden="true" />

          {/* Layer 4: Content */}
          <div className="tp-hero-content">
            <div>
              <h1 className="tp-hero-title">Welcome to Terra Plantari</h1>
              <p className="tp-hero-subtitle">{getCurrentTime()}</p>
            </div>
            <div className="tp-hero-actions">
              <Button
                variant="primary"
                size="md"
                onClick={() => navigate('/command-center')}
              >
                Command Center
              </Button>
              <Button
                variant="outline"
                size="md"
                onClick={() => setShowAIAssistant(true)}
                style={{
                  background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                  borderColor: '#38bdf8',
                  color: '#0369a1',
                  fontWeight: '600'
                }}
              >
                🤖 AI Assistant
              </Button>
            </div>
          </div>
        </div>

        {/* Smart Watering Intelligence Banner */}
        {wateringIntelligence?.recommendation && (
          <div style={{ marginBottom: 'var(--space-6)' }}>
            <InsightBanner
              status={wateringIntelligence.recommendation.shouldWater ? 'warning' : 'success'}
              icon={wateringIntelligence.recommendation.shouldWater ? '💧' : '🌧️'}
              message="Smart Watering Intelligence"
              detail={wateringIntelligence.recommendation.reason}
              metric={wateringIntelligence.skippedTasks > 0 ? {
                value: wateringIntelligence.skippedTasks,
                label: 'tasks auto-skipped'
              } : undefined}
            />
          </div>
        )}

        {/* Task and Frost Alerts */}
        {alerts.length > 0 && (
          <div style={{
            marginBottom: 'var(--space-6)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-3)'
          }}>
            {alerts.map((alert, idx) => (
              <InsightBanner
                key={idx}
                status={alert.type === 'warning' ? 'warning' : 'info'}
                message={alert.message}
              />
            ))}
          </div>
        )}

        {/* AI Assistant Modal */}
        {showAIAssistant && (
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 'var(--z-modal)',
            }}
            onClick={() => setShowAIAssistant(false)}
          >
            <div 
              style={{ 
                maxWidth: '500px', 
                width: '90%',
                backgroundColor: 'var(--color-white)',
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--space-8)',
                boxShadow: 'var(--shadow-xl)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 style={{ marginTop: 0, marginBottom: 'var(--space-4)' }}>🤖 AI Garden Assistant</h2>
              <p style={{ marginBottom: 'var(--space-6)' }}>Ask me anything about gardening, plant care, or your garden!</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={() => navigate('/ai-assistant')}
                >
                  Open Full Assistant
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  fullWidth
                  onClick={() => setShowAIAssistant(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Grid Layout */}
        <div className="tp-content">
          {/* Section: Today's Overview */}
          <div className="dashboard-section">
            <h2>Today's Overview</h2>
          </div>
          <DashboardGrid>
            <WeatherCard 
              weather={weather}
              weatherError={weatherError}
              sunInfo={sunInfo}
              getCurrentTime={getCurrentTime}
              loadWeather={loadWeather}
            />
            <TodayTasksCard 
              tasks={todayTasks}
              onCompleteTask={handleCompleteTask}
            />
          </DashboardGrid>

          {/* Etched Divider */}
          <div className="tp-divider" role="separator" aria-hidden="true">
            <div className="tp-divider-inner" />
          </div>

          {/* Section: Garden Health */}
          <div className="dashboard-section">
            <h2>Garden Health</h2>
          </div>
          <DashboardGrid>
            <GardensOverviewCard 
              totalGardens={totalGardens}
              totalBeds={totalBeds}
              totalPlantings={totalPlantings}
            />
            <RecentHarvestsCard 
              plantings={recentPlantings}
              photos={photos}
            />
          </DashboardGrid>

          {/* Etched Divider */}
          <div className="tp-divider" role="separator" aria-hidden="true">
            <div className="tp-divider-inner" />
          </div>

          {/* Section: Learning & Connection */}
          <div className="dashboard-section">
            <h2>Learning & Connection</h2>
          </div>
          <DashboardGrid>
            <DidYouKnowCard />
            <CommunityCard />
          </DashboardGrid>

          {/* Section: Marketplace Preview */}
          <div className="dashboard-section">
            <h2>Terra Marketplace</h2>
          </div>
          <DashboardGrid columns={1} compact>
            <SellHarvestCard />
          </DashboardGrid>
        </div>
      </div>
    </Layout>
  );
}