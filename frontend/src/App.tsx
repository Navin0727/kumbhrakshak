/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserProfile, Language, PoiCategory } from './types';
import { MOCK_SAFETY_ALERTS } from './data/mockData';
import { SplashScreen } from './components/SplashScreen';
import { LoginPage } from './components/LoginPage';
import { Header } from './components/Header';
import { BottomNav, NavTab } from './components/BottomNav';
import { HomeView } from './components/HomeView';
import { MapView } from './components/MapView';
import { ServicesView } from './components/ServicesView';
import { TemplesView } from './components/TemplesView';
import { AlertsView } from './components/AlertsView';
import { CasesView } from './components/CasesView';
import { ProfileView } from './components/ProfileView';
import { EmergencyModal } from './components/EmergencyModal';
import { KumbhMitraAIModal } from './components/KumbhMitraAIModal';

const DEFAULT_PROFILE: UserProfile = {
  id: 'usr-kumbh-default',
  fullName: 'Rahul Sharma',
  phoneNumber: '9876543210',
  ageGroup: '31-50',
  language: 'en',
  bloodGroup: 'B+',
  allergies: 'None',
  medicalConditions: 'None',
  currentMedications: 'None',
  mobilityAssistance: false,
  emergencyContact: {
    name: 'Priya Sharma',
    phone: '+91 98765 00000',
    relationship: 'Spouse',
  },
  pilgrimId: 'KMB-2027-8492',
  isRegistered: true,
  emergencyQrCode:
    'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=KUMBHRAKSHAK:KMB-2027-8492:Rahul%20Sharma:Blood_B%2B:EMG_%2B919876500000',
};

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      const savedAuth = localStorage.getItem('kumbhrakshak_is_logged_in');
      return savedAuth === 'true';
    } catch {
      return false;
    }
  });

  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [tabHistory, setTabHistory] = useState<NavTab[]>([]);
  const [servicesCategory, setServicesCategory] = useState<'water' | 'drone' | 'shuttle' | 'food'>('water');
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('kumbhrakshak_profile');
      return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  const [isSOSOpen, setIsSOSOpen] = useState(false);
  const [isAiGuideOpen, setIsAiGuideOpen] = useState(false);
  const [mapFilterCategory, setMapFilterCategory] = useState<PoiCategory | null>(null);

  // Splash auto-dismiss timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2400);
    return () => clearTimeout(timer);
  }, []);

  const handleNavigateTab = (newTab: NavTab) => {
    if (newTab !== activeTab) {
      setTabHistory((prev) => [...prev, activeTab]);
      if (newTab !== 'map') setMapFilterCategory(null);
      setActiveTab(newTab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleGoBack = () => {
    if (tabHistory.length > 0) {
      const previousTab = tabHistory[tabHistory.length - 1];
      setTabHistory((prev) => prev.slice(0, prev.length - 1));
      setActiveTab(previousTab);
    } else {
      setActiveTab('home');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoHome = () => {
    if (activeTab !== 'home') {
      setTabHistory((prev) => [...prev, activeTab]);
      setActiveTab('home');
      setMapFilterCategory(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLoginSuccess = (profile: UserProfile) => {
    setUserProfile(profile);
    setIsLoggedIn(true);
    try {
      localStorage.setItem('kumbhrakshak_is_logged_in', 'true');
      localStorage.setItem('kumbhrakshak_profile', JSON.stringify(profile));
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    try {
      localStorage.removeItem('kumbhrakshak_is_logged_in');
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveProfile = (updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile);
    try {
      localStorage.setItem('kumbhrakshak_profile', JSON.stringify(updatedProfile));
    } catch (e) {
      console.error(e);
    }
  };

  const handleLanguageChange = (lang: Language) => {
    const updated = { ...userProfile, language: lang };
    setUserProfile(updated);
    try {
      localStorage.setItem('kumbhrakshak_profile', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleFilterMapCategory = (cat: PoiCategory) => {
    setMapFilterCategory(cat);
    handleNavigateTab('map');
  };

  const handleOpenServices = (serviceCategory?: 'water' | 'drone' | 'shuttle' | 'food') => {
    if (serviceCategory) {
      setServicesCategory(serviceCategory);
    }
    handleNavigateTab('services');
  };

  const canGoBack = activeTab !== 'home' || tabHistory.length > 0;

  return (
    <div className="min-h-screen bg-[#0A0E13] text-[#fadcd7] flex flex-col font-['Atkinson_Hyperlegible_Next'] antialiased selection:bg-[#ff8c00] selection:text-white">
      {/* 1. Splash Screen Overlay */}
      {showSplash && (
        <SplashScreen
          onComplete={() => setShowSplash(false)}
          onSkip={() => setShowSplash(false)}
        />
      )}

      {/* 2. Login Page Gate (Shown first when not logged in) */}
      {!showSplash && !isLoggedIn && (
        <LoginPage
          onLoginSuccess={handleLoginSuccess}
          currentLanguage={userProfile.language}
          initialLanguage={userProfile.language}
          onLanguageChange={handleLanguageChange}
        />
      )}

      {/* 3. Top Header Navigation Bar */}
      {!showSplash && isLoggedIn && (
        <>
          <Header
            userProfile={userProfile}
            onOpenProfile={() => handleNavigateTab('profile')}
            onOpenAlerts={() => handleNavigateTab('alerts')}
            onOpenAiGuide={() => setIsAiGuideOpen(true)}
            onLanguageChange={handleLanguageChange}
            onLogout={handleLogout}
            onGoHome={handleGoHome}
            onGoBack={handleGoBack}
            canGoBack={canGoBack}
            activeTab={activeTab}
          />

          {/* Main Body Content Area (padded for fixed header and bottom nav) */}
          <main className="flex-1 pt-16 md:pt-18 overflow-x-hidden">
            {activeTab === 'home' && (
              <HomeView
                userProfile={userProfile}
                onOpenSOS={() => setIsSOSOpen(true)}
                onNavigateTab={handleNavigateTab}
                onFilterMapCategory={handleFilterMapCategory}
                onNavigateToServices={handleOpenServices}
                onOpenTemples={() => handleNavigateTab('temples')}
                onOpenAiGuide={() => setIsAiGuideOpen(true)}
                alerts={MOCK_SAFETY_ALERTS}
              />
            )}

            {activeTab === 'services' && (
              <ServicesView
                userProfile={userProfile}
                initialServiceCategory={servicesCategory}
                onNavigateToMap={(cat) => {
                  if (cat) setMapFilterCategory(cat);
                  handleNavigateTab('map');
                }}
                onOpenSOS={() => setIsSOSOpen(true)}
              />
            )}

            {activeTab === 'map' && (
              <MapView
                language={userProfile.language}
                initialCategory={mapFilterCategory}
                onOpenSOS={() => setIsSOSOpen(true)}
              />
            )}

            {activeTab === 'temples' && (
              <TemplesView
                language={userProfile.language}
                onNavigateToMapWithPoi={() => {
                  setMapFilterCategory(null);
                  handleNavigateTab('map');
                }}
              />
            )}

            {activeTab === 'alerts' && (
              <AlertsView
                language={userProfile.language}
                onOpenSOS={() => setIsSOSOpen(true)}
              />
            )}

            {activeTab === 'cases' && (
              <CasesView
                language={userProfile.language}
              />
            )}

            {activeTab === 'profile' && (
              <ProfileView
                userProfile={userProfile}
                onSaveProfile={handleSaveProfile}
                onClose={() => handleNavigateTab('home')}
                onLogout={handleLogout}
              />
            )}
          </main>

          {/* Bottom Mobile Navigation Bar */}
          <BottomNav
            currentTab={activeTab}
            onSelectTab={handleNavigateTab}
            unreadAlertsCount={2}
            language={userProfile.language}
          />

          {/* Emergency SOS Modal */}
          <EmergencyModal
            userProfile={userProfile}
            isOpen={isSOSOpen}
            onClose={() => setIsSOSOpen(false)}
          />

          {/* AI Safety Guide (Kumbh Mitra) Modal */}
          <KumbhMitraAIModal
            isOpen={isAiGuideOpen}
            onClose={() => setIsAiGuideOpen(false)}
            userProfile={userProfile}
            onOpenSOS={() => {
              setIsAiGuideOpen(false);
              setIsSOSOpen(true);
            }}
          />
        </>
      )}
    </div>
  );
}
