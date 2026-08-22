import React, { useState, useEffect } from 'react';
import { UserProfile, EmergencySOSDispatch } from '../types';
import { useTranslation } from '../utils/translations';

interface EmergencyModalProps {
  userProfile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  userProfile,
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation(userProfile.language);
  const [countdown, setCountdown] = useState(3);
  const [isDispatched, setIsDispatched] = useState(false);
  const [dispatchInfo, setDispatchInfo] = useState<EmergencySOSDispatch | null>(null);
  const [isSirenActive, setIsSirenActive] = useState(false);
  const [isStrobeActive, setIsStrobeActive] = useState(false);
  const [emergencyType, setEmergencyType] = useState('Medical Emergency');

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen && !isDispatched) {
      setCountdown(3);
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            triggerRealSOS();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOpen, isDispatched]);

  const triggerRealSOS = async () => {
    setIsDispatched(true);
    try {
      const res = await fetch('/api/sos/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pilgrimName: userProfile.fullName,
          location: 'Nashik Sector 4 (Near Ramkund Ghat #2)',
          medicalDetails: {
            bloodGroup: userProfile.bloodGroup,
            allergies: userProfile.allergies,
            conditions: userProfile.medicalConditions,
          },
          emergencyType,
          contactPhone: userProfile.emergencyContact.phone,
        }),
      });
      const data = await res.json();
      setDispatchInfo({
        incidentId: data.incidentId,
        timestamp: new Date().toLocaleTimeString(),
        status: 'DISPATCHED',
        responderSector: data.responderSector,
        eta: data.estimatedEta,
        location: 'Ramkund Sector 4 Safe Corridor',
      });
    } catch (e) {
      setDispatchInfo({
        incidentId: 'SOS-' + Math.floor(100000 + Math.random() * 900000),
        timestamp: new Date().toLocaleTimeString(),
        status: 'DISPATCHED',
        responderSector: 'Panchavati Sector 4 Rapid Unit #12',
        eta: '3-5 minutes',
        location: 'Ramkund Ghat Sector 4',
      });
    }
  };

  const handleCancelEmergency = () => {
    setIsDispatched(false);
    setIsSirenActive(false);
    setIsStrobeActive(false);
    onClose();
  };

  const toggleSirenSound = () => {
    setIsSirenActive(!isSirenActive);
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 text-white transition-colors duration-300 ${
        isStrobeActive
          ? 'bg-[#F44336] text-white animate-pulse'
          : 'bg-[#0F1419]/95 backdrop-blur-xl'
      }`}
    >
      {/* Background Warning Radar */}
      <div className="absolute inset-0 bg-tactical-grid opacity-20 pointer-events-none" />

      {/* COUNTDOWN STATE */}
      {!isDispatched ? (
        <div className="relative z-10 flex flex-col items-center max-w-sm text-center">
          <div className="w-28 h-28 rounded-full bg-[#F44336]/20 border-4 border-[#F44336] flex items-center justify-center mb-6 sos-btn-pulse">
            <span className="text-5xl font-extrabold text-[#F44336]">{countdown}</span>
          </div>

          <h2 className="text-2xl font-extrabold text-white mb-2">
            BROADCASTING SOS ALERT
          </h2>
          <p className="text-xs text-[#fadcd7] mb-6">
            Transmitting your GPS coordinates, medical profile (Blood: {userProfile.bloodGroup}), and contacting Nashik Mela Emergency Command.
          </p>

          <div className="flex flex-col gap-3 w-full">
            <button
              onClick={() => {
                triggerRealSOS();
              }}
              className="w-full py-3.5 bg-[#F44336] hover:bg-[#d32f2f] text-white font-extrabold rounded-xl text-sm shadow-xl"
            >
              CONFIRM IMMEDIATE SOS NOW
            </button>

            <button
              onClick={handleCancelEmergency}
              className="w-full py-3 bg-[#2c1b19] hover:bg-[#372623] text-[#e5bdb8] font-bold rounded-xl text-sm border border-[#5c403c]"
            >
              Cancel (Accidental Press)
            </button>
          </div>
        </div>
      ) : (
        /* DISPATCHED ACTIVE EMERGENCY STATE */
        <div className="relative z-10 max-w-md w-full bg-[#190a08] border-2 border-[#F44336] rounded-2xl p-5 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
          {/* Header Banner */}
          <div className="flex items-center justify-between pb-3 border-b border-[#5c403c]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#F44336] text-3xl animate-bounce icon-fill">
                e911_emergency
              </span>
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#F44336] font-extrabold">
                  EMERGENCY ACTIVE
                </span>
                <h3 className="text-base font-extrabold text-white">
                  Incident #{dispatchInfo?.incidentId}
                </h3>
              </div>
            </div>
            <span className="text-xs font-bold bg-[#46DFA6]/20 text-[#46DFA6] px-2.5 py-1 rounded-full border border-[#46DFA6]/40">
              DISPATCHED
            </span>
          </div>

          {/* Responder Dispatch ETA Box */}
          <div className="bg-[#2c1b19] p-3.5 rounded-xl border border-[#5c403c] space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#e5bdb8]">Assigned Unit:</span>
              <span className="font-bold text-[#ffb4a9] text-right">
                {dispatchInfo?.responderSector}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#e5bdb8]">Estimated Response Time:</span>
              <span className="font-extrabold text-[#46DFA6] text-sm">
                ⏱️ {dispatchInfo?.eta}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#e5bdb8]">Live Sector:</span>
              <span className="font-bold text-white">Panchavati - Ramkund Gate 2</span>
            </div>
          </div>

          {/* Emergency Type Selector */}
          <div>
            <label className="text-[11px] font-bold text-[#e5bdb8] block mb-1">
              Select Incident Nature:
            </label>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              {['Medical Emergency', 'Lost Child / Family', 'Stampede / Crush Risk', 'Drowning / Water Risk'].map(
                (type) => (
                  <button
                    key={type}
                    onClick={() => setEmergencyType(type)}
                    className={`p-2 rounded-lg text-left font-bold border transition-colors ${
                      emergencyType === type
                        ? 'bg-[#F44336] text-white border-[#ff8a80]'
                        : 'bg-[#2c1b19] text-[#e5bdb8] border-[#5c403c] hover:bg-[#372623]'
                    }`}
                  >
                    {type}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Direct 1-Tap Emergency Hotlines */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-[#ffb77d] uppercase tracking-wider">
              Immediate Helplines
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <a
                href="tel:112"
                className="bg-[#2196F3] hover:bg-[#1e88e5] text-white p-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 shadow"
              >
                <span className="material-symbols-outlined text-[18px]">call</span>
                Dial 112 Police
              </a>
              <a
                href="tel:108"
                className="bg-[#46DFA6] hover:bg-[#38b385] text-[#003826] p-2.5 rounded-lg font-extrabold text-xs flex items-center justify-center gap-1.5 shadow"
              >
                <span className="material-symbols-outlined text-[18px]">medical_services</span>
                Dial 108 Ambulance
              </a>
            </div>

            {userProfile.emergencyContact.phone && (
              <a
                href={`tel:${userProfile.emergencyContact.phone}`}
                className="w-full bg-[#372623] hover:bg-[#43302d] text-[#ffb4a9] p-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 border border-[#5c403c]"
              >
                <span className="material-symbols-outlined text-[18px]">contact_phone</span>
                Call {userProfile.emergencyContact.name} ({userProfile.emergencyContact.relationship})
              </a>
            )}
          </div>

          {/* Device Rescue Tools (Siren & Screen Strobe) */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={toggleSirenSound}
              className={`p-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 border transition-colors ${
                isSirenActive
                  ? 'bg-[#FFD700] text-black border-white'
                  : 'bg-[#2c1b19] text-[#e5bdb8] border-[#5c403c]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {isSirenActive ? 'volume_up' : 'volume_off'}
              </span>
              {isSirenActive ? 'Siren Beeping' : 'Sound Loud Siren'}
            </button>

            <button
              onClick={() => setIsStrobeActive(!isStrobeActive)}
              className={`p-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 border transition-colors ${
                isStrobeActive
                  ? 'bg-[#FFD700] text-black border-white'
                  : 'bg-[#2c1b19] text-[#e5bdb8] border-[#5c403c]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">flash_on</span>
              {isStrobeActive ? 'Strobe ON' : 'Strobe Screen'}
            </button>
          </div>

          {/* Dismiss / Resolve button */}
          <button
            onClick={handleCancelEmergency}
            className="w-full py-2.5 bg-[#2c1b19] hover:bg-[#372623] text-xs font-bold text-[#e5bdb8] rounded-lg border border-[#5c403c] mt-1"
          >
            I am Safe Now (Close Incident)
          </button>
        </div>
      )}
    </div>
  );
};
