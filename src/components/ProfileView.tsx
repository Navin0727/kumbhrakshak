import React, { useState } from 'react';
import { UserProfile, Language } from '../types';
import { useTranslation } from '../utils/translations';

interface ProfileViewProps {
  userProfile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
  onClose?: () => void;
  onLogout?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  userProfile,
  onSaveProfile,
  onClose,
  onLogout,
}) => {
  const { t } = useTranslation(userProfile.language);
  const [step, setStep] = useState<'profile' | 'otp' | 'medical'>('profile');
  const [formData, setFormData] = useState<UserProfile>(userProfile);
  const [otpValues, setOtpValues] = useState(['4', '9', '2', '1']);
  const [otpCountdown, setOtpCountdown] = useState(45);
  const [isSavedToast, setIsSavedToast] = useState(false);

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('otp');
  };

  const handleVerifyOtp = () => {
    setStep('medical');
  };

  const handleOtpInput = (val: string, index: number) => {
    const newOtp = [...otpValues];
    newOtp[index] = val.slice(-1);
    setOtpValues(newOtp);

    // Auto-advance
    if (val && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSaveMedicalVault = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...formData,
      isRegistered: true,
      emergencyQrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=KUMBHRAKSHAK:${formData.pilgrimId}:${encodeURIComponent(
        formData.fullName
      )}:Blood_${formData.bloodGroup}:EMG_${formData.emergencyContact.phone}`,
    };
    onSaveProfile(updated);
    setIsSavedToast(true);
    setTimeout(() => {
      setIsSavedToast(false);
      if (onClose) onClose();
    }, 1200);
  };

  return (
    <div className="max-w-xl mx-auto p-4 sm:p-6 pb-24 text-[#fadcd7]">
      {/* Brand Header */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <span className="material-symbols-outlined text-[#ffb4a9] text-4xl icon-fill">
          shield_person
        </span>
        <span className="text-2xl font-extrabold tracking-tight text-white font-['Atkinson_Hyperlegible_Next']">
          KumbhRakshak
        </span>
      </div>

      {/* VIEW 1: REGISTRATION / BASIC PROFILE */}
      {step === 'profile' && (
        <section className="bg-[#281715]/90 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-[#5c403c] shadow-2xl flex flex-col gap-6">
          <header className="flex flex-col gap-1.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#ffb4a9]">
              Create Your Profile
            </h1>
            <p className="text-sm text-[#e5bdb8]">
              Register to receive critical safety alerts and access 24/7 emergency services.
            </p>
          </header>

          <form onSubmit={handleStep1Submit} className="flex flex-col gap-4">
            {/* Full Name */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-[#e5bdb8]" htmlFor="fullName">
                Full Name
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-[#ac8884]">
                  person
                </span>
                <input
                  id="fullName"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full bg-[#2c1b19] border-b-2 border-[#5c403c] rounded-t-lg pl-10 pr-4 h-12 text-white placeholder-[#ac8884] focus:outline-none focus:border-[#2196F3] focus:bg-[#372623] transition-colors text-sm font-semibold"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-[#e5bdb8]" htmlFor="phoneNumber">
                Phone Number
              </label>
              <div className="flex h-12 bg-[#2c1b19] border-b-2 border-[#5c403c] rounded-t-lg overflow-hidden focus-within:border-[#2196F3]">
                <div className="px-3.5 flex items-center bg-[#372623] border-r border-[#5c403c] text-[#e5bdb8] font-bold text-sm">
                  +91
                </div>
                <input
                  id="phoneNumber"
                  type="tel"
                  required
                  pattern="[0-9]{10}"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  placeholder="98765 43210"
                  className="flex-1 bg-transparent px-4 text-white placeholder-[#ac8884] focus:outline-none text-sm font-semibold"
                />
              </div>
            </div>

            {/* Age Group */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-[#e5bdb8]" htmlFor="ageGroup">
                Age Group
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-[#ac8884]">
                  calendar_today
                </span>
                <select
                  id="ageGroup"
                  required
                  value={formData.ageGroup}
                  onChange={(e) => setFormData({ ...formData, ageGroup: e.target.value as any })}
                  className="w-full bg-[#2c1b19] border-b-2 border-[#5c403c] rounded-t-lg pl-10 pr-10 h-12 text-white appearance-none cursor-pointer focus:outline-none focus:border-[#2196F3] text-sm font-semibold"
                >
                  <option value="" disabled>Select age range</option>
                  <option value="18-30">18 - 30 years</option>
                  <option value="31-50">31 - 50 years</option>
                  <option value="51-65">51 - 65 years</option>
                  <option value="65+">65+ years (Senior Citizen Priority)</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 text-[#ac8884] pointer-events-none">
                  arrow_drop_down
                </span>
              </div>
            </div>

            {/* Preferred Language */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-[#e5bdb8]" htmlFor="language">
                Preferred Language
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-[#ac8884]">
                  translate
                </span>
                <select
                  id="language"
                  required
                  value={formData.language}
                  onChange={(e) => {
                    const newLang = e.target.value as Language;
                    const updated = { ...formData, language: newLang };
                    setFormData(updated);
                    onSaveProfile(updated);
                  }}
                  className="w-full bg-[#2c1b19] border-b-2 border-[#5c403c] rounded-t-lg pl-10 pr-10 h-12 text-white appearance-none cursor-pointer focus:outline-none focus:border-[#2196F3] text-sm font-semibold"
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi (हिंदी)</option>
                  <option value="mr">Marathi (मराठी)</option>
                  <option value="gu">Gujarati (ગુજરાતી)</option>
                  <option value="sa">Sanskrit (संस्कृतम्)</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 text-[#ac8884] pointer-events-none">
                  arrow_drop_down
                </span>
              </div>
            </div>

            {/* Submit Step 1 Button */}
            <button
              type="submit"
              className="mt-4 bg-[#ffb4a9] hover:bg-[#ffdad5] text-[#690002] font-extrabold h-12 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-md cursor-pointer text-sm"
            >
              CONTINUE
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>

            {/* Skip directly to Medical Details if editing */}
            <button
              type="button"
              onClick={() => setStep('medical')}
              className="text-xs text-[#ffb4a9] text-center hover:underline py-1"
            >
              Skip to Medical Vault &amp; Contacts →
            </button>
          </form>
        </section>
      )}

      {/* VIEW 2: OTP VERIFICATION */}
      {step === 'otp' && (
        <section className="bg-[#281715]/90 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-[#5c403c] shadow-2xl flex flex-col gap-6">
          <button
            onClick={() => setStep('profile')}
            className="self-start text-[#e5bdb8] hover:text-[#ffb4a9] flex items-center gap-1 text-xs font-bold -ml-1"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span> Back
          </button>

          <header className="flex flex-col gap-1.5">
            <h2 className="text-2xl font-extrabold text-[#fadcd7]">Verify Number</h2>
            <p className="text-xs sm:text-sm text-[#e5bdb8]">
              We've sent a 4-digit security code to{' '}
              <strong className="text-white block mt-0.5">+91 {formData.phoneNumber}</strong>
            </p>
          </header>

          <div className="flex flex-col items-center gap-6">
            {/* 4 OTP Digit Inputs */}
            <div className="flex justify-center gap-3 w-full max-w-[280px]">
              {otpValues.map((val, idx) => (
                <input
                  key={idx}
                  id={`otp-${idx}`}
                  type="text"
                  maxLength={1}
                  value={val}
                  onChange={(e) => handleOtpInput(e.target.value, idx)}
                  onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                  className="w-14 h-16 text-center text-2xl font-extrabold bg-[#2c1b19] border-b-4 border-[#2196F3] rounded text-white focus:outline-none focus:bg-[#372623] transition-colors"
                />
              ))}
            </div>

            {/* Verify Button */}
            <button
              onClick={handleVerifyOtp}
              className="w-full bg-[#2196F3] hover:bg-[#1e88e5] text-white font-extrabold h-12 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-[0_0_20px_rgba(33,150,243,0.3)] cursor-pointer text-sm"
            >
              VERIFY &amp; SECURE PROFILE
              <span className="material-symbols-outlined text-[18px]">lock_open</span>
            </button>

            <p className="text-xs text-[#ac8884] text-center">
              Didn't receive code?{' '}
              <button
                type="button"
                onClick={() => setOtpCountdown(45)}
                className="text-[#ffb4a9] font-bold hover:underline ml-1"
              >
                Resend in 0:{otpCountdown < 10 ? `0${otpCountdown}` : otpCountdown}
              </button>
            </p>
          </div>
        </section>
      )}

      {/* VIEW 3: MEDICAL DETAILS & EMERGENCY CONTACT VAULT */}
      {step === 'medical' && (
        <div className="space-y-5">
          {/* Header & Privacy Notice */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                Medical &amp; Emergency Vault
              </h1>
              <p className="text-xs sm:text-sm text-[#e5bdb8]">
                Protected health parameters accessible to rescuers in emergency.
              </p>
            </div>
            <button
              onClick={() => setStep('profile')}
              className="text-xs text-[#ffb4a9] border border-[#ffb4a9]/40 px-2.5 py-1 rounded hover:bg-[#ffb4a9]/10"
            >
              Edit Basic Info
            </button>
          </div>

          {/* Privacy Security Banner */}
          <div className="bg-[#2c1b19] border border-[#5c403c] rounded-xl p-3.5 flex items-start gap-3 relative overflow-hidden shadow-sm">
            <div className="absolute inset-0 bg-tactical-grid opacity-20 pointer-events-none" />
            <span className="material-symbols-outlined text-[#46DFA6] text-xl mt-0.5 icon-fill">
              lock
            </span>
            <p className="text-xs text-[#fadcd7] relative z-10 leading-snug">
              🔐 <strong>SECURE VAULT</strong> — Encrypted on device. Emergency responders scanning your Pilgrim QR will instantly see critical blood type &amp; allergies.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSaveMedicalVault} className="space-y-4">
            {/* Medical Fieldset */}
            <fieldset className="bg-[#190a08] border-2 border-[#5c403c] rounded-xl overflow-hidden shadow-lg">
              <div className="bg-[#2c1b19] px-4 py-2.5 border-b border-[#5c403c] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#6ad5ee] text-lg">medical_services</span>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  Medical Details
                </h2>
              </div>

              <div className="p-4 space-y-3.5 bg-tactical-grid">
                {/* Blood Group */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-[#e5bdb8]" htmlFor="blood_group">
                    Blood Group
                  </label>
                  <div className="relative">
                    <select
                      id="blood_group"
                      value={formData.bloodGroup}
                      onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value as any })}
                      className="w-full bg-[#372623] border-0 border-b-2 border-[#5c403c] text-white h-11 px-3 text-xs sm:text-sm rounded-t focus:border-[#ffb4a9] focus:outline-none appearance-none cursor-pointer"
                    >
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="Unknown">Unknown</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-2.5 text-[#ac8884] pointer-events-none text-base">
                      arrow_drop_down
                    </span>
                  </div>
                </div>

                {/* Allergies */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-[#e5bdb8]" htmlFor="allergies">
                    Known Allergies
                  </label>
                  <input
                    id="allergies"
                    type="text"
                    value={formData.allergies}
                    onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                    placeholder="e.g. Penicillin, Peanuts, Sulfa drugs, None"
                    className="w-full bg-[#372623] border-0 border-b-2 border-[#5c403c] text-white h-11 px-3 text-xs sm:text-sm rounded-t focus:border-[#ffb4a9] focus:outline-none"
                  />
                </div>

                {/* Medical Conditions */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-[#e5bdb8]" htmlFor="conditions">
                    Medical Conditions
                  </label>
                  <input
                    id="conditions"
                    type="text"
                    value={formData.medicalConditions}
                    onChange={(e) => setFormData({ ...formData, medicalConditions: e.target.value })}
                    placeholder="e.g. Asthma, Diabetes, Heart Disease, None"
                    className="w-full bg-[#372623] border-0 border-b-2 border-[#5c403c] text-white h-11 px-3 text-xs sm:text-sm rounded-t focus:border-[#ffb4a9] focus:outline-none"
                  />
                </div>

                {/* Medications */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-[#e5bdb8]" htmlFor="medications">
                    Current Medications
                  </label>
                  <input
                    id="medications"
                    type="text"
                    value={formData.currentMedications}
                    onChange={(e) => setFormData({ ...formData, currentMedications: e.target.value })}
                    placeholder="List daily prescriptions & dosage"
                    className="w-full bg-[#372623] border-0 border-b-2 border-[#5c403c] text-white h-11 px-3 text-xs sm:text-sm rounded-t focus:border-[#ffb4a9] focus:outline-none"
                  />
                </div>

                {/* Mobility Assistance Toggle */}
                <div className="flex items-center justify-between p-3 bg-[#372623] rounded-lg border border-[#5c403c]">
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[#9ecaff] text-xl">
                      accessible_forward
                    </span>
                    <label
                      htmlFor="mobility_toggle"
                      className="text-xs font-bold text-white cursor-pointer"
                    >
                      Mobility Assistance Required (Wheelchair/Stretcher)
                    </label>
                  </div>
                  <input
                    id="mobility_toggle"
                    type="checkbox"
                    checked={formData.mobilityAssistance}
                    onChange={(e) =>
                      setFormData({ ...formData, mobilityAssistance: e.target.checked })
                    }
                    className="w-5 h-5 accent-[#ff8c00] cursor-pointer"
                  />
                </div>
              </div>
            </fieldset>

            {/* Emergency Contact Fieldset */}
            <fieldset className="bg-[#190a08] border-2 border-[#5c403c] rounded-xl overflow-hidden shadow-lg">
              <div className="bg-[#2c1b19] px-4 py-2.5 border-b border-[#5c403c] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#2196F3] text-lg">contact_phone</span>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  Emergency Contact
                </h2>
              </div>

              <div className="p-4 space-y-3 bg-tactical-grid">
                {/* Contact Name */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-[#e5bdb8]" htmlFor="contact_name">
                    Contact Name
                  </label>
                  <input
                    id="contact_name"
                    type="text"
                    required
                    value={formData.emergencyContact.name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        emergencyContact: { ...formData.emergencyContact, name: e.target.value },
                      })
                    }
                    placeholder="Full Name of family member"
                    className="w-full bg-[#372623] border-0 border-b-2 border-[#5c403c] text-white h-11 px-3 text-xs sm:text-sm rounded-t focus:border-[#ffb4a9] focus:outline-none"
                  />
                </div>

                {/* Contact Phone */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-[#e5bdb8]" htmlFor="contact_phone">
                    Phone Number
                  </label>
                  <input
                    id="contact_phone"
                    type="tel"
                    required
                    value={formData.emergencyContact.phone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        emergencyContact: { ...formData.emergencyContact, phone: e.target.value },
                      })
                    }
                    placeholder="+91 98765 00000"
                    className="w-full bg-[#372623] border-0 border-b-2 border-[#5c403c] text-white h-11 px-3 text-xs sm:text-sm rounded-t focus:border-[#ffb4a9] focus:outline-none"
                  />
                </div>

                {/* Relationship */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-[#e5bdb8]" htmlFor="relationship">
                    Relationship
                  </label>
                  <div className="relative">
                    <select
                      id="relationship"
                      value={formData.emergencyContact.relationship}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          emergencyContact: {
                            ...formData.emergencyContact,
                            relationship: e.target.value as any,
                          },
                        })
                      }
                      className="w-full bg-[#372623] border-0 border-b-2 border-[#5c403c] text-white h-11 px-3 text-xs sm:text-sm rounded-t focus:border-[#ffb4a9] focus:outline-none appearance-none cursor-pointer"
                    >
                      <option value="Spouse">Spouse</option>
                      <option value="Parent">Parent</option>
                      <option value="Child">Child</option>
                      <option value="Sibling">Sibling</option>
                      <option value="Friend">Friend</option>
                      <option value="Other">Other</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-2.5 text-[#ac8884] pointer-events-none text-base">
                      arrow_drop_down
                    </span>
                  </div>
                </div>
              </div>
            </fieldset>

            {/* Digital Pilgrim ID Card Preview */}
            <div className="bg-gradient-to-br from-[#2c1b19] to-[#1B2025] border-2 border-[#FFD700]/40 rounded-xl p-4 flex items-center justify-between shadow-md">
              <div>
                <span className="text-[10px] text-[#FFD700] uppercase font-bold tracking-wider">
                  Digital Pilgrim Safety Pass
                </span>
                <p className="text-sm font-extrabold text-white">{formData.fullName}</p>
                <p className="text-xs text-[#e5bdb8]">ID: {formData.pilgrimId}</p>
                <p className="text-xs text-[#46DFA6] font-bold mt-1">
                  Blood Group: {formData.bloodGroup}
                </p>
              </div>
              <div className="bg-white p-1.5 rounded-lg shadow">
                <img
                  src={formData.emergencyQrCode}
                  alt="Pilgrim QR"
                  className="w-16 h-16"
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                className="flex-1 h-12 bg-[#ffb4a9] hover:bg-[#ffdad5] text-[#690002] font-extrabold text-sm rounded-lg flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] icon-fill">save</span>
                SAVE SAFETY PROFILE
              </button>

              {onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  className="h-12 px-4 bg-[#372623] text-[#ffb4a9] hover:bg-[#5c403c] font-bold text-xs rounded-lg border border-[#5c403c] transition-colors flex items-center justify-center gap-1.5"
                  title="Switch Pilgrim Account or Log Out"
                >
                  <span className="material-symbols-outlined text-[16px]">logout</span>
                  Switch / Log Out
                </button>
              )}

              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="h-12 px-6 bg-transparent text-[#ffb4a9] hover:bg-[#2c1b19] font-bold text-sm rounded-lg border border-[#5c403c] transition-colors"
                >
                  Close
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Saved Toast Notification */}
      {isSavedToast && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 bg-[#46DFA6] text-[#003826] font-extrabold text-xs px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          Profile &amp; Emergency Vault Saved Successfully!
        </div>
      )}
    </div>
  );
};
