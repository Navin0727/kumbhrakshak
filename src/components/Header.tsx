import React from 'react';
import { UserProfile, Language } from '../types';
import { useTranslation } from '../utils/translations';

interface HeaderProps {
  userProfile: UserProfile;
  onOpenProfile: () => void;
  onOpenAlerts: () => void;
  onOpenAiGuide: () => void;
  onLanguageChange: (lang: Language) => void;
  onLogout?: () => void;
  onGoHome: () => void;
  onGoBack: () => void;
  canGoBack: boolean;
  activeTab: string;
}

export const Header: React.FC<HeaderProps> = ({
  userProfile,
  onOpenProfile,
  onOpenAlerts,
  onOpenAiGuide,
  onLanguageChange,
  onLogout,
  onGoHome,
  onGoBack,
  canGoBack,
  activeTab,
}) => {
  const { t } = useTranslation(userProfile.language);

  return (
    <header className="fixed top-0 w-full z-40 flex justify-between items-center px-3 sm:px-6 h-14 bg-[#0B0F14]/95 backdrop-blur-md border-b border-[#ff8c00]/30 text-[#fadcd7] shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
      {/* Left: Back Button + Pilgrim Profile Button */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {canGoBack && (
          <button
            onClick={onGoBack}
            className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#281715] hover:bg-[#ff8c00]/20 text-[#ffb77d] border border-[#ff8c00]/40 transition-all hover:scale-105 active:scale-95 shadow-sm cursor-pointer group"
            title={t('back', 'Back')}
            aria-label="Go Back"
          >
            <span className="material-symbols-outlined text-[20px] sm:text-[22px] group-hover:-translate-x-0.5 transition-transform">
              arrow_back
            </span>
          </button>
        )}

        <button
          onClick={onOpenProfile}
          className="flex items-center gap-2 p-1 rounded-xl hover:bg-[#2c1b19] transition-colors group focus:outline-none focus:ring-1 focus:ring-[#ffb4a9] cursor-pointer"
          title="View Pilgrim Profile & Medical Vault"
          aria-label="Profile"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#372623] to-[#ff8c00]/30 border border-[#ff8c00]/50 flex items-center justify-center overflow-hidden text-[#ffb4a9] group-hover:border-[#ffd700] transition-colors shadow-sm">
            <span className="material-symbols-outlined text-[18px]">person</span>
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-bold text-[#ffb4a9] leading-tight group-hover:text-[#ffd700] transition-colors">
              {userProfile.fullName || t('pilgrim', 'Pilgrim')}
            </span>
            <span className="text-[10px] text-[#e5bdb8] font-mono">
              {userProfile.pilgrimId || 'ID: KMB-2027'}
            </span>
          </div>
        </button>
      </div>

      {/* Center: Brand Title (CLICKABLE -> Redirects to HOME) */}
      <button
        onClick={onGoHome}
        className="flex items-center gap-2 px-2.5 py-1 rounded-xl hover:bg-[#2c1b19]/70 border border-transparent hover:border-[#ff8c00]/40 transition-all cursor-pointer group active:scale-95"
        title="KumbhRakshak Home"
        aria-label="Go to Home"
      >
        <div className="relative flex items-center justify-center">
          <span className="material-symbols-outlined text-[#ff8c00] group-hover:text-[#ffd700] text-[24px] icon-fill transition-colors filter drop-shadow-[0_0_8px_rgba(255,140,0,0.6)]">
            shield_lock
          </span>
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#46DFA6] animate-ping" />
          <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-[#46DFA6]" />
        </div>
        <div className="flex flex-col items-start text-left">
          <h1 className="text-lg sm:text-xl font-black tracking-tight text-white group-hover:text-[#ffd700] transition-colors font-['Atkinson_Hyperlegible_Next'] select-none">
            {t('appName', 'KumbhRakshak')}
          </h1>
          <span className="hidden md:block text-[9px] text-[#ffb77d] font-semibold -mt-1 tracking-wider uppercase">
            {t('kumbhMela2027', 'Kumbhmela 2027')}
          </span>
        </div>
      </button>

      {/* Right Actions: AI Guide + Language + Alerts Bell + Logout */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Kumbh Mitra AI Helper Button */}
        <button
          onClick={onOpenAiGuide}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-[#ff8c00]/20 to-[#ff5722]/20 text-[#ffd700] border border-[#ff8c00]/50 hover:border-[#ffd700] hover:scale-105 transition-all text-xs font-extrabold shadow-sm cursor-pointer"
          title="Kumbh Mitra AI Safety Guide"
        >
          <span className="material-symbols-outlined text-[16px] text-[#ffd700] animate-pulse">
            smart_toy
          </span>
          <span className="hidden xs:inline text-[11px] font-bold">{t('aiGuide', 'AI Guide')}</span>
        </button>

        {/* Language Switcher */}
        <div className="relative">
          <select
            value={userProfile.language}
            onChange={(e) => onLanguageChange(e.target.value as Language)}
            className="bg-[#211413] text-[#ffd700] text-xs font-bold py-1 px-2 pr-6 rounded-lg border border-[#ff8c00]/40 appearance-none cursor-pointer focus:outline-none focus:border-[#ffd700] hover:bg-[#2c1b19] transition-colors shadow-sm"
            title="Select Language"
          >
            <option value="en">EN (English)</option>
            <option value="hi">हिंदी (Hindi)</option>
            <option value="mr">मराठी (Marathi)</option>
            <option value="gu">ગુજરાતી (Gujarati)</option>
            <option value="sa">संस्कृतम् (Sanskrit)</option>
          </select>
          <span className="material-symbols-outlined text-[14px] text-[#ff8c00] absolute right-1.5 top-2 pointer-events-none">
            arrow_drop_down
          </span>
        </div>

        {/* Alerts Notification Bell */}
        <button
          onClick={onOpenAlerts}
          className={`w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full hover:bg-[#2c1b19] transition-colors relative text-[#fadcd7] cursor-pointer ${
            activeTab === 'alerts' ? 'bg-[#372623] text-[#ffb4a9] border border-[#F44336]' : ''
          }`}
          title="Safety Notifications & Advisories"
          aria-label="Alerts"
        >
          <span className="material-symbols-outlined text-[20px] sm:text-[22px]">notifications</span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#F44336] animate-ping" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#F44336]" />
        </button>

        {/* Switch Account / Logout Button */}
        {onLogout && (
          <button
            onClick={onLogout}
            className="w-8 h-8 hidden sm:flex items-center justify-center rounded-full bg-[#281715] hover:bg-[#372623] text-[#ac8884] hover:text-[#ffb4a9] border border-[#5c403c] transition-colors cursor-pointer"
            title="Switch Account or Log Out"
            aria-label="Log Out"
          >
            <span className="material-symbols-outlined text-[17px]">logout</span>
          </button>
        )}
      </div>
    </header>
  );
};
