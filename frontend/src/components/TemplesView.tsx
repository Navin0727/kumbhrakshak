import React, { useState } from 'react';
import { Temple, Language } from '../types';
import { MOCK_TEMPLES } from '../data/mockData';
import { useTranslation } from '../utils/translations';

interface TemplesViewProps {
  language?: Language;
  onNavigateToMapWithPoi?: (name: string) => void;
}

export const TemplesView: React.FC<TemplesViewProps> = ({ language = 'en', onNavigateToMapWithPoi }) => {
  const { t } = useTranslation(language);
  const [selectedTemple, setSelectedTemple] = useState<Temple | null>(null);

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 md:p-8 pb-24 md:pb-12 text-[#dee3ea]">
      {/* Page Header */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
          {t('templesTitle', 'Temples & Spiritual Places')}
        </h2>
        <p className="text-sm sm:text-base text-[#ddc1ae]">
          {t('templesSubtitle', 'Discover major temples, check sacred Aarti timings, and view real-time status.')}
        </p>
      </div>

      {/* Bento Grid of Temples */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_TEMPLES.map((temple) => {
          const isClosed = !temple.isOpen;

          return (
            <article
              key={temple.id}
              className="bg-[#1A1F26] rounded-xl border border-[#564334]/50 overflow-hidden shadow-lg flex flex-col jali-pattern hover:border-[#ffb77d]/60 transition-all duration-300 group"
            >
              {/* Photo & Live Status */}
              <div className="h-48 sm:h-52 w-full relative overflow-hidden bg-black">
                <img
                  alt={temple.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  src={temple.photoUrl}
                />

                {/* Status Chip */}
                <div
                  className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 backdrop-blur-md border ${
                    temple.isOpen
                      ? 'bg-[#0ec18b]/90 text-white border-[#46dfa6]/40'
                      : 'bg-[#93000a]/90 text-white border-[#ffb4ab]/40'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      temple.isOpen ? 'bg-[#46dfa6] animate-pulse' : 'bg-[#ffb4ab]'
                    }`}
                  />
                  {temple.isOpen ? t('openNow', 'Open Now') : t('closed', 'Closed')}
                </div>

                {/* Photo Credit Overlay */}
                <div className="absolute bottom-2 right-2 bg-black/75 text-[#dee3ea] px-2 py-0.5 rounded text-[10px] font-medium backdrop-blur-sm border border-white/10">
                  {temple.photoCredit}
                </div>
              </div>

              {/* Card Content with colored side accent line */}
              <div
                className={`p-5 flex flex-col flex-grow border-l-4 ${
                  temple.isOpen ? 'border-[#46dfa6]' : 'border-[#F44336]'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-xl font-bold text-white tracking-tight">{temple.name}</h3>
                </div>

                <div className="flex items-center gap-1.5 text-[#ffb77d] text-xs font-semibold mb-4">
                  <span className="material-symbols-outlined text-[16px]">near_me</span>
                  <span>{temple.distanceKm} km away</span>
                  <span className="text-[#a48c7a]">• {temple.location}</span>
                </div>

                {/* Aarti Highlight Box */}
                <div className="bg-[#252a30] rounded-lg p-3.5 mb-5 border border-[#30353b] flex items-center gap-3">
                  <div
                    className={`p-2 rounded-full ${
                      temple.isOpen
                        ? 'bg-[#fabd00]/20 text-[#FFD700]'
                        : 'bg-[#30353b] text-[#ddc1ae]'
                    }`}
                  >
                    <span
                      className="material-symbols-outlined text-[20px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      {temple.isOpen ? 'schedule' : 'event_busy'}
                    </span>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#ddc1ae] uppercase tracking-wider">
                      {temple.isOpen ? 'Next Aarti' : 'Status'}
                    </p>
                    <p
                      className={`text-sm font-extrabold ${
                        temple.isOpen ? 'text-[#FFD700]' : 'text-[#ddc1ae]'
                      }`}
                    >
                      {temple.isOpen ? temple.nextAarti : temple.statusLabel}
                    </p>
                  </div>
                </div>

                {/* View Timings CTA Button */}
                <div className="mt-auto">
                  <button
                    onClick={() => setSelectedTemple(temple)}
                    className={`w-full py-2.5 px-4 rounded-lg font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                      temple.isOpen
                        ? 'border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700]/15'
                        : 'border-[#a48c7a] text-[#a48c7a] hover:bg-white/5'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">visibility</span>
                    View Timings &amp; Guidelines
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Aarti Timings & Details Modal */}
      {selectedTemple && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#171c21] border border-[#564334] rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-4 border-b border-[#564334]/50 flex justify-between items-center bg-[#0a0f14]">
              <div>
                <h3 className="text-lg font-extrabold text-[#ffb77d]">{selectedTemple.name}</h3>
                <p className="text-xs text-[#ddc1ae]">{selectedTemple.location}</p>
              </div>
              <button
                onClick={() => setSelectedTemple(null)}
                className="w-8 h-8 rounded-full bg-[#252a30] text-[#dee3ea] flex items-center justify-center hover:bg-[#30353b]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs sm:text-sm text-[#dee3ea]">
              {/* Image banner */}
              <div className="rounded-xl overflow-hidden h-36 relative">
                <img
                  alt={selectedTemple.name}
                  src={selectedTemple.photoUrl}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-3">
                  <span className="text-xs font-bold text-[#FFD700]">
                    Darshan Timings: {selectedTemple.darshanTimings}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-[#ddc1ae] leading-relaxed">
                {selectedTemple.description}
              </p>

              {/* Aarti Schedule Table */}
              <div>
                <h4 className="font-bold text-sm text-[#ffb77d] mb-2 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px]">schedule</span>
                  Daily Aarti Schedule
                </h4>
                <div className="space-y-2">
                  {selectedTemple.aartiSchedule.map((aarti, idx) => (
                    <div
                      key={idx}
                      className="bg-[#252a30] p-2.5 rounded-lg border border-[#30353b] flex items-center justify-between"
                    >
                      <div>
                        <p className="font-bold text-white text-xs">{aarti.name}</p>
                        <p className="text-[11px] text-[#ddc1ae]">{aarti.description}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-extrabold text-[#FFD700] block">
                          {aarti.time}
                        </span>
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                            aarti.crowdLevel === 'Safe'
                              ? 'bg-[#46dfa6]/20 text-[#46dfa6]'
                              : aarti.crowdLevel === 'Moderate'
                              ? 'bg-[#fabd00]/20 text-[#FFD700]'
                              : 'bg-[#F44336]/20 text-[#ffb4ab]'
                          }`}
                        >
                          {aarti.crowdLevel} Crowd
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Safety Guidelines */}
              <div>
                <h4 className="font-bold text-sm text-[#46dfa6] mb-2 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px]">verified_user</span>
                  Pilgrim Safety &amp; Darshan Protocols
                </h4>
                <ul className="list-disc list-inside space-y-1 text-xs text-[#ddc1ae]">
                  {selectedTemple.guidelines.map((guide, idx) => (
                    <li key={idx}>{guide}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-[#564334]/50 bg-[#0a0f14] flex gap-2">
              <button
                onClick={() => {
                  setSelectedTemple(null);
                  if (onNavigateToMapWithPoi) onNavigateToMapWithPoi(selectedTemple.name);
                }}
                className="flex-1 py-2.5 bg-[#ff8c00] hover:bg-[#ff8c00]/90 text-black font-extrabold rounded-lg text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">map</span>
                Show on Live Safety Map
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
