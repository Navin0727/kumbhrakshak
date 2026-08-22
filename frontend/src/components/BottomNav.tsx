import React from 'react';
import { Language } from '../types';
import { useTranslation } from '../utils/translations';

export type NavTab = 'home' | 'map' | 'services' | 'temples' | 'alerts' | 'cases' | 'profile';

interface BottomNavProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  unreadAlertsCount?: number;
  language?: Language;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  unreadAlertsCount = 2,
  language = 'en',
}) => {
  const { t } = useTranslation(language);

  const tabs = [
    { id: 'home' as NavTab, label: t('home', 'Home'), icon: 'home', filledIcon: 'home' },
    { id: 'map' as NavTab, label: t('map', 'Map'), icon: 'map', filledIcon: 'map' },
    { id: 'services' as NavTab, label: t('services', 'Services'), icon: 'support_agent', filledIcon: 'support_agent' },
    { id: 'temples' as NavTab, label: t('temples', 'Temples'), icon: 'temple_hindu', filledIcon: 'temple_hindu' },
    { id: 'alerts' as NavTab, label: t('alerts', 'Alerts'), icon: 'notifications_active', filledIcon: 'notifications_active', badge: unreadAlertsCount },
    { id: 'cases' as NavTab, label: t('cases', 'Lost & Found'), icon: 'assignment_late', filledIcon: 'assignment' },
    { id: 'profile' as NavTab, label: t('profile', 'Profile'), icon: 'person', filledIcon: 'person' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0B0F14]/95 backdrop-blur-xl border-t border-[#ff8c00]/30 md:hidden flex justify-around items-center px-1 py-1.5 safe-area-bottom shadow-[0_-4px_25px_rgba(0,0,0,0.6)]">
      {tabs.map((tab) => {
        const isActive = currentTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`flex flex-col items-center justify-center flex-1 py-1 px-0.5 rounded-xl transition-all relative ${
              isActive
                ? 'bg-gradient-to-t from-[#ff5545] to-[#ff8c00] text-white font-bold shadow-[0_2px_12px_rgba(255,85,69,0.5)] scale-105 border border-white/20'
                : 'text-[#e5bdb8] hover:text-[#fadcd7] hover:bg-[#2c1b19]/60'
            }`}
          >
            <div className="relative flex items-center justify-center">
              <span
                className={`material-symbols-outlined text-[20px] sm:text-[22px] ${
                  isActive ? 'icon-fill' : ''
                }`}
              >
                {isActive ? tab.filledIcon : tab.icon}
              </span>
              {tab.badge && !isActive && (
                <span className="absolute -top-1 -right-2 bg-[#F44336] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-[#0a0f14] shadow-sm animate-pulse">
                  {tab.badge}
                </span>
              )}
            </div>
            <span
              className={`text-[9.5px] sm:text-[10px] mt-0.5 tracking-tight truncate max-w-[54px] ${
                isActive ? 'font-black text-white' : 'font-medium'
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
