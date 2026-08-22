import React, { useState } from 'react';
import { SafetyAlert, Language } from '../types';
import { MOCK_SAFETY_ALERTS } from '../data/mockData';
import { useTranslation } from '../utils/translations';

interface AlertsViewProps {
  language?: Language;
  onOpenSOS: () => void;
}

export const AlertsView: React.FC<AlertsViewProps> = ({ language = 'en', onOpenSOS }) => {
  const { t } = useTranslation(language);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [alerts, setAlerts] = useState<SafetyAlert[]>(MOCK_SAFETY_ALERTS);

  const categories = [
    { id: 'ALL', label: t('filterAll', 'All') },
    { id: 'CROWD', label: t('filterCrowd', 'Crowd') },
    { id: 'AARTI', label: t('filterAarti', 'Aarti') },
    { id: 'TRAFFIC', label: t('filterTraffic', 'Traffic') },
    { id: 'WEATHER', label: t('filterWeather', 'Weather') },
  ];

  const filteredAlerts = alerts.filter((item) =>
    activeCategory === 'ALL' ? true : item.category === activeCategory
  );

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 pb-24 text-[#fadcd7]">
      {/* Header */}
      <div className="flex justify-between items-start mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#F44336] text-2xl animate-pulse">
              notifications_active
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {t('alertsTitle', 'Safety Alerts & Advisories')}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#e5bdb8] mt-1">
            {t('alertsSubtitle', 'Real-time official broadcasts from Nashik Kumbhmela Disaster Management Cell.')}
          </p>
        </div>

        <button
          onClick={onOpenSOS}
          className="px-3 py-1.5 bg-[#F44336] hover:bg-[#d32f2f] text-white font-extrabold text-xs rounded-lg shadow cursor-pointer"
        >
          SOS
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              activeCategory === cat.id
                ? 'bg-[#ffb4a9] text-[#690002] shadow-sm'
                : 'bg-[#1B2025] text-[#e5bdb8] border border-[#5c403c] hover:bg-[#2c1b19]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Alerts Feed */}
      <div className="space-y-3.5 mt-2">
        {filteredAlerts.map((alert) => {
          let badgeBg = 'bg-[#46DFA6]/20 text-[#46DFA6] border-[#46DFA6]/40';
          let borderAccent = 'border-l-4 border-[#46DFA6]';

          if (alert.severity === 'warning') {
            badgeBg = 'bg-[#FFD700]/20 text-[#FFD700] border-[#FFD700]/40';
            borderAccent = 'border-l-4 border-[#FFD700]';
          } else if (alert.severity === 'critical') {
            badgeBg = 'bg-[#F44336]/20 text-[#F44336] border-[#F44336]/40';
            borderAccent = 'border-l-4 border-[#F44336]';
          } else if (alert.severity === 'info') {
            badgeBg = 'bg-[#2196F3]/20 text-[#2196F3] border-[#2196F3]/40';
            borderAccent = 'border-l-4 border-[#2196F3]';
          }

          return (
            <article
              key={alert.id}
              className={`bg-[#1B2025] border border-[#5c403c]/40 rounded-xl p-4 sm:p-5 ${borderAccent} shadow-md space-y-2`}
            >
              <div className="flex justify-between items-start gap-2">
                <h3 className="font-extrabold text-base sm:text-lg text-white">
                  {alert.title}
                </h3>
                <span
                  className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border shrink-0 ${badgeBg}`}
                >
                  {alert.category}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-[#e5bdb8]">
                <span className="material-symbols-outlined text-[14px] text-[#ff8c00]">location_on</span>
                <span className="font-semibold text-white">{alert.location}</span>
                <span className="text-[#ac8884]">• {alert.timeAgo}</span>
              </div>

              <p className="text-xs sm:text-sm text-[#fadcd7] leading-relaxed">
                {alert.message}
              </p>

              {alert.actionGuidance && (
                <div className="bg-[#2c1b19] p-2.5 rounded-lg border border-[#5c403c] text-xs text-[#ffb77d] flex items-start gap-2">
                  <span className="material-symbols-outlined text-[16px] mt-0.5 text-[#FFD700]">
                    priority_high
                  </span>
                  <span>
                    <strong>Action:</strong> {alert.actionGuidance}
                  </span>
                </div>
              )}

              <div className="pt-1 flex items-center justify-between text-[11px] text-[#ac8884]">
                <span>Source: {alert.verifiedSource}</span>
                <span className="flex items-center gap-1 text-[#46DFA6] font-bold">
                  <span className="material-symbols-outlined text-[14px]">verified</span> Verified Official
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
