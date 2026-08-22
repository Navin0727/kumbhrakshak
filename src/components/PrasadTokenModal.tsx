import React, { useState } from 'react';
import { FoodService, UserProfile } from '../types';

interface PrasadTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  foodService: FoodService | null;
  userProfile: UserProfile;
}

export const PrasadTokenModal: React.FC<PrasadTokenModalProps> = ({
  isOpen,
  onClose,
  foodService,
  userProfile,
}) => {
  const [pilgrimCount, setPilgrimCount] = useState(2);
  const [selectedSlot, setSelectedSlot] = useState('12:30 PM – 01:15 PM');
  const [isGenerated, setIsGenerated] = useState(false);
  const [tokenNumber, setTokenNumber] = useState('PRD-2027-8841');

  if (!isOpen || !foodService) return null;

  const handleGenerate = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    setTokenNumber(`PRD-2027-${randomNum}`);
    setIsGenerated(true);
  };

  const handleCloseAll = () => {
    setIsGenerated(false);
    onClose();
  };

  const slots = [
    '11:45 AM – 12:30 PM (Batch A)',
    '12:30 PM – 01:15 PM (Batch B)',
    '01:15 PM – 02:00 PM (Batch C)',
    '06:30 PM – 07:30 PM (Evening Batch)',
    '07:30 PM – 08:30 PM (Night Batch)',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="bg-[#121820] border-2 border-[#FFD700] rounded-2xl w-full max-w-md overflow-hidden shadow-[0_0_40px_rgba(255,215,0,0.3)] flex flex-col">
        {/* Header */}
        <div className="bg-[#1c222a] border-b border-[#5c403c]/60 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFD700]/20 border border-[#FFD700]/50 flex items-center justify-center text-[#FFD700]">
              <span className="material-symbols-outlined text-[24px]">restaurant</span>
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FFD700] bg-[#FFD700]/10 px-2 py-0.5 rounded border border-[#FFD700]/30">
                FREE SATVIK PRASADAM
              </span>
              <h2 className="text-base font-extrabold text-white leading-tight">
                Digital Maha Prasad Token
              </h2>
            </div>
          </div>

          <button
            onClick={handleCloseAll}
            className="w-9 h-9 rounded-full bg-[#2c1b19] hover:bg-[#372623] text-[#e5bdb8] flex items-center justify-center border border-[#5c403c]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {!isGenerated ? (
            <>
              {/* Annakshetra Highlight */}
              <div className="bg-[#1B2025] rounded-xl p-3.5 border border-[#5c403c]/40">
                <h3 className="font-extrabold text-sm text-[#fadcd7]">{foodService.name}</h3>
                <p className="text-xs text-[#e5bdb8] mt-0.5">{foodService.location}</p>
                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[#5c403c]/30 text-xs">
                  <span className="text-[#46DFA6] font-bold">🟢 Current Status: {foodService.currentStatus}</span>
                  <span className="text-[#ac8884]">•</span>
                  <span className="text-[#FFD700] font-bold">⭐ {foodService.cleanlinessRating} Cleanliness</span>
                </div>
              </div>

              {/* Number of Pilgrims */}
              <div>
                <label className="block text-xs font-bold text-[#fadcd7] uppercase tracking-wider mb-2">
                  Number of Pilgrims in Party
                </label>
                <div className="flex items-center gap-3">
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <button
                      key={num}
                      onClick={() => setPilgrimCount(num)}
                      className={`flex-1 py-2.5 rounded-xl font-extrabold text-sm border transition-all ${
                        pilgrimCount === num
                          ? 'bg-[#FFD700] text-black border-[#FFD700] shadow-md scale-105'
                          : 'bg-[#1B2025] text-[#fadcd7] border-[#5c403c]/40 hover:bg-[#252a30]'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slot Selection */}
              <div>
                <label className="block text-xs font-bold text-[#fadcd7] uppercase tracking-wider mb-2">
                  Select Meal Serving Batch
                </label>
                <div className="space-y-1.5">
                  {slots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`w-full p-2.5 rounded-xl text-left text-xs font-bold border transition-all flex items-center justify-between ${
                        selectedSlot === slot
                          ? 'bg-[#FFD700]/15 text-[#FFD700] border-[#FFD700]'
                          : 'bg-[#1B2025] text-[#e5bdb8] border-[#5c403c]/40 hover:bg-[#252a30]'
                      }`}
                    >
                      <span>{slot}</span>
                      {selectedSlot === slot && (
                        <span className="material-symbols-outlined text-sm text-[#FFD700]">check_circle</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Today's Prasad Menu */}
              <div className="bg-[#1B2025] p-3 rounded-xl border border-[#5c403c]/40">
                <p className="text-[11px] font-bold text-[#FFD700] uppercase mb-1.5 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">flatware</span>
                  Today's Satvik Prasadam Menu
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {foodService.todayMenu.map((item, idx) => (
                    <span key={idx} className="bg-[#2c1b19] border border-[#5c403c] text-[#fadcd7] px-2 py-0.5 rounded text-[11px]">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Submit CTA */}
              <button
                onClick={handleGenerate}
                className="w-full py-3.5 bg-[#FFD700] hover:bg-[#ffca00] active:scale-[0.99] text-black font-extrabold rounded-xl text-sm flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(255,215,0,0.35)] transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">qr_code_2</span>
                GENERATE FREE PRASAD TOKEN
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center text-center space-y-4 py-2">
              <div className="bg-white p-3 rounded-2xl shadow-xl border-4 border-[#FFD700]">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=KUMBH_PRASAD:${tokenNumber}:${userProfile.fullName || 'Pilgrim'}:${pilgrimCount}:BHOJAN`}
                  alt="Prasad Token QR"
                  className="w-40 h-40 object-contain"
                />
              </div>

              <div>
                <span className="text-xs font-extrabold text-[#FFD700] tracking-widest uppercase">
                  CONFIRMED PRASAD PASS
                </span>
                <h3 className="text-2xl font-extrabold text-white tracking-wider mt-0.5">
                  {tokenNumber}
                </h3>
                <p className="text-xs text-[#46DFA6] font-bold mt-1">
                  Valid for {pilgrimCount} Pilgrim{pilgrimCount > 1 ? 's' : ''} • {selectedSlot}
                </p>
              </div>

              <div className="w-full bg-[#1B2025] rounded-xl p-3.5 border border-[#5c403c]/40 text-left text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[#ac8884]">Center:</span>
                  <span className="font-bold text-white text-right">{foodService.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#ac8884]">Passholder:</span>
                  <span className="font-bold text-white">{userProfile.fullName || 'Rahul Sharma'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#ac8884]">Entry Corridor:</span>
                  <span className="font-bold text-[#FFD700]">Gate #2 (Fast Queue)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#ac8884]">Cost:</span>
                  <span className="font-bold text-[#46DFA6]">₹0 (100% Free Seva)</span>
                </div>
              </div>

              <p className="text-[11px] text-[#ac8884]">
                Show this QR screen at the dining hall scanning turnstile for instant seating.
              </p>

              <button
                onClick={handleCloseAll}
                className="w-full py-3 bg-[#46DFA6] hover:bg-[#3ecb96] text-[#003826] font-extrabold rounded-xl text-sm transition-all"
              >
                Save to My Pilgrim Wallet
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
