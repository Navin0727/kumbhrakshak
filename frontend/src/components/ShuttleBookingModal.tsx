import React, { useState } from 'react';
import { ShuttleRoute, UserProfile } from '../types';

interface ShuttleBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  route: ShuttleRoute | null;
  userProfile: UserProfile;
}

export const ShuttleBookingModal: React.FC<ShuttleBookingModalProps> = ({
  isOpen,
  onClose,
  route,
  userProfile,
}) => {
  const [pickupStop, setPickupStop] = useState(route?.stops[0] || 'Central Bus Stand');
  const [dropStop, setDropStop] = useState(route?.stops[route.stops.length - 1] || 'Ramkund Gate 1');
  const [seniorAssistance, setSeniorAssistance] = useState(true);
  const [wheelchairRequired, setWheelchairRequired] = useState(false);
  const [passengersCount, setPassengersCount] = useState(1);
  const [isBooked, setIsBooked] = useState(false);
  const [bookingRef, setBookingRef] = useState('SHT-2027-EV89');

  if (!isOpen || !route) return null;

  const handleConfirm = () => {
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    setBookingRef(`SHT-2027-EV${randomCode}`);
    setIsBooked(true);
  };

  const handleClose = () => {
    setIsBooked(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="bg-[#121820] border-2 border-[#2196F3] rounded-2xl w-full max-w-md overflow-hidden shadow-[0_0_40px_rgba(33,150,243,0.3)] flex flex-col">
        {/* Header */}
        <div className="bg-[#1a232e] border-b border-[#5c403c]/60 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2196F3]/20 border border-[#2196F3]/50 flex items-center justify-center text-[#2196F3]">
              <span className="material-symbols-outlined text-[24px]">electric_rickshaw</span>
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#46DFA6] bg-[#46DFA6]/10 px-2 py-0.5 rounded border border-[#46DFA6]/30">
                100% FREE PILGRIM TRANSIT
              </span>
              <h2 className="text-base font-extrabold text-white leading-tight">
                {route.routeNumber}
              </h2>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="w-9 h-9 rounded-full bg-[#2c1b19] hover:bg-[#372623] text-[#e5bdb8] flex items-center justify-center border border-[#5c403c]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {!isBooked ? (
            <>
              {/* Route Summary */}
              <div className="bg-[#1B2025] rounded-xl p-3.5 border border-[#5c403c]/40">
                <h3 className="font-extrabold text-sm text-[#fadcd7]">{route.routeName}</h3>
                <p className="text-xs text-[#e5bdb8] mt-0.5">Operating: {route.operatingHours}</p>
                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[#5c403c]/30 text-xs">
                  <span className="text-[#46DFA6] font-bold">⚡ Every {route.frequencyMins} mins</span>
                  <span className="text-[#ac8884]">•</span>
                  <span className="text-[#2196F3] font-bold">{route.activeBusesCount} Electric Buses Active</span>
                </div>
              </div>

              {/* Boarding Point */}
              <div>
                <label className="block text-xs font-bold text-[#fadcd7] uppercase tracking-wider mb-1.5">
                  Select Boarding Stop
                </label>
                <select
                  value={pickupStop}
                  onChange={(e) => setPickupStop(e.target.value)}
                  className="w-full bg-[#1B2025] border border-[#5c403c] rounded-xl px-3 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-[#2196F3]"
                >
                  {route.stops.map((st) => (
                    <option key={st} value={st}>
                      🚏 {st}
                    </option>
                  ))}
                </select>
              </div>

              {/* Destination */}
              <div>
                <label className="block text-xs font-bold text-[#fadcd7] uppercase tracking-wider mb-1.5">
                  Select Destination Stop
                </label>
                <select
                  value={dropStop}
                  onChange={(e) => setDropStop(e.target.value)}
                  className="w-full bg-[#1B2025] border border-[#5c403c] rounded-xl px-3 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-[#2196F3]"
                >
                  {route.stops.map((st) => (
                    <option key={st} value={st}>
                      🏁 {st}
                    </option>
                  ))}
                </select>
              </div>

              {/* Senior / Wheelchair Toggles */}
              <div className="space-y-2 bg-[#1B2025] p-3 rounded-xl border border-[#5c403c]/40">
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#FFD700] text-[20px]">elderly</span>
                    <span className="text-xs font-bold text-white">Senior Citizen / Priority Seating</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={seniorAssistance}
                    onChange={(e) => setSeniorAssistance(e.target.checked)}
                    className="w-4 h-4 accent-[#2196F3]"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer pt-2 border-t border-[#5c403c]/30">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#46DFA6] text-[20px]">accessible</span>
                    <span className="text-xs font-bold text-white">Wheelchair Accessible Ramp Required</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={wheelchairRequired}
                    onChange={(e) => setWheelchairRequired(e.target.checked)}
                    className="w-4 h-4 accent-[#2196F3]"
                  />
                </label>
              </div>

              {/* Passenger count */}
              <div>
                <label className="block text-xs font-bold text-[#fadcd7] uppercase tracking-wider mb-1.5">
                  Number of Passengers
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      onClick={() => setPassengersCount(num)}
                      className={`flex-1 py-2 rounded-xl text-xs font-extrabold border transition-all ${
                        passengersCount === num
                          ? 'bg-[#2196F3] text-white border-[#2196F3]'
                          : 'bg-[#1B2025] text-[#fadcd7] border-[#5c403c]/40 hover:bg-[#252a30]'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit CTA */}
              <button
                onClick={handleConfirm}
                className="w-full py-3.5 bg-[#2196F3] hover:bg-[#1e88e5] active:scale-[0.99] text-white font-extrabold rounded-xl text-sm flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(33,150,243,0.4)] transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">confirmation_number</span>
                CONFIRM FREE SHUTTLE PASS
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center text-center space-y-4 py-2">
              <div className="bg-white p-3 rounded-2xl shadow-xl border-4 border-[#2196F3]">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=KUMBH_SHUTTLE:${bookingRef}:${pickupStop}:${dropStop}:${passengersCount}`}
                  alt="Shuttle Pass QR"
                  className="w-40 h-40 object-contain"
                />
              </div>

              <div>
                <span className="text-xs font-extrabold text-[#46DFA6] tracking-widest uppercase">
                  ACTIVE SHUTTLE BOARDING PASS
                </span>
                <h3 className="text-2xl font-extrabold text-white tracking-wider mt-0.5">
                  {bookingRef}
                </h3>
                <p className="text-xs text-[#2196F3] font-bold mt-1">
                  Next Bus MH-15-EV-8821 arriving in 3 mins at {pickupStop}
                </p>
              </div>

              <div className="w-full bg-[#1B2025] rounded-xl p-3.5 border border-[#5c403c]/40 text-left text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[#ac8884]">From:</span>
                  <span className="font-bold text-white">{pickupStop}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#ac8884]">To:</span>
                  <span className="font-bold text-white">{dropStop}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#ac8884]">Passengers:</span>
                  <span className="font-bold text-white">{passengersCount} Persons</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#ac8884]">Priority Queue:</span>
                  <span className="font-bold text-[#FFD700]">Senior Assist Enabled</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#ac8884]">Fare:</span>
                  <span className="font-bold text-[#46DFA6]">Free Pilgrim Transit (₹0)</span>
                </div>
              </div>

              <p className="text-[11px] text-[#ac8884]">
                Show this digital boarding pass to the e-shuttle marshal when boarding.
              </p>

              <button
                onClick={handleClose}
                className="w-full py-3 bg-[#2196F3] hover:bg-[#1e88e5] text-white font-extrabold rounded-xl text-sm transition-all"
              >
                Done &amp; View Live Shuttle Tracker
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
