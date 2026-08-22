import React, { useState } from 'react';
import {
  WaterStation,
  DroneRescueUnit,
  ShuttleRoute,
  FoodService,
  UserProfile,
  PoiCategory,
} from '../types';
import {
  MOCK_WATER_STATIONS,
  MOCK_DRONE_UNITS,
  MOCK_SHUTTLE_ROUTES,
  MOCK_FOOD_SERVICES,
} from '../data/mockData';
import { DroneDispatchModal } from './DroneDispatchModal';
import { PrasadTokenModal } from './PrasadTokenModal';
import { ShuttleBookingModal } from './ShuttleBookingModal';
import { useTranslation } from '../utils/translations';

interface ServicesViewProps {
  userProfile: UserProfile;
  initialServiceCategory?: 'water' | 'drone' | 'shuttle' | 'food';
  onNavigateToMap: (category?: PoiCategory) => void;
  onOpenSOS: () => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({
  userProfile,
  initialServiceCategory = 'water',
  onNavigateToMap,
  onOpenSOS,
}) => {
  const { t } = useTranslation(userProfile.language);
  const [activeTab, setActiveTab] = useState<'water' | 'drone' | 'shuttle' | 'food'>(initialServiceCategory);
  const [selectedArea, setSelectedArea] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [isDroneModalOpen, setIsDroneModalOpen] = useState(false);
  const [selectedDrone, setSelectedDrone] = useState<DroneRescueUnit | null>(null);

  const [isPrasadModalOpen, setIsPrasadModalOpen] = useState(false);
  const [selectedFoodService, setSelectedFoodService] = useState<FoodService | null>(null);

  const [isShuttleModalOpen, setIsShuttleModalOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<ShuttleRoute | null>(null);

  // Hydration state
  const [waterGlasses, setWaterGlasses] = useState(4);
  const [refillToast, setRefillToast] = useState<string | null>(null);

  // Drone Camera Simulation State
  const [cameraMode, setCameraMode] = useState<'HD' | 'THERMAL' | 'NIGHT'>('HD');
  const [isLiveStreamExpanded, setIsLiveStreamExpanded] = useState(false);

  const areas = ['ALL', 'NASHIK', 'PANCHAVATI', 'TRIMBAKESHWAR', 'RAMKUND', 'TAPOVAN'];

  // Handle reporting water refill
  const handleReportRefill = (stationName: string) => {
    setRefillToast(`Refill request logged for ${stationName}. NMC Water Tanker dispatched!`);
    setTimeout(() => setRefillToast(null), 4000);
  };

  // Filtered Water Stations
  const filteredWater = MOCK_WATER_STATIONS.filter((ws) => {
    const matchArea = selectedArea === 'ALL' || ws.area === selectedArea;
    const matchSearch =
      searchQuery.trim() === '' ||
      ws.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ws.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchArea && matchSearch;
  });

  // Filtered Drones
  const filteredDrones = MOCK_DRONE_UNITS.filter((d) => {
    const matchSearch =
      searchQuery.trim() === '' ||
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.unitType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.sector.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSearch;
  });

  // Filtered Shuttles
  const filteredShuttles = MOCK_SHUTTLE_ROUTES.filter((r) => {
    const matchArea = selectedArea === 'ALL' || r.area === selectedArea;
    const matchSearch =
      searchQuery.trim() === '' ||
      r.routeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.routeNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchArea && matchSearch;
  });

  // Filtered Food Services
  const filteredFood = MOCK_FOOD_SERVICES.filter((f) => {
    const matchArea = selectedArea === 'ALL' || f.area === selectedArea;
    const matchSearch =
      searchQuery.trim() === '' ||
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.todayMenu.some((m) => m.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchArea && matchSearch;
  });

  return (
    <div className="flex flex-col gap-5 pb-24 md:pb-12 max-w-5xl mx-auto w-full px-4 sm:px-6 animate-fade-in select-none">
      {/* 1. Header Banner */}
      <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#46DFA6] bg-[#46DFA6]/10 px-2 py-0.5 rounded border border-[#46DFA6]/30 uppercase tracking-wider">
              24/7 ACTIVE PILGRIM SERVICES
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#fadcd7] tracking-tight mt-1">
            Kumbh Seva &amp; Safety Hub
          </h1>
          <p className="text-xs sm:text-sm text-[#e5bdb8]">
            Instant access to drinking water, aerial drone rescue, electric shuttles &amp; free Mahaprasad
          </p>
        </div>

        {/* View on Map Link */}
        <button
          onClick={() => onNavigateToMap(activeTab)}
          className="px-3.5 py-2 rounded-xl bg-[#2196F3] hover:bg-[#1e88e5] text-white text-xs font-extrabold flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer whitespace-nowrap"
        >
          <span className="material-symbols-outlined text-[18px]">map</span>
          View on Live Map
        </button>
      </section>

      {/* 2. Top 4 Service Category Tabs */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {[
          {
            id: 'water' as const,
            label: 'Water Stations',
            subLabel: 'Free RO & ORS',
            icon: 'water_drop',
            color: 'text-[#00e5ff]',
            borderActive: 'border-[#00e5ff] bg-[#00e5ff]/10',
          },
          {
            id: 'drone' as const,
            label: 'Drone Rescue',
            subLabel: 'Lifebuoy & Air Guard',
            icon: 'flight_takeoff',
            color: 'text-[#ff8c00]',
            borderActive: 'border-[#ff8c00] bg-[#ff8c00]/10',
          },
          {
            id: 'shuttle' as const,
            label: 'Shuttle Transit',
            subLabel: 'Electric Ring Buses',
            icon: 'electric_rickshaw',
            color: 'text-[#46DFA6]',
            borderActive: 'border-[#46DFA6] bg-[#46DFA6]/10',
          },
          {
            id: 'food' as const,
            label: 'Food Services',
            subLabel: 'Maha Prasad Langar',
            icon: 'restaurant',
            color: 'text-[#FFD700]',
            borderActive: 'border-[#FFD700] bg-[#FFD700]/10',
          },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`p-3 rounded-2xl border flex flex-col items-center justify-center text-center gap-1.5 transition-all cursor-pointer ${
                isActive
                  ? `${tab.borderActive} shadow-lg scale-[1.02]`
                  : 'bg-[#1B2025] border-[#5c403c]/40 hover:bg-[#252a30] text-[#e5bdb8]'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tab.color} bg-[#0F1419] border border-current/30`}>
                <span className="material-symbols-outlined text-[22px]">{tab.icon}</span>
              </div>
              <div>
                <p className={`text-xs font-extrabold ${isActive ? 'text-white' : 'text-[#fadcd7]'}`}>
                  {tab.label}
                </p>
                <p className="text-[10px] text-[#ac8884]">{tab.subLabel}</p>
              </div>
            </button>
          );
        })}
      </section>

      {/* 3. Search & Area Chips Filter */}
      <section className="flex flex-col gap-2.5">
        <div className="relative w-full h-11 bg-[#1B2025] rounded-xl border border-[#5c403c]/60 shadow-sm flex items-center px-3">
          <span className="material-symbols-outlined text-[#ac8884] text-[20px] mr-2">search</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${
              activeTab === 'water'
                ? 'water kiosks, RO booths, or Ghat steps...'
                : activeTab === 'drone'
                ? 'drone units, river patrol, or search zones...'
                : activeTab === 'shuttle'
                ? 'shuttle routes, stops, or bus numbers...'
                : 'Annakshetras, langar menus, or Prasad timings...'
            }`}
            className="w-full bg-transparent text-xs sm:text-sm text-[#fadcd7] placeholder-[#ac8884] focus:outline-none"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-[#ac8884] hover:text-white p-1">
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>

        {/* Area filter pills */}
        <div className="overflow-x-auto no-scrollbar py-0.5">
          <div className="flex gap-1.5 w-max">
            {areas.map((area) => (
              <button
                key={area}
                onClick={() => setSelectedArea(area)}
                className={`h-7 px-3 rounded-lg text-[11px] font-bold transition-all ${
                  selectedArea === area
                    ? 'bg-[#ff5545] text-white shadow-sm'
                    : 'bg-[#1B2025] text-[#e5bdb8] border border-[#5c403c]/40 hover:bg-[#252a30]'
                }`}
              >
                {area === 'ALL' ? '🌐 All Sectors' : area}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Toast message */}
      {refillToast && (
        <div className="bg-[#00e5ff]/20 border border-[#00e5ff] text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg animate-bounce">
          <span className="material-symbols-outlined text-[#00e5ff]">check_circle</span>
          {refillToast}
        </div>
      )}

      {/* =========================================================
          TAB 1: WATER STATIONS (JAL SEVA)
          ========================================================= */}
      {activeTab === 'water' && (
        <div className="space-y-4">
          {/* Hydration Assistant & Logger Card */}
          <div className="bg-gradient-to-r from-[#00384d] via-[#10202c] to-[#00384d] border border-[#00e5ff]/40 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00e5ff] text-[20px]">local_drink</span>
                <h3 className="text-base font-extrabold text-white">Daily Pilgrim Hydration Assistant</h3>
              </div>
              <p className="text-xs text-[#e5bdb8] mt-1 max-w-md">
                Kumbh climate recommendation: Drink at least 3.0 Liters daily to avoid heat exhaustion. 48 free RO booths available every 200m.
              </p>
            </div>

            <div className="flex items-center gap-3 bg-[#0F1419]/80 p-2.5 rounded-xl border border-[#00e5ff]/30">
              <div>
                <p className="text-[10px] uppercase font-bold text-[#ac8884]">Logged Today</p>
                <p className="text-base font-extrabold text-[#00e5ff]">
                  {waterGlasses * 250} ml / 3000 ml
                </p>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => setWaterGlasses((prev) => Math.max(0, prev - 1))}
                  className="w-8 h-8 rounded-lg bg-[#2c1b19] hover:bg-[#372623] text-white font-extrabold text-sm flex items-center justify-center border border-[#5c403c]"
                  title="Remove 250ml"
                >
                  -
                </button>
                <button
                  onClick={() => setWaterGlasses((prev) => prev + 1)}
                  className="w-8 h-8 rounded-lg bg-[#00e5ff] hover:bg-[#00cde6] text-black font-extrabold text-sm flex items-center justify-center shadow-md active:scale-95 transition-all"
                  title="Add 250ml Glass"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Water Stations List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredWater.map((station) => (
              <div
                key={station.id}
                className="bg-[#1B2025] border border-[#5c403c]/40 rounded-2xl p-4 flex flex-col justify-between hover:border-[#00e5ff]/50 transition-all shadow-md group"
              >
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-xl bg-[#00e5ff]/15 text-[#00e5ff] flex items-center justify-center border border-[#00e5ff]/40 shrink-0">
                        <span className="material-symbols-outlined text-[22px]">water_drop</span>
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm sm:text-base text-white group-hover:text-[#00e5ff] transition-colors">
                          {station.name}
                        </h4>
                        <p className="text-xs text-[#e5bdb8] line-clamp-1">{station.location}</p>
                      </div>
                    </div>

                    <span className="text-xs font-bold text-[#ffb77d] bg-[#2c1b19] px-2 py-0.5 rounded border border-[#5c403c] shrink-0">
                      {station.distanceKm} km
                    </span>
                  </div>

                  {/* Tank Level & Specs */}
                  <div className="mt-3.5 space-y-2 bg-[#0F1419] p-3 rounded-xl border border-[#5c403c]/30">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#ac8884] font-bold">Tank Water Level:</span>
                      <span
                        className={`font-extrabold ${
                          station.tankLevelPercent > 75
                            ? 'text-[#46DFA6]'
                            : station.tankLevelPercent > 40
                            ? 'text-[#FFD700]'
                            : 'text-[#F44336]'
                        }`}
                      >
                        💧 {station.tankLevelPercent}% Full ({station.refilledAtAgo})
                      </span>
                    </div>

                    <div className="w-full bg-[#2c1b19] h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-700 ${
                          station.tankLevelPercent > 75
                            ? 'bg-[#46DFA6]'
                            : station.tankLevelPercent > 40
                            ? 'bg-[#FFD700]'
                            : 'bg-[#F44336]'
                        }`}
                        style={{ width: `${station.tankLevelPercent}%` }}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                      <div className="text-[#fadcd7]">
                        <span className="text-[#ac8884]">Type:</span> <strong>{station.type}</strong>
                      </div>
                      <div className="text-[#fadcd7]">
                        <span className="text-[#ac8884]">Dispensers:</span> <strong>{station.dispensersCount} Taps</strong>
                      </div>
                      <div className="text-[#fadcd7]">
                        <span className="text-[#ac8884]">Wait Time:</span> <strong className="text-[#46DFA6]">~{station.queueWaitMins} min</strong>
                      </div>
                      <div className="text-[#fadcd7]">
                        <span className="text-[#ac8884]">By:</span> <span className="text-[10px] text-[#e5bdb8] truncate">{station.managedBy}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[#5c403c]/30">
                  <button
                    onClick={() => onNavigateToMap('water')}
                    className="flex-1 py-2 bg-[#2c1b19] hover:bg-[#372623] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 border border-[#5c403c] transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px] text-[#00e5ff]">directions</span>
                    Directions
                  </button>

                  <button
                    onClick={() => handleReportRefill(station.name)}
                    className="py-2 px-3 bg-[#00e5ff]/15 hover:bg-[#00e5ff]/25 text-[#00e5ff] text-xs font-extrabold rounded-xl border border-[#00e5ff]/40 transition-colors"
                    title="Alert NMC Jal Vibhag Tanker"
                  >
                    Request Refill
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================
          TAB 2: DRONE RESCUE SAFETY SERVICES
          ========================================================= */}
      {activeTab === 'drone' && (
        <div className="space-y-4">
          {/* Top Live Drone Grid Telemetry Card */}
          <div className="bg-[#121820] border-2 border-[#ff8c00] rounded-2xl overflow-hidden shadow-[0_0_35px_rgba(255,140,0,0.25)]">
            <div className="bg-[#1a222c] p-3.5 sm:p-4 border-b border-[#ff8c00]/40 flex flex-wrap justify-between items-center gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-3 h-3 rounded-full bg-[#46DFA6] animate-ping" />
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#ff8c00]">flight_takeoff</span>
                    Godavari Aerial Drone Safety Network
                  </h3>
                  <p className="text-[11px] text-[#e5bdb8]">4 Automated Lifesaving UAVs in Active Grid</p>
                </div>
              </div>

              {/* Mode Switchers */}
              <div className="flex items-center gap-1 bg-[#0F1419] p-1 rounded-xl border border-[#5c403c]">
                {(['HD', 'THERMAL', 'NIGHT'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setCameraMode(mode)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold transition-all ${
                      cameraMode === mode
                        ? 'bg-[#ff8c00] text-black shadow-sm'
                        : 'text-[#ac8884] hover:text-white'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Simulated Live Camera Telemetry Screen */}
            <div className="relative h-60 sm:h-72 bg-[#060a0e] overflow-hidden flex items-center justify-center">
              {/* Background Video Simulation */}
              <img
                src={
                  cameraMode === 'THERMAL'
                    ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuBtZRuf0q1CqhtsMDT8sYjk0PN3i4a1EboSyuTDYBk57Pf47bz4zy07-Pa-oamhgBpqyCpZIsgG_9I-fzhJeJfNhhI2aRdsaEnqAJ9OpD1jv_awex-AuKqgfHm5tepQ4rJBQLfOyXAnZh50d_NVAIsdf9J27ROH7ZYB9DVQ61HScX5-qrdJydBL6AMJXfI-J1PSjF4rJAAiyAKrr3xVdynnx3qLVLDxwEhaUIiUNRJ0WS4Az3U67OO0GQ'
                    : 'https://lh3.googleusercontent.com/aida/AEtjO1VEp9Vm1fjWHW0CmiYfOd6jsD3-S5d0Bf6kzw2vtD_j046d_Ga7HyJ4NWmKxexXPi37UzUoUHSSlKZ5peCV15VeuXe8iDTqhYZBFbq-WcqBL3E7m3p2BLbWJ-gDdScC4tWTvbAyXRuHvvNWMIDnCm-emy2I7_PiptnGIIb65hwjFRmg4gyzV0Zwff0Khh97ivMZ85mU8vL7y_Z2IjY3Nv_qTxefJFVaLL-VF2v4Bdt_CtzLNrP23O_Y6ngE'
                }
                alt="Drone Live Feed"
                className={`w-full h-full object-cover transition-all duration-500 ${
                  cameraMode === 'THERMAL'
                    ? 'filter contrast-200 hue-rotate-90 saturate-200 invert'
                    : cameraMode === 'NIGHT'
                    ? 'filter contrast-150 brightness-75 sepia-[0.8] hue-rotate-[90deg]'
                    : 'filter brightness-90 contrast-110'
                }`}
              />

              {/* HUD Overlay Crosshair & Reticle */}
              <div className="absolute inset-0 bg-tactical-grid opacity-30 pointer-events-none" />

              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-24 h-24 border border-[#ff8c00]/60 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-[#ff8c00] animate-ping" />
                  <div className="w-36 h-[1px] bg-[#ff8c00]/40 absolute" />
                  <div className="h-36 w-[1px] bg-[#ff8c00]/40 absolute" />
                </div>
              </div>

              {/* HUD Telemetry stats on corners */}
              <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-[#ff8c00]/50 text-[10px] font-mono text-white space-y-0.5">
                <p className="text-[#ff8c00] font-bold">CAM: GARUDA-01 LIVE</p>
                <p>ALT: 48.4m | SPD: 28 km/h</p>
                <p>LAT: 20.0061° N | LON: 73.7908° E</p>
              </div>

              <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-[#46DFA6]/50 text-[10px] font-mono text-[#46DFA6] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#46DFA6] animate-pulse" />
                <span>BATTERY: 86% | 2x BUOYS READY</span>
              </div>

              {/* Center Dispatch Action Button */}
              <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center bg-[#0F1419]/90 backdrop-blur-md p-2 rounded-xl border border-[#ff8c00]/60">
                <div className="text-xs text-white pl-2">
                  <span className="text-[#ff8c00] font-extrabold">EMERGENCY OVERHEAD RESCUE?</span>
                  <p className="text-[10px] text-[#e5bdb8]">Summon instant drone lifebuoy drop in &lt;60s</p>
                </div>

                <button
                  onClick={() => {
                    setSelectedDrone(MOCK_DRONE_UNITS[0]);
                    setIsDroneModalOpen(true);
                  }}
                  className="px-4 py-2 bg-[#ff8c00] hover:bg-[#e67e00] text-black font-extrabold text-xs rounded-lg shadow-lg flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">send</span>
                  REQUEST DRONE DISPATCH
                </button>
              </div>
            </div>
          </div>

          {/* List of 4 Active Drones */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredDrones.map((drone) => (
              <div
                key={drone.id}
                className="bg-[#1B2025] border border-[#5c403c]/40 rounded-2xl p-4 flex flex-col justify-between hover:border-[#ff8c00]/60 transition-all shadow-md"
              >
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-[#ff8c00]/20 text-[#ff8c00] flex items-center justify-center border border-[#ff8c00]/40 shrink-0">
                        <span className="material-symbols-outlined text-[22px]">flight</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-extrabold text-sm text-white">{drone.name}</h4>
                          <span className="text-[9px] bg-[#ff8c00]/20 text-[#ff8c00] px-1.5 py-0.2 rounded font-mono font-bold">
                            {drone.callSign}
                          </span>
                        </div>
                        <p className="text-xs text-[#46DFA6] font-bold">{drone.unitType}</p>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase border ${
                        drone.status === 'PATROLLING'
                          ? 'bg-[#46DFA6]/15 text-[#46DFA6] border-[#46DFA6]/30'
                          : 'bg-[#FFD700]/15 text-[#FFD700] border-[#FFD700]/30'
                      }`}
                    >
                      {drone.status}
                    </span>
                  </div>

                  {/* Specs Strip */}
                  <div className="mt-3 bg-[#0F1419] p-3 rounded-xl border border-[#5c403c]/30 space-y-1.5 text-xs">
                    <div className="flex justify-between text-[#fadcd7]">
                      <span className="text-[#ac8884]">Current Zone:</span>
                      <span className="font-bold text-white text-right">{drone.currentZone}</span>
                    </div>
                    <div className="flex justify-between text-[#fadcd7]">
                      <span className="text-[#ac8884]">Equipped Payload:</span>
                      <span className="font-bold text-[#ffb77d] text-right">{drone.payloadEquipped}</span>
                    </div>
                    <div className="flex justify-between text-[#fadcd7] pt-1 border-t border-[#5c403c]/30">
                      <span className="text-[#ac8884]">Battery &amp; Altitude:</span>
                      <span className="text-white">⚡ {drone.batteryPercent}% • {drone.altitudeMeters}m altitude</span>
                    </div>
                  </div>
                </div>

                {/* Card Action */}
                <div className="flex gap-2 mt-4 pt-3 border-t border-[#5c403c]/30">
                  <button
                    onClick={() => {
                      setSelectedDrone(drone);
                      setIsDroneModalOpen(true);
                    }}
                    className="flex-1 py-2 bg-[#ff8c00] hover:bg-[#e67e00] text-black font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">send</span>
                    Dispatch to My Coordinates
                  </button>

                  <button
                    onClick={() => onNavigateToMap('drone')}
                    className="py-2 px-3 bg-[#2c1b19] hover:bg-[#372623] text-white text-xs font-bold rounded-xl border border-[#5c403c]"
                  >
                    Map Tracker
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================
          TAB 3: SHUTTLE SERVICES (SIMHASTHA E-SHUTTLE)
          ========================================================= */}
      {activeTab === 'shuttle' && (
        <div className="space-y-4">
          {/* Banner */}
          <div className="bg-gradient-to-r from-[#003826] via-[#0d281e] to-[#003826] border border-[#46DFA6]/40 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#46DFA6] text-[22px]">electric_rickshaw</span>
                <h3 className="text-base font-extrabold text-white">{t('freeShuttleTitle', 'Free Kumbhmela Electric Shuttles')}</h3>
              </div>
              <p className="text-xs text-[#e5bdb8] mt-1 max-w-md">
                28 zero-emission electric buses operating every 4-6 minutes across all major Kumbh parking hubs, Ghats, and railway terminals.
              </p>
            </div>

            <div className="bg-[#0F1419]/80 px-3 py-2 rounded-xl border border-[#46DFA6]/40 text-xs">
              <p className="text-[10px] uppercase font-bold text-[#ac8884]">Pilgrim Fare</p>
              <p className="text-base font-extrabold text-[#46DFA6]">₹0 (Free Seva)</p>
            </div>
          </div>

          {/* Shuttle Routes List */}
          <div className="space-y-3.5">
            {filteredShuttles.map((route) => (
              <div
                key={route.id}
                className="bg-[#1B2025] border border-[#5c403c]/40 rounded-2xl p-4 hover:border-[#46DFA6]/60 transition-all shadow-md"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-[#5c403c]/30">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-[#46DFA6] bg-[#46DFA6]/15 px-2 py-0.5 rounded border border-[#46DFA6]/30">
                        {route.routeNumber}
                      </span>
                      <h4 className="font-extrabold text-base text-white">{route.routeName}</h4>
                    </div>
                    <p className="text-xs text-[#e5bdb8] mt-0.5">
                      {route.from} ➔ {route.to}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#ffb77d] font-bold bg-[#2c1b19] px-2.5 py-1 rounded-lg border border-[#5c403c]">
                      ⚡ Every {route.frequencyMins} mins
                    </span>
                    <button
                      onClick={() => {
                        setSelectedRoute(route);
                        setIsShuttleModalOpen(true);
                      }}
                      className="px-3.5 py-1.5 bg-[#46DFA6] hover:bg-[#3ecb96] text-[#003826] font-extrabold text-xs rounded-xl shadow active:scale-95 transition-all cursor-pointer whitespace-nowrap"
                    >
                      Book Priority Pass
                    </button>
                  </div>
                </div>

                {/* Stops Timeline */}
                <div className="py-3">
                  <p className="text-[10px] font-bold text-[#ac8884] uppercase tracking-wider mb-2">
                    Route Stops ({route.stops.length} Stations)
                  </p>
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                    {route.stops.map((stop, sIdx) => (
                      <React.Fragment key={stop}>
                        <span className="bg-[#0F1419] text-[#fadcd7] border border-[#5c403c]/50 text-xs px-2.5 py-1 rounded-lg font-medium whitespace-nowrap">
                          🚏 {stop}
                        </span>
                        {sIdx < route.stops.length - 1 && (
                          <span className="material-symbols-outlined text-xs text-[#46DFA6]">arrow_forward</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* Live Approaching Vehicles */}
                {route.vehicles.length > 0 && (
                  <div className="bg-[#0F1419] p-3 rounded-xl border border-[#5c403c]/30 space-y-2 mt-1">
                    <p className="text-[11px] font-bold text-[#46DFA6] uppercase flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">sensors</span>
                      Live Approaching Shuttles
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {route.vehicles.map((v) => (
                        <div key={v.id} className="bg-[#1B2025] p-2.5 rounded-lg border border-[#5c403c]/40 text-xs flex justify-between items-center">
                          <div>
                            <p className="font-extrabold text-white">{v.vehicleNumber}</p>
                            <p className="text-[11px] text-[#e5bdb8]">At {v.currentStop} ➔ {v.nextStop}</p>
                            <div className="flex items-center gap-2 mt-1 text-[10px] text-[#ac8884]">
                              <span>Seats: <strong className="text-[#46DFA6]">{v.occupancy}/{v.totalSeats}</strong></span>
                              {v.isWheelchairAccessible && <span className="text-[#2196F3] font-bold">♿ Wheelchair Ramp</span>}
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-base font-extrabold text-[#46DFA6] animate-pulse">
                              {v.etaMins} mins
                            </span>
                            <p className="text-[9px] text-[#ac8884]">ETA Arrival</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================
          TAB 4: FOOD SERVICES (MAHA PRASAD & ANNAKSHETRA)
          ========================================================= */}
      {activeTab === 'food' && (
        <div className="space-y-4">
          {/* Banner */}
          <div className="bg-gradient-to-r from-[#3d2a00] via-[#241a05] to-[#3d2a00] border border-[#FFD700]/40 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#FFD700] text-[22px]">restaurant</span>
                <h3 className="text-base font-extrabold text-white">Maha Prasad &amp; Free Annakshetra Seva</h3>
              </div>
              <p className="text-xs text-[#e5bdb8] mt-1 max-w-md">
                Over 100,000 pilgrims served hot Satvik Prasad daily. Purified kitchens with FSSAI hygiene certification.
              </p>
            </div>

            <div className="bg-[#0F1419]/80 px-3.5 py-2 rounded-xl border border-[#FFD700]/40 text-xs">
              <p className="text-[10px] uppercase font-bold text-[#ac8884]">Meals Served Today</p>
              <p className="text-base font-extrabold text-[#FFD700]">94,550+ Devotees</p>
            </div>
          </div>

          {/* Food Centers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredFood.map((center) => (
              <div
                key={center.id}
                className="bg-[#1B2025] border border-[#5c403c]/40 rounded-2xl p-4 flex flex-col justify-between hover:border-[#FFD700]/60 transition-all shadow-md"
              >
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase text-[#FFD700] bg-[#FFD700]/10 px-2 py-0.5 rounded border border-[#FFD700]/30">
                        {center.type}
                      </span>
                      <h4 className="font-extrabold text-base text-white mt-1">{center.name}</h4>
                      <p className="text-xs text-[#e5bdb8]">{center.location}</p>
                    </div>

                    <span className="text-xs font-bold text-[#ffb77d] bg-[#2c1b19] px-2 py-0.5 rounded border border-[#5c403c] shrink-0">
                      {center.distanceKm} km
                    </span>
                  </div>

                  {/* Timing & Menu */}
                  <div className="mt-3.5 bg-[#0F1419] p-3 rounded-xl border border-[#5c403c]/30 space-y-2 text-xs">
                    <div className="flex justify-between items-center text-[#fadcd7]">
                      <span className="text-[#ac8884]">Meal Timings:</span>
                      <span className="font-bold text-white text-right">{center.mealTimings}</span>
                    </div>

                    <div className="flex justify-between items-center text-[#fadcd7]">
                      <span className="text-[#ac8884]">Queue Wait:</span>
                      <span className="font-bold text-[#46DFA6]">🟢 ~{center.queueWaitMins} mins wait</span>
                    </div>

                    <div className="pt-1.5 border-t border-[#5c403c]/30">
                      <p className="text-[10px] font-bold text-[#FFD700] uppercase mb-1">Today's Satvik Menu:</p>
                      <div className="flex flex-wrap gap-1">
                        {center.todayMenu.map((menuItem, mIdx) => (
                          <span key={mIdx} className="bg-[#2c1b19] border border-[#5c403c] text-[#fadcd7] px-2 py-0.5 rounded text-[10px]">
                            {menuItem}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[#5c403c]/30">
                  <button
                    onClick={() => {
                      setSelectedFoodService(center);
                      setIsPrasadModalOpen(true);
                    }}
                    className="flex-1 py-2.5 bg-[#FFD700] hover:bg-[#ffca00] active:scale-95 text-black font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">qr_code_2</span>
                    Get Free Digital Token
                  </button>

                  <button
                    onClick={() => onNavigateToMap('food')}
                    className="py-2.5 px-3 bg-[#2c1b19] hover:bg-[#372623] text-white text-xs font-bold rounded-xl border border-[#5c403c]"
                  >
                    Map
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Drone Dispatch Modal */}
      <DroneDispatchModal
        isOpen={isDroneModalOpen}
        onClose={() => setIsDroneModalOpen(false)}
        selectedDrone={selectedDrone}
      />

      {/* Prasad Token Modal */}
      <PrasadTokenModal
        isOpen={isPrasadModalOpen}
        onClose={() => setIsPrasadModalOpen(false)}
        foodService={selectedFoodService}
        userProfile={userProfile}
      />

      {/* Shuttle Booking Modal */}
      <ShuttleBookingModal
        isOpen={isShuttleModalOpen}
        onClose={() => setIsShuttleModalOpen(false)}
        route={selectedRoute}
        userProfile={userProfile}
      />
    </div>
  );
};
