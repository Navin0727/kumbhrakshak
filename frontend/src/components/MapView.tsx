import React, { useState, useMemo } from 'react';
import { SafetyPoi, PoiCategory, Language } from '../types';
import { MOCK_SAFETY_POIS } from '../data/mockData';
import { useTranslation } from '../utils/translations';

interface MapViewProps {
  language?: Language;
  initialCategory?: PoiCategory | null;
  onOpenSOS: () => void;
  onSelectPoiForEmergency?: (poi: SafetyPoi) => void;
}

export const MapView: React.FC<MapViewProps> = ({
  language = 'en',
  initialCategory,
  onOpenSOS,
}) => {
  const { t } = useTranslation(language);
  const [selectedArea, setSelectedArea] = useState<string>('NASHIK');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPoi, setSelectedPoi] = useState<SafetyPoi>(MOCK_SAFETY_POIS[0]);
  const [isBottomSheetExpanded, setIsBottomSheetExpanded] = useState(false);
  const [activeLayer, setActiveLayer] = useState<'standard' | 'heatmap' | 'corridors'>('standard');
  const [myLocationPulse, setMyLocationPulse] = useState({ x: 50, y: 52 });
  const [showLayerPicker, setShowLayerPicker] = useState(false);
  const [dialingNumber, setDialingNumber] = useState<string | null>(null);

  const areas = ['NASHIK', 'PANCHAVATI', 'TRIMBAKESHWAR', 'RAMKUND', 'TAPOVAN'];
  const categories = [
    { id: 'ALL', label: t('allServices', 'All Services'), icon: 'apps' },
    { id: 'water', label: t('waterBooths', 'Water Booths'), icon: 'water_drop' },
    { id: 'drone', label: t('droneRescue', 'Drone Rescue'), icon: 'flight_takeoff' },
    { id: 'shuttle', label: t('eShuttles', 'E-Shuttles'), icon: 'electric_rickshaw' },
    { id: 'food', label: t('mahaPrasad', 'Maha Prasad'), icon: 'restaurant' },
    { id: 'hospital', label: t('medicalIcu', 'Medical / ICU'), icon: 'local_hospital' },
    { id: 'police', label: t('policeOutpost', 'Police Outpost'), icon: 'local_police' },
    { id: 'petrol', label: t('petrolEv', 'Petrol & EV'), icon: 'local_gas_station' },
    { id: 'booth', label: t('lostFound', 'Lost & Found'), icon: 'family_restroom' },
  ];

  const filteredPois = useMemo(() => {
    return MOCK_SAFETY_POIS.filter((poi) => {
      const matchArea = selectedArea === 'NASHIK' ? true : poi.area === selectedArea;
      const matchCategory = selectedCategory === 'ALL' ? true : poi.category === selectedCategory;
      const matchSearch =
        searchQuery.trim() === '' ||
        poi.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        poi.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        poi.sector.toLowerCase().includes(searchQuery.toLowerCase());

      return matchArea && matchCategory && matchSearch;
    });
  }, [selectedArea, selectedCategory, searchQuery]);

  const handleRecenter = () => {
    setMyLocationPulse({ x: 50 + (Math.random() * 4 - 2), y: 52 + (Math.random() * 4 - 2) });
  };

  const handleCall = (phone: string, name: string) => {
    setDialingNumber(phone);
    setTimeout(() => {
      alert(`Dialing emergency helpline for ${name} (${phone})`);
      setDialingNumber(null);
    }, 400);
  };

  const handleGetDirections = (poi: SafetyPoi) => {
    alert(`Routing active to ${poi.name} (${poi.distanceKm} km away). Recommended safe pedestrian corridor via Sector 4 North Gate.`);
  };

  return (
    <div className="relative w-full h-[calc(100vh-56px)] md:h-[calc(100vh-64px)] overflow-hidden bg-[#10151c] select-none">
      {/* Background Simulated Dark High-Contrast Tactical Map */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 filter brightness-90 contrast-125"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBtZRuf0q1CqhtsMDT8sYjk0PN3i4a1EboSyuTDYBk57Pf47bz4zy07-Pa-oamhgBpqyCpZIsgG_9I-fzhJeJfNhhI2aRdsaEnqAJ9OpD1jv_awex-AuKqgfHm5tepQ4rJBQLfOyXAnZh50d_NVAIsdf9J27ROH7ZYB9DVQ61HScX5-qrdJydBL6AMJXfI-J1PSjF4rJAAiyAKrr3xVdynnx3qLVLDxwEhaUIiUNRJ0WS4Az3U67OO0GQ')`,
          }}
        />

        {/* Tactical Grid / Heatmap Overlay */}
        <div className="absolute inset-0 bg-tactical-grid opacity-35" />

        {activeLayer === 'heatmap' && (
          <div className="absolute inset-0 bg-gradient-to-tr from-[#46DFA6]/15 via-[#FFD700]/20 to-[#F44336]/15 mix-blend-color-dodge pointer-events-none" />
        )}

        {activeLayer === 'corridors' && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-80" xmlns="http://www.w3.org/2000/svg">
            <path d="M 200 450 Q 350 380 520 420 T 780 340" fill="none" stroke="#2196F3" strokeWidth="4" strokeDasharray="8 6" />
            <path d="M 120 280 Q 300 320 480 360 T 820 490" fill="none" stroke="#46DFA6" strokeWidth="5" />
          </svg>
        )}

        {/* User My Location Marker */}
        <div
          className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 transition-all duration-500"
          style={{ left: `${myLocationPulse.x}%`, top: `${myLocationPulse.y}%` }}
        >
          <div className="relative flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-[#2196F3]/30 animate-ping absolute" />
            <div className="w-5 h-5 rounded-full bg-[#2196F3] border-2 border-white shadow-lg flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white" />
            </div>
            <div className="absolute -bottom-5 bg-[#0F1419]/90 border border-[#2196F3] text-[9px] font-bold text-white px-1.5 py-0.2 rounded shadow whitespace-nowrap">
              You are here
            </div>
          </div>
        </div>

        {/* POI Markers on Map */}
        {filteredPois.map((poi) => {
          const isSelected = selectedPoi.id === poi.id;
          let markerColor = 'bg-[#2196F3] text-white border-white';
          let icon = 'local_hospital';

          if (poi.category === 'police') {
            markerColor = 'bg-[#002b4d] text-white border-[#2196F3]';
            icon = 'local_police';
          } else if (poi.category === 'petrol') {
            markerColor = 'bg-[#372623] text-white border-[#ac8884]';
            icon = 'local_gas_station';
          } else if (poi.category === 'booth') {
            markerColor = 'bg-[#FFD700] text-black border-white';
            icon = 'family_restroom';
          } else if (poi.category === 'water') {
            markerColor = 'bg-[#00e5ff] text-black border-white';
            icon = 'water_drop';
          } else if (poi.category === 'drone') {
            markerColor = 'bg-[#ff8c00] text-black border-white';
            icon = 'flight_takeoff';
          } else if (poi.category === 'shuttle') {
            markerColor = 'bg-[#46DFA6] text-black border-white';
            icon = 'electric_rickshaw';
          } else if (poi.category === 'food') {
            markerColor = 'bg-[#FFB300] text-black border-white';
            icon = 'restaurant';
          }

          return (
            <button
              key={poi.id}
              onClick={() => {
                setSelectedPoi(poi);
                setIsBottomSheetExpanded(true);
              }}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-15 group cursor-pointer focus:outline-none transition-all duration-300"
              style={{ left: `${poi.coordinates.x}%`, top: `${poi.coordinates.y}%` }}
              title={poi.name}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center border-2 shadow-xl transition-all ${
                  isSelected ? 'scale-125 ring-4 ring-[#ffb4a9]' : 'hover:scale-110'
                } ${markerColor}`}
              >
                <span className="material-symbols-outlined text-[18px] font-bold">{icon}</span>
              </div>

              {/* Marker Tooltip label */}
              <div
                className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-[#171c21]/95 text-[#fadcd7] px-2 py-0.5 rounded text-[10px] font-bold border border-[#5c403c] whitespace-nowrap shadow-md transition-opacity ${
                  isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}
              >
                {poi.name} ({poi.distanceKm} km)
              </div>
            </button>
          );
        })}
      </div>

      {/* Top Floating Controls Overlay */}
      <div className="absolute top-0 left-0 right-0 z-30 p-3 pt-3 flex flex-col gap-2 pointer-events-none">
        {/* Status Badge & Search Bar */}
        <div className="w-full max-w-md mx-auto flex flex-col gap-2 pointer-events-auto">
          {/* Live Indicator */}
          <div className="self-center flex items-center gap-2 bg-[#1B2025]/90 backdrop-blur-md px-3.5 py-1 rounded-full border border-[#5c403c] shadow-md">
            <div className="w-2 h-2 rounded-full bg-[#46DFA6] animate-pulse-dot" />
            <span className="text-[11px] font-bold text-[#fadcd7] uppercase tracking-wider">
              LIVE • Sector 4 Panchavati Map
            </span>
          </div>

          {/* Search Bar */}
          <div className="relative w-full h-11 bg-[#1B2025]/95 backdrop-blur-md rounded-xl border border-[#5c403c] shadow-lg flex items-center px-3">
            <span className="material-symbols-outlined text-[#ac8884] text-[20px] mr-2">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Nashik, Panchavati, Hospital, Ghat..."
              className="w-full bg-transparent text-sm text-[#fadcd7] placeholder-[#ac8884] focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-[#ac8884] hover:text-white p-1"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Area Chips Bar */}
        <div className="w-full max-w-xl mx-auto overflow-x-auto no-scrollbar py-0.5 pointer-events-auto">
          <div className="flex gap-1.5 w-max px-1">
            {areas.map((area) => (
              <button
                key={area}
                onClick={() => setSelectedArea(area)}
                className={`h-8 px-3.5 rounded-full text-xs font-bold whitespace-nowrap transition-all shadow-sm ${
                  selectedArea === area
                    ? 'bg-[#ff5545] text-white border border-[#ff8a80]'
                    : 'bg-[#1B2025]/90 text-[#e5bdb8] border border-[#5c403c] hover:bg-[#2c1b19]'
                }`}
              >
                {area}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="w-full max-w-xl mx-auto overflow-x-auto no-scrollbar py-0.5 pointer-events-auto">
          <div className="flex gap-1.5 w-max px-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`h-7 px-2.5 rounded-lg text-[11px] font-semibold flex items-center gap-1 whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-[#2196F3] text-white'
                    : 'bg-[#171c21]/85 text-[#fadcd7] border border-[#5c403c]/60 hover:bg-[#252a30]'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right-Side Map Action Buttons */}
      <div className="absolute right-3.5 bottom-36 sm:bottom-40 z-30 flex flex-col gap-2.5">
        {/* Layer Selector */}
        <div className="relative">
          <button
            onClick={() => setShowLayerPicker(!showLayerPicker)}
            className="w-11 h-11 bg-[#1B2025] hover:bg-[#252a30] text-white rounded-full flex items-center justify-center border border-[#5c403c] shadow-xl transition-all"
            title="Toggle Map Layers"
          >
            <span className="material-symbols-outlined text-[22px]">layers</span>
          </button>

          {showLayerPicker && (
            <div className="absolute right-12 bottom-0 bg-[#171c21] border border-[#5c403c] rounded-xl p-2 shadow-2xl flex flex-col gap-1 w-36 text-xs">
              <button
                onClick={() => {
                  setActiveLayer('standard');
                  setShowLayerPicker(false);
                }}
                className={`text-left p-1.5 rounded font-bold ${
                  activeLayer === 'standard' ? 'bg-[#2196F3] text-white' : 'text-[#e5bdb8] hover:bg-[#2c1b19]'
                }`}
              >
                🗺️ Tactical Map
              </button>
              <button
                onClick={() => {
                  setActiveLayer('heatmap');
                  setShowLayerPicker(false);
                }}
                className={`text-left p-1.5 rounded font-bold ${
                  activeLayer === 'heatmap' ? 'bg-[#2196F3] text-white' : 'text-[#e5bdb8] hover:bg-[#2c1b19]'
                }`}
              >
                🔥 Crowd Density
              </button>
              <button
                onClick={() => {
                  setActiveLayer('corridors');
                  setShowLayerPicker(false);
                }}
                className={`text-left p-1.5 rounded font-bold ${
                  activeLayer === 'corridors' ? 'bg-[#2196F3] text-white' : 'text-[#e5bdb8] hover:bg-[#2c1b19]'
                }`}
              >
                🚶 Safe Corridors
              </button>
            </div>
          )}
        </div>

        {/* My Location Button */}
        <button
          onClick={handleRecenter}
          className="w-11 h-11 bg-[#2196F3] hover:bg-[#1e88e5] active:scale-95 text-white rounded-full flex items-center justify-center shadow-xl transition-all"
          title="Center on My Location"
        >
          <span className="material-symbols-outlined text-[22px] icon-fill">my_location</span>
        </button>
      </div>

      {/* Bottom Sheet Card for "Nearby Safety Services" (Image 3) */}
      <div className="absolute bottom-16 md:bottom-3 left-0 right-0 z-30 px-3 sm:px-4 w-full max-w-2xl mx-auto">
        <div className="bg-[#171c21]/95 backdrop-blur-md border border-[#5c403c] rounded-xl shadow-[0_-8px_30px_rgba(0,0,0,0.6)] overflow-hidden transition-all">
          {/* Pull Handle Header */}
          <div
            onClick={() => setIsBottomSheetExpanded(!isBottomSheetExpanded)}
            className="w-full py-2 flex flex-col items-center justify-center cursor-pointer hover:bg-[#252a30]/50 select-none"
          >
            <div className="w-12 h-1.5 bg-[#5c403c] rounded-full mb-1" />
            <div className="w-full px-4 flex justify-between items-center">
              <h2 className="text-xs sm:text-sm font-bold text-[#fadcd7] uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-[#2196F3]">near_me</span>
                Nearby Safety Services ({filteredPois.length} found)
              </h2>
              <span className="text-xs text-[#ffb77d] font-semibold flex items-center">
                {isBottomSheetExpanded ? 'Collapse' : 'Expand'}
                <span className="material-symbols-outlined text-sm">
                  {isBottomSheetExpanded ? 'expand_more' : 'expand_less'}
                </span>
              </span>
            </div>
          </div>

          {/* Active / Closest Service Highlight Card */}
          <div className="p-3.5 pt-1">
            <div className="bg-[#0F1419] border-l-4 border-[#2196F3] rounded-r-lg p-3 flex items-center justify-between shadow-sm border border-[#5c403c]/40">
              <div className="flex items-center gap-3 pr-2 min-w-0">
                <div className="w-10 h-10 shrink-0 bg-[#2196F3]/20 rounded flex items-center justify-center text-[#2196F3] border border-[#2196F3]/40">
                  <span className="material-symbols-outlined text-[22px]">
                    {selectedPoi.category === 'police'
                      ? 'local_police'
                      : selectedPoi.category === 'petrol'
                      ? 'local_gas_station'
                      : selectedPoi.category === 'booth'
                      ? 'family_restroom'
                      : selectedPoi.category === 'water'
                      ? 'water_drop'
                      : selectedPoi.category === 'drone'
                      ? 'flight_takeoff'
                      : selectedPoi.category === 'shuttle'
                      ? 'electric_rickshaw'
                      : selectedPoi.category === 'food'
                      ? 'restaurant'
                      : 'local_hospital'}
                  </span>
                </div>
                <div className="flex flex-col truncate">
                  <span className="font-bold text-sm text-[#fadcd7] truncate">
                    {selectedPoi.name}
                  </span>
                  <span className="text-xs text-[#e5bdb8] truncate">
                    {selectedPoi.distanceKm} km away • {selectedPoi.openStatus}
                  </span>
                </div>
              </div>

              {/* Action Buttons: Directions, Call, SOS */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => handleGetDirections(selectedPoi)}
                  className="w-10 h-10 bg-[#2c1b19] rounded-lg flex items-center justify-center text-[#fadcd7] border border-[#5c403c] hover:bg-[#372623] active:scale-95 transition-all"
                  title="Get Walking Route"
                >
                  <span className="material-symbols-outlined text-[20px]">directions</span>
                </button>

                <button
                  onClick={() => handleCall(selectedPoi.phone, selectedPoi.name)}
                  className="w-10 h-10 bg-[#F44336]/20 rounded-lg flex items-center justify-center text-[#F44336] border border-[#F44336]/50 hover:bg-[#F44336]/30 active:scale-95 transition-all"
                  title="Direct Call Helpline"
                >
                  <span className="material-symbols-outlined text-[20px] icon-fill">call</span>
                </button>

                <button
                  onClick={onOpenSOS}
                  className="px-2.5 h-10 bg-[#F44336] hover:bg-[#d32f2f] active:scale-95 text-white font-extrabold text-xs rounded-lg flex items-center justify-center shadow-[0_0_12px_rgba(244,67,54,0.4)] transition-all ml-0.5"
                  title="Trigger Emergency SOS"
                >
                  SOS
                </button>
              </div>
            </div>

            {/* Expanded List of all Nearby Services */}
            {isBottomSheetExpanded && (
              <div className="mt-3 max-h-48 overflow-y-auto space-y-2 pr-1 pt-1 border-t border-[#5c403c]/40">
                {filteredPois.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedPoi(item)}
                    className={`p-2.5 rounded-lg flex items-center justify-between cursor-pointer transition-colors ${
                      selectedPoi.id === item.id
                        ? 'bg-[#2c1b19] border border-[#ffb4a9]/50'
                        : 'bg-[#1B2025] hover:bg-[#252a30] border border-[#5c403c]/30'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="material-symbols-outlined text-sm text-[#2196F3]">
                        {item.category === 'police'
                          ? 'local_police'
                          : item.category === 'petrol'
                          ? 'local_gas_station'
                          : item.category === 'booth'
                          ? 'family_restroom'
                          : item.category === 'water'
                          ? 'water_drop'
                          : item.category === 'drone'
                          ? 'flight_takeoff'
                          : item.category === 'shuttle'
                          ? 'electric_rickshaw'
                          : item.category === 'food'
                          ? 'restaurant'
                          : 'local_hospital'}
                      </span>
                      <div className="truncate">
                        <p className="text-xs font-bold text-[#fadcd7] truncate">{item.name}</p>
                        <p className="text-[11px] text-[#ac8884]">{item.address}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#ffb77d] shrink-0 ml-2">
                      {item.distanceKm} km
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dialing Indicator Toast */}
      {dialingNumber && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-50 bg-[#0F1419] border-2 border-[#46DFA6] text-white px-4 py-2 rounded-full shadow-2xl flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#46DFA6] animate-ping" />
          <span className="text-xs font-bold">Connecting to {dialingNumber}...</span>
        </div>
      )}
    </div>
  );
};
