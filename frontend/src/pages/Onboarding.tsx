import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import WelcomeIllustration from '../components/onboarding/WelcomeIllustration';
import ClimateIllustration from '../components/onboarding/ClimateIllustration';
import GardenBedIllustration from '../components/onboarding/GardenBedIllustration';
import OnTrackIllustration from '../components/onboarding/OnTrackIllustration';
import '../styles/onboarding.css';

const screens = [
  {
    id: 0,
    illustration: WelcomeIllustration,
    bgColor: '#FFF8E1',
    title: 'Welcome to Terra Plantari',
    description: 'Your climate-aware garden companion that helps you grow food sustainably, track your impact, and nurture the Earth.'
  },
  {
    id: 1,
    illustration: ClimateIllustration,
    bgColor: '#E8F5E9',
    title: 'Track Your Climate Impact',
    description: 'Monitor carbon sequestration, water conservation, and food miles saved as you grow your garden.'
  },
  {
    id: 2,
    illustration: GardenBedIllustration,
    bgColor: '#E3F2FD',
    title: 'Manage Multiple Gardens',
    description: 'Create gardens, organize beds, plan plantings, and keep track of varieties across all your growing spaces.'
  },
  {
    id: 3,
    illustration: OnTrackIllustration,
    bgColor: '#F3E5F5',
    title: "You're On Track!",
    description: "Get seasonal recommendations, task reminders, and insights to help your garden thrive all year long."
  }
];

export default function Onboarding() {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentScreen < screens.length - 1) {
      setCurrentScreen(currentScreen + 1);
    }
    if (isRightSwipe && currentScreen > 0) {
      setCurrentScreen(currentScreen - 1);
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  const handleNext = () => {
    if (currentScreen < screens.length - 1) {
      setCurrentScreen(currentScreen + 1);
    } else {
      completeOnboarding();
    }
  };

  const handlePrevious = () => {
    if (currentScreen > 0) {
      setCurrentScreen(currentScreen - 1);
    }
  };

  const handleSkip = () => {
    completeOnboarding();
  };

  const completeOnboarding = async () => {
    try {
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL || '/api/v1';
      
      const response = await fetch(`${API_URL}/auth/complete-onboarding`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Update localStorage with the returned user data
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
      } else {
        // Fallback: update localStorage manually
        const userData = localStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          user.onboardingCompleted = true;
          localStorage.setItem('user', JSON.stringify(user));
        }
      }
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      // Fallback: update localStorage manually
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        user.onboardingCompleted = true;
        localStorage.setItem('user', JSON.stringify(user));
      }
      navigate('/dashboard');
    }
  };

  const currentScreenData = screens[currentScreen];
  const Illustration = currentScreenData.illustration;

  return (
    <div className="onboarding-container" style={{ backgroundColor: currentScreenData.bgColor }}>
      <div className="onboarding-content">
        {/* Skip button */}
        {currentScreen < screens.length - 1 && (
          <button
            onClick={handleSkip}
            className="onboarding-skip"
            aria-label="Skip onboarding"
          >
            Skip
          </button>
        )}

        {/* Carousel */}
        <div
          ref={containerRef}
          className="onboarding-carousel"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Illustration */}
          <div className="onboarding-illustration">
            <Illustration />
          </div>

          {/* Text content */}
          <div className="onboarding-text">
            <h1 className="onboarding-title">{currentScreenData.title}</h1>
            <p className="onboarding-description">{currentScreenData.description}</p>
          </div>
        </div>

        {/* Progress dots */}
        <div className="onboarding-dots">
          {screens.map((screen, index) => (
            <button
              key={screen.id}
              onClick={() => setCurrentScreen(index)}
              className={`onboarding-dot ${index === currentScreen ? 'active' : ''}`}
              aria-label={`Go to screen ${index + 1}`}
              aria-current={index === currentScreen ? 'true' : 'false'}
            />
          ))}
        </div>

        {/* Navigation buttons */}
        <div className="onboarding-nav">
          <button
            onClick={handlePrevious}
            disabled={currentScreen === 0}
            className="onboarding-btn onboarding-btn-secondary"
            aria-label="Previous screen"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            className="onboarding-btn onboarding-btn-primary"
            aria-label={currentScreen === screens.length - 1 ? 'Get started' : 'Next screen'}
          >
            {currentScreen === screens.length - 1 ? "Let's Go!" : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
