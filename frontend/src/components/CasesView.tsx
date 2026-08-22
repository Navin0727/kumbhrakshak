import React, { useState } from 'react';
import { LostPersonCase, Language } from '../types';
import { MOCK_LOST_CASES } from '../data/mockData';
import { useTranslation } from '../utils/translations';

interface CasesViewProps {
  language?: Language;
}

export const CasesView: React.FC<CasesViewProps> = ({ language = 'en' }) => {
  const { t } = useTranslation(language);
  const [cases, setCases] = useState<LostPersonCase[]>(MOCK_LOST_CASES);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [showReportModal, setShowReportModal] = useState(false);

  // New report form state
  const [newName, setNewName] = useState('');
  const [newAge, setNewAge] = useState('');
  const [newGender, setNewGender] = useState<'Male' | 'Female' | 'Child'>('Child');
  const [newLocation, setNewLocation] = useState('');
  const [newClothing, setNewClothing] = useState('');
  const [newGuardian, setNewGuardian] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newNotes, setNewNotes] = useState('');

  const filteredCases = cases.filter((c) => {
    const matchStatus = filterStatus === 'ALL' ? true : c.status === filterStatus;
    const matchSearch =
      searchQuery.trim() === '' ||
      c.personName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.clothing.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastSeenLocation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCase: LostPersonCase = {
      id: 'CASE-' + Math.floor(7000 + Math.random() * 1000),
      personName: newName,
      age: parseInt(newAge) || 10,
      gender: newGender,
      lastSeenLocation: newLocation || 'Panchavati Sector 4',
      lastSeenTime: 'Just Now',
      clothing: newClothing,
      guardianName: newGuardian,
      guardianContact: newPhone,
      photoUrl:
        newGender === 'Child'
          ? 'https://images.unsplash.com/photo-1543332164-6e82f355badc?w=400&auto=format&fit=crop&q=60'
          : newGender === 'Female'
          ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=60'
          : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=60',
      status: 'MISSING',
      notes: newNotes || 'Broadcasted to all 48 volunteer posts and drone cameras.',
    };

    setCases([newCase, ...cases]);
    setShowReportModal(false);
    alert(`Report #${newCase.id} registered! Broadcasted to Nashik Khoya-Paya Network & Sector 4 Police Desk.`);
    // Reset form
    setNewName('');
    setNewAge('');
    setNewLocation('');
    setNewClothing('');
    setNewGuardian('');
    setNewPhone('');
  };

  const handleSpotPerson = (c: LostPersonCase) => {
    alert(`Thank you! Location ping sent to Khoya-Paya desk for ${c.personName}. Responders alerted in Sector 4.`);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 pb-24 text-[#fadcd7]">
      {/* Header with Report Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#FFD700] text-3xl">
              family_restroom
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {t('casesTitle', 'Lost & Found / Family Reunion')}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#e5bdb8] mt-1">
            {t('casesSubtitle', 'Facial recognition & volunteer grid for missing pilgrims and children.')}
          </p>
        </div>

        <button
          onClick={() => setShowReportModal(true)}
          className="px-4 py-2.5 bg-[#FFD700] hover:bg-[#ffc400] text-black font-extrabold text-xs sm:text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[20px]">add_circle</span>
          {t('reportMissing', 'Report Missing Person')}
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-2.5 mb-5">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-3 text-[#ac8884] text-lg">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, clothing, sector..."
            className="w-full bg-[#1B2025] border border-[#5c403c] rounded-xl pl-10 pr-4 h-11 text-white text-xs sm:text-sm placeholder-[#ac8884] focus:outline-none focus:border-[#FFD700]"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
          {['ALL', 'MISSING', 'INVESTIGATING', 'REUNITED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                filterStatus === st
                  ? 'bg-[#FFD700] text-black'
                  : 'bg-[#1B2025] text-[#e5bdb8] border border-[#5c403c]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Cases List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCases.map((c) => {
          const isReunited = c.status === 'REUNITED';
          const isMissing = c.status === 'MISSING';

          return (
            <div
              key={c.id}
              className={`bg-[#1B2025] border rounded-2xl p-4 flex gap-4 shadow-lg transition-all ${
                isReunited
                  ? 'border-[#46DFA6]/40 bg-[#17241d]/40'
                  : isMissing
                  ? 'border-[#F44336]/50'
                  : 'border-[#FFD700]/50'
              }`}
            >
              {/* Photo */}
              <div className="w-24 h-28 sm:w-28 sm:h-32 shrink-0 rounded-xl overflow-hidden bg-black relative border border-white/10">
                <img
                  src={c.photoUrl}
                  alt={c.personName}
                  className="w-full h-full object-cover"
                />
                <span
                  className={`absolute top-1 left-1 px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase ${
                    isReunited
                      ? 'bg-[#46DFA6] text-black'
                      : isMissing
                      ? 'bg-[#F44336] text-white'
                      : 'bg-[#FFD700] text-black'
                  }`}
                >
                  {c.status}
                </span>
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="font-extrabold text-base text-white truncate">
                      {c.personName}
                    </h3>
                    <span className="text-[10px] text-[#ac8884] font-mono">{c.id}</span>
                  </div>

                  <p className="text-xs text-[#e5bdb8]">
                    {c.age} yrs • {c.gender}
                  </p>

                  <p className="text-[11px] text-[#fadcd7] mt-1.5 flex items-start gap-1">
                    <span className="material-symbols-outlined text-[13px] text-[#ff8c00] shrink-0">
                      location_on
                    </span>
                    <span className="line-clamp-1">{c.lastSeenLocation}</span>
                  </p>

                  <p className="text-[11px] text-[#ddc1ae] mt-1 line-clamp-2">
                    <strong>Wore:</strong> {c.clothing}
                  </p>
                </div>

                {/* Footer Action */}
                <div className="pt-2 flex items-center justify-between gap-2 border-t border-[#5c403c]/40 mt-2">
                  <a
                    href={`tel:${c.guardianContact}`}
                    className="text-[11px] font-bold text-[#ffb4a9] hover:underline flex items-center gap-1 truncate"
                  >
                    <span className="material-symbols-outlined text-[14px]">call</span>
                    {c.guardianName}
                  </a>

                  {!isReunited && (
                    <button
                      onClick={() => handleSpotPerson(c)}
                      className="px-2.5 py-1 bg-[#2196F3] hover:bg-[#1e88e5] text-white font-extrabold text-[10px] rounded-lg cursor-pointer whitespace-nowrap"
                    >
                      I Spotted Them
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#171c21] border border-[#5c403c] rounded-2xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-[#5c403c]">
              <h3 className="text-lg font-extrabold text-[#FFD700]">
                Report Missing / Found Person
              </h3>
              <button
                onClick={() => setShowReportModal(false)}
                className="w-8 h-8 rounded-full bg-[#2c1b19] text-[#e5bdb8] flex items-center justify-center hover:bg-[#372623]"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <form onSubmit={handleReportSubmit} className="space-y-3.5 mt-4">
              <div>
                <label className="text-xs font-bold text-[#e5bdb8] block mb-1">
                  Missing Person Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full bg-[#2c1b19] border border-[#5c403c] rounded-lg p-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#FFD700]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-xs font-bold text-[#e5bdb8] block mb-1">Age *</label>
                  <input
                    type="number"
                    required
                    value={newAge}
                    onChange={(e) => setNewAge(e.target.value)}
                    placeholder="e.g. 8"
                    className="w-full bg-[#2c1b19] border border-[#5c403c] rounded-lg p-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#FFD700]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#e5bdb8] block mb-1">Category</label>
                  <select
                    value={newGender}
                    onChange={(e) => setNewGender(e.target.value as any)}
                    className="w-full bg-[#2c1b19] border border-[#5c403c] rounded-lg p-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#FFD700]"
                  >
                    <option value="Child">Child (High Priority)</option>
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#e5bdb8] block mb-1">
                  Last Seen Location in Nashik *
                </label>
                <input
                  type="text"
                  required
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="e.g. Ramkund Step 12, Kalaram Temple East Gate"
                  className="w-full bg-[#2c1b19] border border-[#5c403c] rounded-lg p-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#FFD700]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#e5bdb8] block mb-1">
                  Clothing &amp; Identifiable Marks *
                </label>
                <input
                  type="text"
                  required
                  value={newClothing}
                  onChange={(e) => setNewClothing(e.target.value)}
                  placeholder="e.g. Red Kurta, Blue Sandals, Tilak on forehead"
                  className="w-full bg-[#2c1b19] border border-[#5c403c] rounded-lg p-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#FFD700]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-xs font-bold text-[#e5bdb8] block mb-1">
                    Guardian Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newGuardian}
                    onChange={(e) => setNewGuardian(e.target.value)}
                    placeholder="Your Name"
                    className="w-full bg-[#2c1b19] border border-[#5c403c] rounded-lg p-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#FFD700]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#e5bdb8] block mb-1">
                    Contact Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full bg-[#2c1b19] border border-[#5c403c] rounded-lg p-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#FFD700]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#e5bdb8] block mb-1">
                  Additional Notes / Languages Spoken
                </label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="e.g. Speaks Hindi & Marathi only, carries school ID card"
                  className="w-full bg-[#2c1b19] border border-[#5c403c] rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#FFD700]"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#FFD700] hover:bg-[#ffc400] text-black font-extrabold text-xs sm:text-sm rounded-xl shadow cursor-pointer"
                >
                  BROADCAST MISSING REPORT
                </button>
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-3 bg-[#2c1b19] text-[#e5bdb8] font-bold text-xs rounded-xl border border-[#5c403c]"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
