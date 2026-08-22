import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { useTranslation } from '../utils/translations';

interface CrowdAlertTickerProps {
  language: Language;
  onNavigateToMap?: () => void;
}

interface SectorDensity {
  id: string;
  nameKey: string;
  density: number; // 0 - 100%
  trend: 'rising' | 'falling' | 'stable';
  flowStatus: 'SAFE' | 'MODERATE' | 'SURGE';
  peoplePerSqm: number;
}

export const CrowdAlertTicker: React.FC<CrowdAlertTickerProps> = ({
  language,
  onNavigateToMap,
}) => {
  const { t } = useTranslation(language);

  // 1-second dynamic updater state
  const [tickerSecond, setTickerSecond] = useState<number>(0);
  const [activeFootfall, setActiveFootfall] = useState<number>(142500);
  const [overallDensity, setOverallDensity] = useState<number>(71);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [flashSurgeAlert, setFlashSurgeAlert] = useState(false);

  const [sectors, setSectors] = useState<SectorDensity[]>([
    {
      id: 'ramkund',
      nameKey: 'ramkundGhat',
      density: 78,
      trend: 'rising',
      flowStatus: 'SURGE',
      peoplePerSqm: 5.4,
    },
    {
      id: 'laxman',
      nameKey: 'laxmanJhula',
      density: 55,
      trend: 'stable',
      flowStatus: 'MODERATE',
      peoplePerSqm: 3.2,
    },
    {
      id: 'trimbak',
      nameKey: 'trimbakParikrama',
      density: 64,
      trend: 'falling',
      flowStatus: 'MODERATE',
      peoplePerSqm: 3.9,
    },
    {
      id: 'tapovan',
      nameKey: 'tapovanSector',
      density: 32,
      trend: 'stable',
      flowStatus: 'SAFE',
      peoplePerSqm: 1.8,
    },
    {
      id: 'godavari',
      nameKey: 'godavariSangam',
      density: 68,
      trend: 'rising',
      flowStatus: 'MODERATE',
      peoplePerSqm: 4.2,
    },
  ]);

  // Real-time 1000ms ticker effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTickerSecond((prev) => prev + 1);

      // Fluctuate footfall and densities realistically every 1 second
      setActiveFootfall((prev) => {
        const delta = Math.floor(Math.random() * 41) - 18;
        return Math.max(130000, Math.min(165000, prev + delta));
      });

      setSectors((prevSectors) => {
        return prevSectors.map((sector) => {
          const shift = Math.floor(Math.random() * 5) - 2; // -2 to +2%
          const newDensity = Math.max(15, Math.min(96, sector.density + shift));
          const trend = shift > 0 ? 'rising' : shift < 0 ? 'falling' : 'stable';
          const flowStatus =
            newDensity >= 75 ? 'SURGE' : newDensity >= 50 ? 'MODERATE' : 'SAFE';
          const peoplePerSqm = Number(((newDensity / 100) * 7).toFixed(1));

          return {
            ...sector,
            density: newDensity,
            trend,
            flowStatus,
            peoplePerSqm,
          };
        });
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Update overall average density and trigger flash alert if Ramkund spikes
  useEffect(() => {
    if (sectors.length > 0) {
      const avg = Math.round(
        sectors.reduce((acc, s) => acc + s.density, 0) / sectors.length
      );
      setOverallDensity(avg);

      const ramkund = sectors.find((s) => s.id === 'ramkund');
      if (ramkund && ramkund.density >= 80) {
        setFlashSurgeAlert(true);
      } else {
        setFlashSurgeAlert(false);
      }
    }
  }, [sectors]);

  const getStatusBadge = (flow: 'SAFE' | 'MODERATE' | 'SURGE') => {
    switch (flow) {
      case 'SAFE':
        return {
          label: t('crowdNormal', 'Normal 🟢'),
          color: 'text-[#46DFA6]',
          bg: 'bg-[#46DFA6]/10 border-[#46DFA6]/40',
        };
      case 'MODERATE':
        return {
          label: t('crowdModerate', 'Moderate 🟠'),
          color: 'text-[#FFD700]',
          bg: 'bg-[#FFD700]/10 border-[#FFD700]/40',
        };
      case 'SURGE':
        return {
          label: t('crowdHigh', 'High Surge 🔴'),
          color: 'text-[#F44336]',
          bg: 'bg-[#F44336]/15 border-[#F44336]/50 animate-pulse',
        };
    }
  };

  const currentSecondsFormatted = String(tickerSecond % 60).padStart(2, '0');

  return (
    <div
      className={`rounded-2xl border transition-all duration-500 overflow-hidden shadow-xl ${
        flashSurgeAlert
          ? 'bg-gradient-to-r from-[#2c1310] via-[#1a1216] to-[#2c1310] border-[#F44336] shadow-[0_0_25px_rgba(244,67,54,0.35)] ring-1 ring-[#F44336]/60'
          : 'bg-gradient-to-r from-[#141B22] via-[#161f28] to-[#141B22] border-[#ff8c00]/40 hover:border-[#ff8c00]'
      }`}
    >
      {/* 1. Header Bar with 1-Second Live Sync Indicator */}
      <div className="p-3.5 sm:p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#5c403c]/40 bg-[#0B0F14]/70">
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center">
            <span className="w-3.5 h-3.5 rounded-full bg-[#F44336] animate-ping opacity-75" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#F44336] absolute" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#ffd700] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-[#ff8c00] animate-spin" style={{ animationDuration: '4s' }}>
                  radar
                </span>
                {t('crowdAlertTitle', 'LIVE CROWD TELEMETRY & SURGE ALERT')}
              </h3>
              <span className="bg-[#ff8c00]/20 text-[#ffb77d] text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border border-[#ff8c00]/40">
                1s SYNC
              </span>
            </div>
            <p className="text-[11px] text-[#ac8884]">
              {t('crowdRefreshesEverySec', 'Updates every 1s via IoT & Drone Sensors')} • Tick :{currentSecondsFormatted}s
            </p>
          </div>
        </div>

        {/* Live Footfall Metric Badge */}
        <div className="flex items-center gap-3 self-stretch sm:self-auto justify-between sm:justify-end">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-[#ac8884] block">
              {t('footfallRate', 'Footfall / Min')}
            </span>
            <span className="text-xs sm:text-sm font-extrabold font-mono text-[#46DFA6]">
              {activeFootfall.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="h-7 w-[1px] bg-[#5c403c]/60 hidden sm:block" />

          <button
            onClick={() => setIsDetailsOpen(!isDetailsOpen)}
            className="text-xs font-bold px-3 py-1.5 rounded-lg bg-[#2c1b19] hover:bg-[#3d2623] text-[#fadcd7] border border-[#5c403c] transition-all flex items-center gap-1 cursor-pointer"
          >
            <span>{isDetailsOpen ? t('hideCrowdDetails', 'Hide') : t('viewCrowdDetails', 'Zones')}</span>
            <span className="material-symbols-outlined text-sm">
              {isDetailsOpen ? 'expand_less' : 'expand_more'}
            </span>
          </button>
        </div>
      </div>

      {/* 2. Critical Surge Flash Banner if Ramkund or Any Area >= 80% */}
      {flashSurgeAlert && (
        <div className="bg-[#F44336]/20 border-b border-[#F44336]/50 px-4 py-2 flex items-center justify-between gap-2 animate-pulse">
          <div className="flex items-center gap-2 text-xs font-extrabold text-[#ffb4a9]">
            <span className="material-symbols-outlined text-[#F44336] text-[18px]">warning</span>
            <span>{t('highCrowdSurge', 'High Surge Warning - Divert to Outer Ghats')}</span>
          </div>
          {onNavigateToMap && (
            <button
              onClick={onNavigateToMap}
              className="text-[11px] font-bold text-white bg-[#F44336] hover:bg-[#d32f2f] px-2 py-0.5 rounded shadow cursor-pointer"
            >
              {t('openLiveMap', 'View Route')}
            </button>
          )}
        </div>
      )}

      {/* 3. Horizontal Live Scrolling Ticker */}
      <div className="p-3 bg-[#11161D] flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-[#e5bdb8] font-semibold text-xs">
            {t('liveDensity', 'Live Density')}:
          </span>
          <span className="font-extrabold font-mono text-base text-[#ffd700]">
            {overallDensity}%
          </span>
          <div className="w-20 bg-[#2c1b19] h-2 rounded-full overflow-hidden border border-[#5c403c]">
            <div
              className={`h-full transition-all duration-1000 ${
                overallDensity > 75
                  ? 'bg-[#F44336]'
                  : overallDensity > 50
                  ? 'bg-[#FFD700]'
                  : 'bg-[#46DFA6]'
              }`}
              style={{ width: `${overallDensity}%` }}
            />
          </div>
        </div>

        {/* Live Top Ghat Preview */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          {sectors.slice(0, 3).map((s) => {
            const badge = getStatusBadge(s.flowStatus);
            return (
              <div
                key={s.id}
                className="flex items-center gap-1.5 bg-[#1B2025] px-2.5 py-1 rounded-lg border border-[#5c403c]/50 text-[11px] whitespace-nowrap"
              >
                <span className="text-[#fadcd7] font-medium">{t(s.nameKey)}:</span>
                <span className={`font-mono font-bold ${badge.color}`}>
                  {s.density}%
                </span>
                <span className="text-[9px] text-[#ac8884]">
                  {s.trend === 'rising' ? '▲' : s.trend === 'falling' ? '▼' : '▬'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Expandable Detailed Sector Grid */}
      {isDetailsOpen && (
        <div className="p-4 bg-[#0c1015] border-t border-[#5c403c]/40 space-y-3 animate-fade-in">
          <div className="flex justify-between items-center text-xs text-[#ac8884]">
            <span className="font-bold uppercase tracking-wider">
              Ghat Sector Density Breakdown (Live 1s Refresh)
            </span>
            <span className="text-[11px] font-mono text-[#ffd700]">
              Max Limit: 7 ppl / m²
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {sectors.map((sector) => {
              const badge = getStatusBadge(sector.flowStatus);
              return (
                <div
                  key={sector.id}
                  className="bg-[#151C24] p-3 rounded-xl border border-[#5c403c]/40 hover:border-[#ff8c00]/60 transition-all flex flex-col gap-2"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-white">
                      {t(sector.nameKey)}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${badge.bg} ${badge.color}`}
                    >
                      {badge.label}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#ac8884]">
                      {sector.peoplePerSqm} ppl/m²
                    </span>
                    <span className={`font-extrabold ${badge.color}`}>
                      {sector.density}% Capacity
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-[#232b35] h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-1000 ${
                        sector.density > 75
                          ? 'bg-[#F44336]'
                          : sector.density > 50
                          ? 'bg-[#FFD700]'
                          : 'bg-[#46DFA6]'
                      }`}
                      style={{ width: `${sector.density}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
