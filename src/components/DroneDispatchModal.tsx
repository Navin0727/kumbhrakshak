import React, { useState, useEffect } from 'react';
import { DroneRescueUnit } from '../types';

interface DroneDispatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDrone?: DroneRescueUnit | null;
  onDispatchSuccess?: (droneId: string, incidentType: string) => void;
}

export const DroneDispatchModal: React.FC<DroneDispatchModalProps> = ({
  isOpen,
  onClose,
  selectedDrone,
  onDispatchSuccess,
}) => {
  const [incidentType, setIncidentType] = useState<string>('DROWNING_RISK');
  const [incidentLocation, setIncidentLocation] = useState<string>('Ramkund Step #8 Ghat Basin');
  const [urgencyLevel, setUrgencyLevel] = useState<'CRITICAL' | 'HIGH' | 'MEDIUM'>('CRITICAL');
  const [dispatchStage, setDispatchStage] = useState<'FORM' | 'LAUNCHING' | 'EN_ROUTE' | 'PAYLOAD_DROPPED'>('FORM');
  const [etaSeconds, setEtaSeconds] = useState(45);
  const [audioBeep, setAudioBeep] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (dispatchStage === 'EN_ROUTE' && etaSeconds > 0) {
      interval = setInterval(() => {
        setEtaSeconds((prev) => {
          if (prev <= 1) {
            setDispatchStage('PAYLOAD_DROPPED');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [dispatchStage, etaSeconds]);

  if (!isOpen) return null;

  const handleStartDispatch = () => {
    setDispatchStage('LAUNCHING');
    setTimeout(() => {
      setDispatchStage('EN_ROUTE');
      setEtaSeconds(30);
      if (onDispatchSuccess && selectedDrone) {
        onDispatchSuccess(selectedDrone.id, incidentType);
      }
    }, 2000);
  };

  const handleReset = () => {
    setDispatchStage('FORM');
    setEtaSeconds(45);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="bg-[#121820] border-2 border-[#ff8c00] rounded-2xl w-full max-w-lg overflow-hidden shadow-[0_0_50px_rgba(255,140,0,0.35)] flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#1b222c] border-b border-[#5c403c]/60 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#ff8c00]/20 border border-[#ff8c00]/50 flex items-center justify-center text-[#ff8c00] animate-pulse">
              <span className="material-symbols-outlined text-[24px]">flight_takeoff</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#46DFA6] bg-[#46DFA6]/10 px-2 py-0.5 rounded border border-[#46DFA6]/30">
                  AERIAL RESCUE COMMAND
                </span>
              </div>
              <h2 className="text-lg font-extrabold text-white leading-tight">
                {selectedDrone?.name || 'Garuda Aerial Drone Rescue System'}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#2c1b19] hover:bg-[#372623] text-[#e5bdb8] flex items-center justify-center border border-[#5c403c]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {dispatchStage === 'FORM' && (
            <>
              {/* Drone Specs Strip */}
              <div className="bg-[#1B2025] rounded-xl p-3 border border-[#5c403c]/40 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-[#0F1419] p-2 rounded-lg border border-[#5c403c]/30">
                  <p className="text-[10px] text-[#ac8884] uppercase font-bold">Call Sign</p>
                  <p className="font-extrabold text-[#ffb77d]">{selectedDrone?.callSign || 'GARUDA-01'}</p>
                </div>
                <div className="bg-[#0F1419] p-2 rounded-lg border border-[#5c403c]/30">
                  <p className="text-[10px] text-[#ac8884] uppercase font-bold">Battery</p>
                  <p className="font-extrabold text-[#46DFA6]">⚡ {selectedDrone?.batteryPercent || 88}%</p>
                </div>
                <div className="bg-[#0F1419] p-2 rounded-lg border border-[#5c403c]/30">
                  <p className="text-[10px] text-[#ac8884] uppercase font-bold">Max Speed</p>
                  <p className="font-extrabold text-white">45 km/h</p>
                </div>
              </div>

              {/* Incident Selection */}
              <div>
                <label className="block text-xs font-bold text-[#fadcd7] uppercase tracking-wider mb-2">
                  1. Select Emergency Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'DROWNING_RISK', label: 'River Drowning / In Water', icon: 'pool', payload: '2x Inflatable Lifebuoys' },
                    { id: 'CROWD_CRUSH', label: 'Crowd Surge / Stampede', icon: 'groups_3', payload: 'Acoustic Megaphone + Thermal Scan' },
                    { id: 'CARDIAC_FAINT', label: 'Medical Faint / Heatstroke', icon: 'vital_signs', payload: 'AED + ORS Packets' },
                    { id: 'MISSING_SEARCH', label: 'Missing Child / Senior', icon: 'person_search', payload: 'Thermal AI Face Search' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setIncidentType(item.id)}
                      className={`p-3 rounded-xl text-left border flex flex-col gap-1 transition-all ${
                        incidentType === item.id
                          ? 'bg-[#ff8c00]/15 border-[#ff8c00] shadow-[0_0_15px_rgba(255,140,0,0.2)]'
                          : 'bg-[#1B2025] border-[#5c403c]/40 hover:bg-[#252a30]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[20px] text-[#ff8c00]">{item.icon}</span>
                        <span className="text-xs font-bold text-white">{item.label}</span>
                      </div>
                      <span className="text-[10px] text-[#e5bdb8] line-clamp-1">Payload: {item.payload}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Location */}
              <div>
                <label className="block text-xs font-bold text-[#fadcd7] uppercase tracking-wider mb-1.5">
                  2. Incident Target Location
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#ff8c00] text-[20px]">
                    location_on
                  </span>
                  <input
                    type="text"
                    value={incidentLocation}
                    onChange={(e) => setIncidentLocation(e.target.value)}
                    className="w-full bg-[#1B2025] border border-[#5c403c] rounded-xl pl-10 pr-3 py-2 text-sm text-white focus:outline-none focus:border-[#ff8c00]"
                    placeholder="e.g. Ramkund Step 8, Godavari Basin"
                  />
                </div>
              </div>

              {/* Urgency Level */}
              <div>
                <label className="block text-xs font-bold text-[#fadcd7] uppercase tracking-wider mb-1.5">
                  3. Emergency Urgency Priority
                </label>
                <div className="flex gap-2">
                  {(['CRITICAL', 'HIGH', 'MEDIUM'] as const).map((level) => (
                    <button
                      key={level}
                      onClick={() => setUrgencyLevel(level)}
                      className={`flex-1 py-2 rounded-lg text-xs font-extrabold border transition-all ${
                        urgencyLevel === level
                          ? level === 'CRITICAL'
                            ? 'bg-[#F44336] text-white border-[#F44336] shadow-lg'
                            : level === 'HIGH'
                            ? 'bg-[#ff8c00] text-black border-[#ff8c00]'
                            : 'bg-[#FFD700] text-black border-[#FFD700]'
                          : 'bg-[#1B2025] text-[#ac8884] border-[#5c403c]/40'
                      }`}
                    >
                      {level === 'CRITICAL' ? '🚨 CRITICAL (Immediate Drop)' : level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Launch CTA */}
              <button
                onClick={handleStartDispatch}
                className="w-full py-3.5 bg-[#ff8c00] hover:bg-[#e67e00] active:scale-[0.99] text-black font-extrabold rounded-xl text-base flex items-center justify-center gap-2 shadow-[0_4px_25px_rgba(255,140,0,0.4)] transition-all cursor-pointer mt-2"
              >
                <span className="material-symbols-outlined text-[24px]">send</span>
                LAUNCH RESCUE DRONE NOW
              </button>
            </>
          )}

          {dispatchStage === 'LAUNCHING' && (
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-20 h-20 rounded-full border-4 border-[#ff8c00] border-t-transparent animate-spin flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl text-[#ff8c00]">flight_takeoff</span>
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-white">Powering Rotors &amp; Acquiring GPS Lock...</h3>
                <p className="text-xs text-[#e5bdb8] mt-1">Pre-flight system checks complete. Drone launching from Sector 4 Pad.</p>
              </div>
            </div>
          )}

          {dispatchStage === 'EN_ROUTE' && (
            <div className="space-y-4">
              {/* Radar Simulation */}
              <div className="relative h-44 bg-[#0a0f14] rounded-xl overflow-hidden border border-[#ff8c00]/50 flex items-center justify-center">
                <div className="absolute inset-0 bg-tactical-grid opacity-30" />
                <div className="w-36 h-36 rounded-full border border-[#46DFA6]/40 animate-ping absolute" />
                <div className="w-24 h-24 rounded-full border border-[#ff8c00]/60 animate-pulse absolute" />

                {/* Drone Icon Moving */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-[#ff8c00] text-black flex items-center justify-center shadow-[0_0_20px_rgba(255,140,0,0.8)] animate-bounce">
                    <span className="material-symbols-outlined text-2xl">flight</span>
                  </div>
                  <span className="text-[10px] font-extrabold text-white bg-black/80 px-2 py-0.5 rounded mt-1 border border-[#ff8c00]">
                    GARUDA-01 SPEED: 38 KM/H
                  </span>
                </div>

                {/* Target Marker */}
                <div className="absolute bottom-4 right-8 flex items-center gap-1 bg-[#F44336] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                  <span className="material-symbols-outlined text-[12px]">location_on</span>
                  Target: {incidentLocation}
                </div>
              </div>

              {/* Telemetry Progress Strip */}
              <div className="bg-[#1B2025] p-3.5 rounded-xl border border-[#5c403c]/40 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-[#e5bdb8]">Estimated Overhead Drop ETA:</span>
                  <span className="text-lg font-extrabold text-[#46DFA6] animate-pulse">
                    {etaSeconds}s
                  </span>
                </div>

                <div className="w-full bg-[#2c1b19] h-2.5 rounded-full overflow-hidden border border-[#5c403c]">
                  <div
                    className="bg-gradient-to-r from-[#ff8c00] to-[#46DFA6] h-full transition-all duration-1000"
                    style={{ width: `${((30 - etaSeconds) / 30) * 100}%` }}
                  />
                </div>

                <div className="flex justify-between text-[10px] text-[#ac8884] pt-1">
                  <span>Takeoff (Sector 4 Pad)</span>
                  <span className="text-[#ffb77d] font-bold">Altitude: 52m</span>
                  <span>Target Overlook</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setDispatchStage('PAYLOAD_DROPPED')}
                  className="flex-1 py-2.5 bg-[#46DFA6] hover:bg-[#3ecb96] text-[#003826] font-extrabold text-xs rounded-xl flex items-center justify-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  Simulate Instant Drop
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2.5 bg-[#2c1b19] hover:bg-[#372623] text-white text-xs font-bold rounded-xl border border-[#5c403c]"
                >
                  Minimize
                </button>
              </div>
            </div>
          )}

          {dispatchStage === 'PAYLOAD_DROPPED' && (
            <div className="py-4 flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#46DFA6]/20 border-2 border-[#46DFA6] flex items-center justify-center text-[#46DFA6] shadow-[0_0_30px_rgba(70,223,166,0.5)]">
                <span className="material-symbols-outlined text-3xl">done_all</span>
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-white">
                  🎉 Lifebuoy / Emergency Payload Deployed!
                </h3>
                <p className="text-xs text-[#e5bdb8] mt-1 max-w-sm">
                  Garuda-01 dropped automated self-inflatable lifebuoy at <strong className="text-white">{incidentLocation}</strong>.
                  NDRF River Boat Patrol Team 2 has arrived on site.
                </p>
              </div>

              <div className="w-full bg-[#1B2025] rounded-xl p-3 border border-[#46DFA6]/40 text-left text-xs space-y-1.5">
                <p className="text-[11px] font-bold text-[#46DFA6] uppercase">Incident Log #DRN-2027-992</p>
                <p className="text-white">• Target GPS: 20.0063° N, 73.7911° E</p>
                <p className="text-white">• Aerial Loudspeaker Broadcast: Active (Marathi / Hindi)</p>
                <p className="text-white">• Drone State: Hovering overhead as visual marker</p>
              </div>

              <button
                onClick={handleReset}
                className="w-full py-3 bg-[#46DFA6] hover:bg-[#3ecb96] text-[#003826] font-extrabold rounded-xl text-sm transition-all"
              >
                Close &amp; Return to Safety Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
