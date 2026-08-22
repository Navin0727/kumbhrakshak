import React from 'react';
import { UserProfile, SafetyAlert, PoiCategory } from '../types';
import { NavTab } from './BottomNav';
import { CrowdAlertTicker } from './CrowdAlertTicker';
import { useTranslation } from '../utils/translations';

interface HomeViewProps {
  userProfile: UserProfile;
  onOpenSOS: () => void;
  onNavigateTab: (tab: NavTab) => void;
  onFilterMapCategory?: (category: PoiCategory) => void;
  onNavigateToServices?: (category?: 'water' | 'drone' | 'shuttle' | 'food') => void;
  onOpenTemples: () => void;
  onOpenAiGuide: () => void;
  alerts: SafetyAlert[];
}

export const HomeView: React.FC<HomeViewProps> = ({
  userProfile,
  onOpenSOS,
  onNavigateTab,
  onFilterMapCategory,
  onNavigateToServices,
  onOpenTemples,
  onOpenAiGuide,
  alerts,
}) => {
  const { t } = useTranslation(userProfile.language);

  const handleQuickHelp = (
    action: 'hospital' | 'police' | 'petrol' | 'nearby' | 'cases' | 'alerts' | 'water' | 'drone' | 'shuttle' | 'food'
  ) => {
    if (action === 'cases') {
      onNavigateTab('cases');
    } else if (action === 'alerts') {
      onNavigateTab('alerts');
    } else if (action === 'water' || action === 'drone' || action === 'shuttle' || action === 'food') {
      if (onNavigateToServices) {
        onNavigateToServices(action);
      } else {
        if (onFilterMapCategory) onFilterMapCategory(action);
        onNavigateTab('map');
      }
    } else if (action === 'hospital' || action === 'police' || action === 'petrol') {
      if (onFilterMapCategory) onFilterMapCategory(action);
      onNavigateTab('map');
    } else {
      if (onFilterMapCategory) onFilterMapCategory('booth');
      onNavigateTab('map');
    }
  };

  return (
    <div className="flex flex-col gap-5 pb-24 md:pb-12 max-w-4xl mx-auto w-full px-4 sm:px-6 animate-fade-in select-none">
      {/* 1. Greeting & Live Location Status */}
      <section className="flex flex-col gap-1.5 pt-2">
        <div className="flex justify-between items-start sm:items-end">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#ff8c00] uppercase tracking-widest bg-[#ff8c00]/10 px-2 py-0.5 rounded border border-[#ff8c00]/30">
                {t('kumbhMela2027', 'Kumbhmela 2027')}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1 flex items-center gap-2">
              {t('namaste', 'Namaste')}, {userProfile.fullName || t('pilgrim', 'Pilgrim')}
            </h2>
            <div className="flex items-center gap-1.5 text-[#e5bdb8] text-xs sm:text-sm mt-1">
              <span className="material-symbols-outlined text-[18px] text-[#ff8c00]">location_on</span>
              <span className="font-bold text-white">{t('sector', 'Sector 4 • Nashik / Panchavati')}</span>
              <span className="text-xs text-[#46DFA6] font-semibold flex items-center gap-1">
                • <span className="w-2 h-2 rounded-full bg-[#46DFA6] animate-pulse inline-block" /> Active
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-[#211413] px-3.5 py-1.5 rounded-full border border-[#ff8c00]/50 shadow-[0_0_12px_rgba(255,140,0,0.25)]">
            <div className="w-2.5 h-2.5 rounded-full bg-[#46DFA6] animate-ping" />
            <span className="text-xs font-black text-[#ffd700] tracking-wider uppercase">{t('live', 'LIVE')}</span>
          </div>
        </div>
      </section>

      {/* 2. Primary SOS Button with pulsing aura & glowing beacon */}
      <section>
        <button
          onClick={onOpenSOS}
          className="w-full bg-gradient-to-r from-[#F44336] via-[#E53935] to-[#D32F2F] hover:brightness-110 active:scale-[0.98] transition-all text-white min-h-[62px] sm:min-h-[68px] rounded-2xl font-black text-base sm:text-lg flex items-center justify-center gap-3 shadow-[0_6px_25px_rgba(244,67,54,0.5)] sos-btn-pulse cursor-pointer border border-[#ff8a80]/60 select-none group"
        >
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined icon-fill text-2xl sm:text-3xl text-white">
              sos
            </span>
          </div>
          <span className="tracking-wide text-white drop-shadow-md">
            {t('needHelpSOS', 'NEED HELP? GET EMERGENCY HELP')}
          </span>
        </button>
      </section>

      {/* 3. REAL-TIME CROWD ALERT TICKER (Refreshes Every 1 Second) */}
      <section>
        <CrowdAlertTicker
          language={userProfile.language}
          onNavigateToMap={() => onNavigateTab('map')}
        />
      </section>

      {/* 4. Live Safety Status Strip */}
      <section className="flex gap-3 overflow-x-auto pb-1 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
        {/* Crowd Status */}
        <div className="shrink-0 bg-gradient-to-br from-[#1B2025] to-[#151a20] border border-[#5c403c]/50 rounded-xl p-3.5 flex items-center gap-3 min-w-[185px] flex-1 shadow-sm hover:border-[#46DFA6]/60 transition-all">
          <div className="w-10 h-10 rounded-xl bg-[#46DFA6]/15 flex items-center justify-center border border-[#46DFA6]/40 text-[#46DFA6]">
            <span className="material-symbols-outlined text-[22px]">groups</span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#ac8884] uppercase tracking-wider">{t('crowdStatus', 'Crowd Status')}</p>
            <p className="text-sm font-extrabold text-[#46DFA6] flex items-center gap-1">
              {t('crowdNormal', 'Normal 🟢')}
            </p>
          </div>
        </div>

        {/* Traffic Status */}
        <div className="shrink-0 bg-gradient-to-br from-[#1B2025] to-[#151a20] border border-[#5c403c]/50 rounded-xl p-3.5 flex items-center gap-3 min-w-[185px] flex-1 shadow-sm hover:border-[#FFD700]/60 transition-all">
          <div className="w-10 h-10 rounded-xl bg-[#FFD700]/15 flex items-center justify-center border border-[#FFD700]/40 text-[#FFD700]">
            <span className="material-symbols-outlined text-[22px]">directions_car</span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#ac8884] uppercase tracking-wider">{t('trafficStatus', 'Traffic Grid')}</p>
            <p className="text-sm font-extrabold text-[#FFD700] flex items-center gap-1">
              {t('crowdModerate', 'Moderate 🟠')}
            </p>
          </div>
        </div>

        {/* Security / System Status */}
        <div className="shrink-0 bg-gradient-to-br from-[#1B2025] to-[#151a20] border border-[#5c403c]/50 rounded-xl p-3.5 flex items-center gap-3 min-w-[200px] flex-1 shadow-sm hover:border-[#ff8c00]/60 transition-all">
          <div className="w-10 h-10 rounded-xl bg-[#2c1b19] flex items-center justify-center border border-[#ff8c00]/40 text-[#ffd700]">
            <span className="material-symbols-outlined text-[22px]">security</span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#ac8884] uppercase tracking-wider">{t('sanctumThreat', 'Sanctum Threat')}</p>
            <p className="text-sm font-extrabold text-[#fadcd7]">{t('noActiveThreat', 'No Active Threat 🛡️')}</p>
          </div>
        </div>
      </section>

      {/* 5. 24/7 PILGRIM SERVICES (Water, Drone Rescue, E-Shuttle, Free Food) */}
      <section className="bg-gradient-to-b from-[#141B22] to-[#0E1318] border border-[#ff8c00]/40 rounded-2xl p-4 sm:p-5 shadow-xl space-y-3.5">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#46DFA6] animate-pulse" />
            <h3 className="text-sm sm:text-base font-extrabold text-white">
              {t('sevaGridTitle', 'Pilgrim Seva & Rescue Grid')}
            </h3>
          </div>
          <button
            onClick={() => onNavigateTab('services')}
            className="text-xs font-bold text-[#ffd700] hover:text-white bg-[#2c1b19] px-2.5 py-1 rounded-lg border border-[#ff8c00]/40 flex items-center gap-1 cursor-pointer transition-all hover:bg-[#ff8c00]/20"
          >
            {t('openAllServices', 'Open All Services')}
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {/* Water */}
          <button
            onClick={() => handleQuickHelp('water')}
            className="bg-[#1B2025] hover:bg-[#202730] border border-[#00e5ff]/30 hover:border-[#00e5ff] rounded-xl p-3 flex flex-col items-center text-center gap-1.5 transition-all cursor-pointer group shadow-sm hover:shadow-[0_0_15px_rgba(0,229,255,0.2)]"
          >
            <div className="w-11 h-11 rounded-xl bg-[#00e5ff]/15 text-[#00e5ff] flex items-center justify-center border border-[#00e5ff]/40 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[24px]">water_drop</span>
            </div>
            <span className="text-xs font-extrabold text-white">{t('waterStations', 'Water Stations')}</span>
            <span className="text-[10px] text-[#00e5ff] font-bold">{t('waterSub', '48 RO Kiosks')}</span>
          </button>

          {/* Drone Rescue */}
          <button
            onClick={() => handleQuickHelp('drone')}
            className="bg-[#1B2025] hover:bg-[#202730] border border-[#ff8c00]/30 hover:border-[#ff8c00] rounded-xl p-3 flex flex-col items-center text-center gap-1.5 transition-all cursor-pointer group shadow-sm hover:shadow-[0_0_15px_rgba(255,140,0,0.2)]"
          >
            <div className="w-11 h-11 rounded-xl bg-[#ff8c00]/15 text-[#ff8c00] flex items-center justify-center border border-[#ff8c00]/40 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[24px]">flight_takeoff</span>
            </div>
            <span className="text-xs font-extrabold text-white">{t('droneRescue', 'Drone Rescue')}</span>
            <span className="text-[10px] text-[#ff8c00] font-bold">{t('droneSub', 'Aerial Lifebuoy')}</span>
          </button>

          {/* Shuttle */}
          <button
            onClick={() => handleQuickHelp('shuttle')}
            className="bg-[#1B2025] hover:bg-[#202730] border border-[#46DFA6]/30 hover:border-[#46DFA6] rounded-xl p-3 flex flex-col items-center text-center gap-1.5 transition-all cursor-pointer group shadow-sm hover:shadow-[0_0_15px_rgba(70,223,166,0.2)]"
          >
            <div className="w-11 h-11 rounded-xl bg-[#46DFA6]/15 text-[#46DFA6] flex items-center justify-center border border-[#46DFA6]/40 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[24px]">electric_rickshaw</span>
            </div>
            <span className="text-xs font-extrabold text-white">{t('eShuttle', 'E-Shuttle Transit')}</span>
            <span className="text-[10px] text-[#46DFA6] font-bold">{t('eShuttleSub', 'Free Every 4 min')}</span>
          </button>

          {/* Food */}
          <button
            onClick={() => handleQuickHelp('food')}
            className="bg-[#1B2025] hover:bg-[#202730] border border-[#FFD700]/30 hover:border-[#FFD700] rounded-xl p-3 flex flex-col items-center text-center gap-1.5 transition-all cursor-pointer group shadow-sm hover:shadow-[0_0_15px_rgba(255,215,0,0.2)]"
          >
            <div className="w-11 h-11 rounded-xl bg-[#FFD700]/15 text-[#FFD700] flex items-center justify-center border border-[#FFD700]/40 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[24px]">restaurant</span>
            </div>
            <span className="text-xs font-extrabold text-white">{t('foodLangar', 'Food & Langar')}</span>
            <span className="text-[10px] text-[#FFD700] font-bold">{t('foodSub', 'Free Mahaprasad')}</span>
          </button>
        </div>
      </section>

      {/* 6. Quick Help Grid (6 High-Contrast Action Cards) */}
      <section className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {/* Medical */}
        <button
          onClick={() => handleQuickHelp('hospital')}
          className="bg-[#1B2025] border border-[#5c403c]/40 hover:border-[#2196F3] rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-[#202730] transition-all min-h-[115px] group text-left cursor-pointer shadow-sm"
        >
          <div className="w-12 h-12 bg-[#2196F3]/15 rounded-xl flex items-center justify-center border border-[#2196F3]/40 group-hover:scale-110 transition-transform text-[#2196F3]">
            <span className="material-symbols-outlined text-2xl font-bold">local_hospital</span>
          </div>
          <span className="text-xs sm:text-sm font-extrabold text-[#fadcd7] group-hover:text-white text-center">
            {t('medical', 'Medical Emergency')}
          </span>
        </button>

        {/* Police */}
        <button
          onClick={() => handleQuickHelp('police')}
          className="bg-[#1B2025] border border-[#5c403c]/40 hover:border-[#2196F3] rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-[#202730] transition-all min-h-[115px] group text-left cursor-pointer shadow-sm"
        >
          <div className="w-12 h-12 bg-[#2196F3]/15 rounded-xl flex items-center justify-center border border-[#2196F3]/40 group-hover:scale-110 transition-transform text-[#2196F3]">
            <span className="material-symbols-outlined text-2xl font-bold">local_police</span>
          </div>
          <span className="text-xs sm:text-sm font-extrabold text-[#fadcd7] group-hover:text-white text-center">
            {t('police', 'Police Booths')}
          </span>
        </button>

        {/* Petrol Pump */}
        <button
          onClick={() => handleQuickHelp('petrol')}
          className="bg-[#1B2025] border border-[#5c403c]/40 hover:border-[#ffd700] rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-[#202730] transition-all min-h-[115px] group text-left cursor-pointer shadow-sm"
        >
          <div className="w-12 h-12 bg-[#2c1b19] rounded-xl flex items-center justify-center border border-[#ff8c00]/40 group-hover:scale-110 transition-transform text-[#ffd700]">
            <span className="material-symbols-outlined text-2xl">local_gas_station</span>
          </div>
          <span className="text-xs sm:text-sm font-extrabold text-[#fadcd7] group-hover:text-white text-center">
            {t('petrolPump', 'Petrol Pump')}
          </span>
        </button>

        {/* Help Nearby */}
        <button
          onClick={() => handleQuickHelp('nearby')}
          className="bg-[#1B2025] border border-[#5c403c]/40 hover:border-[#46DFA6] rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-[#202730] transition-all min-h-[115px] group text-left cursor-pointer shadow-sm"
        >
          <div className="w-12 h-12 bg-[#46DFA6]/15 rounded-xl flex items-center justify-center border border-[#46DFA6]/40 group-hover:scale-110 transition-transform text-[#46DFA6]">
            <span className="material-symbols-outlined text-2xl">near_me</span>
          </div>
          <span className="text-xs sm:text-sm font-extrabold text-[#fadcd7] group-hover:text-white text-center">
            {t('helpNearby', 'Help Nearby')}
          </span>
        </button>

        {/* Lost & Reunion */}
        <button
          onClick={() => handleQuickHelp('cases')}
          className="bg-[#1B2025] border border-[#5c403c]/40 hover:border-[#FFD700] rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-[#202730] transition-all min-h-[115px] group text-left cursor-pointer shadow-sm"
        >
          <div className="w-12 h-12 bg-[#FFD700]/15 rounded-xl flex items-center justify-center border border-[#FFD700]/40 group-hover:scale-110 transition-transform text-[#FFD700]">
            <span className="material-symbols-outlined text-2xl">family_restroom</span>
          </div>
          <span className="text-xs sm:text-sm font-extrabold text-[#fadcd7] group-hover:text-white text-center">
            {t('lostReunion', 'Lost & Reunion')}
          </span>
        </button>

        {/* Safety Alerts */}
        <button
          onClick={() => handleQuickHelp('alerts')}
          className="bg-[#1B2025] border border-[#5c403c]/40 hover:border-[#F44336] rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-[#202730] transition-all min-h-[115px] group text-left cursor-pointer relative shadow-sm"
        >
          <div className="w-12 h-12 bg-[#F44336]/15 rounded-xl flex items-center justify-center border border-[#F44336]/40 group-hover:scale-110 transition-transform text-[#F44336]">
            <span className="material-symbols-outlined text-2xl">warning</span>
          </div>
          <span className="text-xs sm:text-sm font-extrabold text-[#fadcd7] group-hover:text-white text-center">
            {t('safetyAlerts', 'Safety Alerts')}
          </span>
          {alerts.length > 0 && (
            <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-[#F44336] rounded-full animate-ping" />
          )}
        </button>
      </section>

      {/* 7. Live Safety Map Card */}
      <section className="bg-[#141B22] border border-[#ff8c00]/40 rounded-2xl overflow-hidden shadow-xl flex flex-col">
        <div className="p-3.5 sm:p-4 border-b border-[#5c403c]/40 flex justify-between items-center bg-[#0B0F14]/80">
          <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-[#2196F3]">map</span>
            {t('liveSafetyMap', 'Live Safety Map')}
          </h3>
          <span className="text-xs font-bold text-[#ffd700] bg-[#211413] px-2.5 py-0.5 rounded-lg border border-[#ff8c00]/40">
            {t('sector', 'Nashik Sector 4')}
          </span>
        </div>

        <div
          className="h-56 sm:h-64 bg-[#0a0f14] relative bg-cover bg-center overflow-hidden"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuA1DaAqqrCVSJPoJlqpLm57GpmiIjJdZHojZ8rJV6H7XWy7v4KRNRxLYfZaAWNMstyOzaOpgHIs5YE0PTzPJEVe-rwB-dQOIDJNQyJgyktyrxVQQvFu769pnYNQKbEuxUplLQeQIKkzJTcgBPEGBcL55SEaVXaKw0rrCwPQ81tLO8__ub_SVi1FydRrqep2NNOgIBIStToPPKTC4GOrn8z4CBKldESQyriX1sNQ63LyVNs7v05IokMdUw')`,
          }}
        >
          {/* Neon tactical grid line overlay */}
          <div className="absolute inset-0 bg-tactical-grid opacity-30 pointer-events-none" />

          {/* Animated Map Hotspots */}
          <div className="absolute top-1/4 left-1/3 flex items-center gap-1 bg-[#2196F3]/90 text-white px-2.5 py-1 rounded-lg shadow-lg border border-white/40 animate-pulse text-xs font-extrabold">
            <span className="material-symbols-outlined text-[15px]">local_hospital</span>
            Civil Hospital
          </div>

          <div
            className="absolute top-1/2 right-1/4 flex items-center gap-1 bg-[#46DFA6]/90 text-[#003826] px-2.5 py-1 rounded-lg shadow-lg border border-white/40 animate-pulse text-xs font-extrabold"
            style={{ animationDelay: '600ms' }}
          >
            <span className="material-symbols-outlined text-[15px]">person_pin_circle</span>
            Ramkund Safe Zone
          </div>

          {/* Bottom Gradient Overlay with CTA */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F14] via-[#0B0F14]/50 to-transparent flex flex-col justify-end p-4">
            <button
              onClick={() => onNavigateTab('map')}
              className="w-full bg-gradient-to-r from-[#2196F3] to-[#1E88E5] hover:brightness-110 text-white h-12 rounded-xl font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(33,150,243,0.4)] transition-all active:scale-[0.99] cursor-pointer border border-white/20"
            >
              <span className="material-symbols-outlined">explore</span>
              {t('openLiveMap', 'OPEN LIVE MAP')}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
