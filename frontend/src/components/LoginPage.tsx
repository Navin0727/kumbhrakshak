import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  Phone,
  KeyRound,
  QrCode,
  User,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Radio,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Lock,
  Globe,
  HeartHandshake,
  Stethoscope,
  Info
} from 'lucide-react';
import { UserProfile, Language } from '../types';
import { useTranslation } from '../utils/translations';

interface LoginPageProps {
  onLoginSuccess: (profile: UserProfile) => void;
  currentLanguage?: Language;
  initialLanguage?: Language;
  onLanguageChange: (lang: Language) => void;
}

type AuthMode = 'otp' | 'pass_id' | 'official';

const DEMO_ACCOUNTS: { label: string; role: string; profile: Partial<UserProfile>; passId: string; phone: string }[] = [
  {
    label: 'Rahul Sharma',
    role: 'Devotee / Pilgrim (General)',
    passId: 'KMB-2027-8492',
    phone: '9876543210',
    profile: {
      fullName: 'Rahul Sharma',
      phoneNumber: '9876543210',
      bloodGroup: 'B+',
      ageGroup: '31-50',
      language: 'en',
      allergies: 'None',
      medicalConditions: 'Mild Hypertension',
      currentMedications: 'Amlodipine 5mg',
      mobilityAssistance: false,
      emergencyContact: {
        name: 'Priya Sharma',
        phone: '+91 98765 00000',
        relationship: 'Spouse',
      },
    },
  },
  {
    label: 'Anita Deshmukh',
    role: 'Kumbh Seva Volunteer (Ramkund)',
    passId: 'KMB-2027-VOL-108',
    phone: '9822012345',
    profile: {
      fullName: 'Anita Deshmukh',
      phoneNumber: '9822012345',
      bloodGroup: 'O+',
      ageGroup: '18-30',
      language: 'mr',
      allergies: 'Penicillin',
      medicalConditions: 'None',
      currentMedications: 'None',
      mobilityAssistance: false,
      emergencyContact: {
        name: 'Suresh Deshmukh',
        phone: '+91 98220 99999',
        relationship: 'Parent',
      },
    },
  },
  {
    label: 'Dr. Vikram Joshi',
    role: 'Emergency Medical Officer (Sector 2)',
    passId: 'KMB-2027-MED-044',
    phone: '9423987654',
    profile: {
      fullName: 'Dr. Vikram Joshi',
      phoneNumber: '9423987654',
      bloodGroup: 'AB+',
      ageGroup: '31-50',
      language: 'hi',
      allergies: 'None',
      medicalConditions: 'None',
      currentMedications: 'None',
      mobilityAssistance: false,
      emergencyContact: {
        name: 'Civil Hospital Nashik',
        phone: '+91 253 257 0000',
        relationship: 'Other',
      },
    },
  },
];

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  currentLanguage,
  initialLanguage,
  onLanguageChange,
}) => {
  const activeLang = currentLanguage || initialLanguage || 'en';
  const { t } = useTranslation(activeLang);
  const [authMode, setAuthMode] = useState<AuthMode>('otp');
  const [step, setStep] = useState<'input' | 'otp_verify'>('input');
  
  // Phone Form States
  const [phoneNumber, setPhoneNumber] = useState('9876543210');
  const [fullName, setFullName] = useState('Rahul Sharma');
  const [originCity, setOriginCity] = useState('Nashik / Maharashtra');
  const [bloodGroup, setBloodGroup] = useState<UserProfile['bloodGroup']>('B+');
  const [ageGroup, setAgeGroup] = useState<UserProfile['ageGroup']>('31-50');

  // OTP Form States
  const [otpValues, setOtpValues] = useState<string[]>(['2', '0', '2', '7']);
  const [timer, setTimer] = useState<number>(45);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Pass ID Form States
  const [passIdInput, setPassIdInput] = useState('KMB-2027-8492');
  const [passSecret, setPassSecret] = useState('43210');

  // Official Mode States
  const [badgeNumber, setBadgeNumber] = useState('MH-NSK-VOL-774');
  const [dutySector, setDutySector] = useState('Sector 4 (Ramkund - Godavari)');

  // Timer countdown for OTP
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'otp_verify' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!fullName.trim()) {
      setErrorMessage('Please enter the Pilgrim full name.');
      return;
    }

    setTimer(45);
    setStep('otp_verify');
  };

  const handleOtpDigitChange = (val: string, index: number) => {
    const digit = val.replace(/\D/g, '').slice(-1);
    const newOtp = [...otpValues];
    newOtp[index] = digit;
    setOtpValues(newOtp);

    // Auto-focus next input
    if (digit && index < 3) {
      const nextEl = document.getElementById(`login-otp-${index + 1}`);
      nextEl?.focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      const prevEl = document.getElementById(`login-otp-${index - 1}`);
      prevEl?.focus();
    }
  };

  const handleVerifyAndLogin = () => {
    setIsVerifying(true);
    setErrorMessage(null);

    setTimeout(() => {
      const enteredOtp = otpValues.join('');
      if (enteredOtp.length < 4) {
        setErrorMessage('Please enter all 4 digits of the OTP.');
        setIsVerifying(false);
        return;
      }

      // Generate or match ID
      const generatedId = `KMB-2027-${Math.floor(1000 + Math.random() * 9000)}`;
      const newProfile: UserProfile = {
        id: `usr-${Date.now()}`,
        fullName: fullName.trim() || 'Devotee Pilgrim',
        phoneNumber: phoneNumber.trim(),
        ageGroup: ageGroup || '31-50',
        language: currentLanguage,
        bloodGroup: bloodGroup || 'B+',
        allergies: 'None recorded',
        medicalConditions: 'None recorded',
        currentMedications: 'None recorded',
        mobilityAssistance: false,
        emergencyContact: {
          name: 'Primary Contact',
          phone: '+91 98765 00000',
          relationship: 'Spouse',
        },
        pilgrimId: generatedId,
        isRegistered: true,
        emergencyQrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=KUMBHRAKSHAK:${generatedId}:${encodeURIComponent(
          fullName
        )}:Blood_${bloodGroup}:EMG_Primary`,
      };

      onLoginSuccess(newProfile);
    }, 600);
  };

  const handlePassIdLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!passIdInput.trim()) {
      setErrorMessage('Please enter your Kumbh Pilgrim e-Pass ID.');
      return;
    }

    // Check if it matches a demo account
    const matched = DEMO_ACCOUNTS.find(
      (d) => d.passId.toLowerCase() === passIdInput.trim().toLowerCase()
    );

    if (matched) {
      handleQuickDemoSelect(matched);
      return;
    }

    // Generic fallback pass
    const newProfile: UserProfile = {
      id: `usr-${Date.now()}`,
      fullName: 'Verified Pilgrim',
      phoneNumber: '9876543210',
      ageGroup: '31-50',
      language: currentLanguage,
      bloodGroup: 'B+',
      allergies: 'None',
      medicalConditions: 'None',
      currentMedications: 'None',
      mobilityAssistance: false,
      emergencyContact: {
        name: 'Family Member',
        phone: '+91 98765 00000',
        relationship: 'Spouse',
      },
      pilgrimId: passIdInput.toUpperCase(),
      isRegistered: true,
      emergencyQrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=KUMBHRAKSHAK:${passIdInput}:VerifiedPilgrim:Blood_B%2B`,
    };

    onLoginSuccess(newProfile);
  };

  const handleOfficialLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const officialProfile: UserProfile = {
      id: `duty-officer-${Date.now()}`,
      fullName: `Officer (${badgeNumber.trim() || 'Vol-774'})`,
      phoneNumber: '9822012345',
      ageGroup: '18-30',
      language: currentLanguage,
      bloodGroup: 'O+',
      allergies: 'None',
      medicalConditions: 'First Responder Trained',
      currentMedications: 'None',
      mobilityAssistance: false,
      emergencyContact: {
        name: 'Kumbh Command Center',
        phone: '112',
        relationship: 'Other',
      },
      pilgrimId: badgeNumber.trim().toUpperCase() || 'KMB-OFFICIAL-2027',
      isRegistered: true,
      emergencyQrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=KUMBH_DUTY:${badgeNumber}:Sector_${dutySector}`,
    };

    onLoginSuccess(officialProfile);
  };

  const handleQuickDemoSelect = (demo: typeof DEMO_ACCOUNTS[0]) => {
    const fullProfile: UserProfile = {
      id: `usr-${demo.passId}`,
      fullName: demo.profile.fullName || demo.label,
      phoneNumber: demo.phone,
      ageGroup: demo.profile.ageGroup || '31-50',
      language: (demo.profile.language as Language) || currentLanguage,
      bloodGroup: demo.profile.bloodGroup || 'B+',
      allergies: demo.profile.allergies || 'None',
      medicalConditions: demo.profile.medicalConditions || 'None',
      currentMedications: demo.profile.currentMedications || 'None',
      mobilityAssistance: demo.profile.mobilityAssistance || false,
      emergencyContact: demo.profile.emergencyContact || {
        name: 'Family Contact',
        phone: '+91 98765 00000',
        relationship: 'Spouse',
      },
      pilgrimId: demo.passId,
      isRegistered: true,
      emergencyQrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=KUMBHRAKSHAK:${demo.passId}:${encodeURIComponent(
        demo.profile.fullName || demo.label
      )}:Blood_${demo.profile.bloodGroup}:EMG_${demo.profile.emergencyContact?.phone}`,
    };

    onLoginSuccess(fullProfile);
  };

  const handleGuestEmergencyAccess = () => {
    const guestId = `KMB-GUEST-${Math.floor(1000 + Math.random() * 9000)}`;
    const guestProfile: UserProfile = {
      id: `usr-guest-${Date.now()}`,
      fullName: 'Emergency Guest Pilgrim',
      phoneNumber: 'Not Linked',
      ageGroup: '31-50',
      language: currentLanguage,
      bloodGroup: 'Unknown',
      allergies: 'None recorded',
      medicalConditions: 'None recorded',
      currentMedications: 'None recorded',
      mobilityAssistance: false,
      emergencyContact: {
        name: 'Kumbh Police Helpline',
        phone: '112',
        relationship: 'Other',
      },
      pilgrimId: guestId,
      isRegistered: false,
      emergencyQrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=KUMBH_GUEST:${guestId}`,
    };

    onLoginSuccess(guestProfile);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0A0D12] text-[#fadcd7] overflow-y-auto flex flex-col font-['Atkinson_Hyperlegible_Next',sans-serif]">
      {/* Top Banner with Civic & Simhastha Brand */}
      <header className="w-full bg-[#161C24] border-b border-[#3e2b27] px-4 py-3 sticky top-0 z-20 backdrop-blur-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ff8c00] to-[#b3261e] p-0.5 shadow-lg flex items-center justify-center">
              <div className="w-full h-full bg-[#1e100e] rounded-[10px] flex items-center justify-center text-[#ffb4a9]">
                <ShieldCheck className="w-5 h-5 text-[#ff8c00]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base sm:text-lg font-extrabold text-[#ffb4a9] tracking-tight leading-tight">
                  {t('appName', 'KumbhRakshak')} • {t('kumbhMela2027', 'Kumbhmela 2027')}
                </h1>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#ff8c00]/20 text-[#ffb77d] border border-[#ff8c00]/30 font-bold uppercase tracking-wider">
                  Official Portal
                </span>
              </div>
              <p className="text-[11px] text-[#ac8884] hidden sm:block">
                Nashik Kumbhmela 2027 • Disaster Management & Pilgrim Safety
              </p>
            </div>
          </div>

          {/* Language Selector in Header */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-[#281715] px-2.5 py-1 rounded-lg border border-[#5c403c]">
              <Globe className="w-3.5 h-3.5 text-[#ffb4a9]" />
              <select
                value={activeLang}
                onChange={(e) => onLanguageChange(e.target.value as Language)}
                className="bg-transparent text-xs text-[#fadcd7] font-semibold cursor-pointer focus:outline-none"
                aria-label="Select Language"
              >
                <option value="en" className="bg-[#1e100e]">English</option>
                <option value="hi" className="bg-[#1e100e]">हिन्दी (Hindi)</option>
                <option value="mr" className="bg-[#1e100e]">मराठी (Marathi)</option>
                <option value="gu" className="bg-[#1e100e]">ગુજરાતી (Gujarati)</option>
                <option value="sa" className="bg-[#1e100e]">संस्कृतम् (Sanskrit)</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Main Login Body */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 md:py-10 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Left Column: Context, Trust badges & Emergency Callouts */}
          <div className="lg:col-span-5 flex flex-col gap-4 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff8c00]/15 border border-[#ff8c00]/30 text-xs font-bold text-[#ffb77d] w-fit">
              <Flame className="w-3.5 h-3.5 text-[#ffd700]" />
              {t('mobileVerification', 'Nashik Kumbhmela 2027 Verification')}
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#fadcd7] tracking-tight leading-tight">
                Secure Pilgrim <br className="hidden sm:inline" />
                <span className="text-[#ffb4a9]">Pass & Safety Entry</span>
              </h2>
              <p className="text-sm text-[#e5bdb8] mt-2 leading-relaxed">
                Log in to synchronize your emergency Medical Vault, receive live Ghat crowd alerts, and enable one-tap GPS rescue beacons during the Holy Dip.
              </p>
            </div>

            {/* Feature Bullets */}
            <div className="space-y-2.5 pt-2">
              <div className="flex items-start gap-2.5 text-xs text-[#fadcd7]">
                <div className="p-1 rounded bg-[#372623] text-[#ff8c00] mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-[#ffb4a9]">Encrypted Medical QR Vault</span>
                  <p className="text-[11px] text-[#ac8884]">Instantly readable by on-duty doctors & 108 ambulances even offline.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 text-xs text-[#fadcd7]">
                <div className="p-1 rounded bg-[#372623] text-[#ff8c00] mt-0.5">
                  <Radio className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-[#ffb4a9]">Ghat Crowd & Shahi Snan Alerts</span>
                  <p className="text-[11px] text-[#ac8884]">Real-time flow control at Ramkund, Tapovan & Trimbakeshwar.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 text-xs text-[#fadcd7]">
                <div className="p-1 rounded bg-[#372623] text-[#ff8c00] mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-[#ffb4a9]">Kumbh Mitra AI Copilot</span>
                  <p className="text-[11px] text-[#ac8884]">Multilingual safety assistance in Marathi, Hindi & English.</p>
                </div>
              </div>
            </div>

            {/* Quick Demo Selector Chips */}
            <div className="mt-4 pt-4 border-t border-[#3e2b27]/60">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-[#ffb77d] uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#ffd700]" /> Fast-Track Demo Logins:
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {DEMO_ACCOUNTS.map((demo) => (
                  <button
                    key={demo.passId}
                    onClick={() => handleQuickDemoSelect(demo)}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-[#1a232e] hover:bg-[#253243] border border-[#2d3d52] transition-colors text-left group"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#ff8c00]/20 border border-[#ff8c00]/40 flex items-center justify-center text-xs font-bold text-[#ffb4a9]">
                        {demo.label[0]}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#fadcd7] group-hover:text-[#ffb4a9] transition-colors">
                          {demo.label}
                        </div>
                        <div className="text-[10px] text-[#ac8884]">
                          {demo.role} • {demo.passId}
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-[#ff8c00] flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                      Sign In <ArrowRight className="w-3 h-3" />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Authentication Card */}
          <div className="lg:col-span-7">
            <div className="bg-[#161C24] border border-[#44302c] rounded-2xl p-5 sm:p-7 shadow-2xl relative overflow-hidden">
              
              {/* Tab Navigation */}
              <div className="flex items-center bg-[#0F1419] p-1 rounded-xl border border-[#3e2b27] mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('otp');
                    setStep('input');
                    setErrorMessage(null);
                  }}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    authMode === 'otp'
                      ? 'bg-[#372623] text-[#ffb4a9] shadow-sm border border-[#5c403c]'
                      : 'text-[#ac8884] hover:text-[#fadcd7]'
                  }`}
                >
                  <Phone className="w-3.5 h-3.5" />
                  Mobile + OTP
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('pass_id');
                    setErrorMessage(null);
                  }}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    authMode === 'pass_id'
                      ? 'bg-[#372623] text-[#ffb4a9] shadow-sm border border-[#5c403c]'
                      : 'text-[#ac8884] hover:text-[#fadcd7]'
                  }`}
                >
                  <QrCode className="w-3.5 h-3.5" />
                  Pilgrim Pass ID
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('official');
                    setErrorMessage(null);
                  }}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    authMode === 'official'
                      ? 'bg-[#372623] text-[#ffb4a9] shadow-sm border border-[#5c403c]'
                      : 'text-[#ac8884] hover:text-[#fadcd7]'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Duty Staff
                </button>
              </div>

              {/* Error Banner */}
              {errorMessage && (
                <div className="mb-4 p-3 rounded-lg bg-[#b3261e]/20 border border-[#b3261e]/50 text-[#ffb4a9] text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#ffb4a9] shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Mode 1: Mobile Phone + OTP */}
              {authMode === 'otp' && (
                <div>
                  {step === 'input' ? (
                    <form onSubmit={handleRequestOtp} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-[#ffb4a9] mb-1.5">
                          Pilgrim Full Name <span className="text-[#ff8c00]">*</span>
                        </label>
                        <div className="relative">
                          <User className="w-4 h-4 absolute left-3 top-3 text-[#ac8884]" />
                          <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="e.g. Rahul Sharma"
                            className="w-full bg-[#0F1419] border border-[#5c403c] rounded-xl pl-9 pr-3 py-2.5 text-sm text-[#fadcd7] placeholder-[#7d5f5b] focus:outline-none focus:border-[#ffb4a9] transition-colors"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-[#ffb4a9] mb-1.5">
                            Mobile Number <span className="text-[#ff8c00]">*</span>
                          </label>
                          <div className="relative flex">
                            <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-[#5c403c] bg-[#1e100e] text-xs text-[#ac8884] font-mono">
                              +91
                            </span>
                            <input
                              type="tel"
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value)}
                              placeholder="9876543210"
                              maxLength={10}
                              className="w-full bg-[#0F1419] border border-[#5c403c] rounded-r-xl px-3 py-2.5 text-sm text-[#fadcd7] placeholder-[#7d5f5b] focus:outline-none focus:border-[#ffb4a9] font-mono transition-colors"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#ffb4a9] mb-1.5">
                            Blood Group (Emergency)
                          </label>
                          <select
                            value={bloodGroup}
                            onChange={(e) => setBloodGroup(e.target.value as UserProfile['bloodGroup'])}
                            className="w-full bg-[#0F1419] border border-[#5c403c] rounded-xl px-3 py-2.5 text-sm text-[#fadcd7] focus:outline-none focus:border-[#ffb4a9] transition-colors"
                          >
                            <option value="B+">B+ (Positive)</option>
                            <option value="O+">O+ (Positive)</option>
                            <option value="A+">A+ (Positive)</option>
                            <option value="AB+">AB+ (Positive)</option>
                            <option value="B-">B- (Negative)</option>
                            <option value="O-">O- (Negative)</option>
                            <option value="A-">A- (Negative)</option>
                            <option value="AB-">AB- (Negative)</option>
                            <option value="Unknown">Unknown</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-[#ffb4a9] mb-1.5">
                            City / District of Origin
                          </label>
                          <div className="relative">
                            <MapPin className="w-4 h-4 absolute left-3 top-3 text-[#ac8884]" />
                            <input
                              type="text"
                              value={originCity}
                              onChange={(e) => setOriginCity(e.target.value)}
                              placeholder="e.g. Pune, Mumbai, Varanasi"
                              className="w-full bg-[#0F1419] border border-[#5c403c] rounded-xl pl-9 pr-3 py-2.5 text-sm text-[#fadcd7] placeholder-[#7d5f5b] focus:outline-none focus:border-[#ffb4a9] transition-colors"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#ffb4a9] mb-1.5">
                            Age Category
                          </label>
                          <select
                            value={ageGroup}
                            onChange={(e) => setAgeGroup(e.target.value as UserProfile['ageGroup'])}
                            className="w-full bg-[#0F1419] border border-[#5c403c] rounded-xl px-3 py-2.5 text-sm text-[#fadcd7] focus:outline-none focus:border-[#ffb4a9] transition-colors"
                          >
                            <option value="18-30">18 - 30 yrs (Youth)</option>
                            <option value="31-50">31 - 50 yrs (Adult)</option>
                            <option value="51-65">51 - 65 yrs (Senior)</option>
                            <option value="65+">65+ yrs (Elderly Assistance)</option>
                          </select>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#ff8c00] to-[#e65100] hover:from-[#ffa024] hover:to-[#f57c00] text-black font-extrabold text-sm tracking-wide shadow-lg shadow-[#ff8c00]/20 flex items-center justify-center gap-2 transition-all active:scale-[0.99] mt-2"
                      >
                        <span>Send 4-Digit Security OTP</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </form>
                  ) : (
                    /* Step 2: OTP Verification */
                    <div className="space-y-5">
                      <div className="text-center">
                        <div className="w-12 h-12 rounded-full bg-[#ff8c00]/20 border border-[#ff8c00]/40 flex items-center justify-center mx-auto mb-2 text-[#ffb4a9]">
                          <KeyRound className="w-6 h-6 text-[#ff8c00]" />
                        </div>
                        <h3 className="text-lg font-bold text-[#fadcd7]">Verify Security Code</h3>
                        <p className="text-xs text-[#ac8884] mt-1">
                          Enter the 4-digit OTP sent to <span className="text-[#ffb4a9] font-mono font-bold">+91 {phoneNumber}</span>
                        </p>
                      </div>

                      {/* 4 Digit Input Boxes */}
                      <div className="flex justify-center gap-3 my-4">
                        {otpValues.map((val, idx) => (
                          <input
                            key={idx}
                            id={`login-otp-${idx}`}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={val}
                            onChange={(e) => handleOtpDigitChange(e.target.value, idx)}
                            onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                            className="w-13 h-14 text-center text-xl font-bold font-mono rounded-xl bg-[#0F1419] border-2 border-[#5c403c] text-[#ffb4a9] focus:border-[#ff8c00] focus:ring-2 focus:ring-[#ff8c00]/20 focus:outline-none transition-all"
                          />
                        ))}
                      </div>

                      {/* Timer & Resend */}
                      <div className="flex items-center justify-between text-xs text-[#ac8884] px-2">
                        <span>
                          {timer > 0 ? (
                            <>Resend code in <strong className="text-[#ffb4a9] font-mono">{timer}s</strong></>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setTimer(45);
                                setOtpValues(['2', '0', '2', '7']);
                              }}
                              className="text-[#ff8c00] hover:underline font-bold"
                            >
                              Resend OTP Now
                            </button>
                          )}
                        </span>
                        <button
                          type="button"
                          onClick={() => setStep('input')}
                          className="text-[#ac8884] hover:text-[#fadcd7] underline"
                        >
                          Change Number
                        </button>
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-2 pt-2">
                        <button
                          type="button"
                          onClick={handleVerifyAndLogin}
                          disabled={isVerifying}
                          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#ff8c00] to-[#e65100] hover:from-[#ffa024] hover:to-[#f57c00] text-black font-extrabold text-sm tracking-wide shadow-lg shadow-[#ff8c00]/20 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-50"
                        >
                          {isVerifying ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              <span>Authenticating Pilgrim Pass...</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Verify & Enter Safety Portal</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => setOtpValues(['2', '0', '2', '7'])}
                          className="w-full py-2 px-3 rounded-lg bg-[#281715] hover:bg-[#372623] border border-[#5c403c] text-xs text-[#ffb77d] font-semibold flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-[#ffd700]" />
                          Auto-fill Demo Code (2027)
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Mode 2: Existing Pilgrim Pass ID */}
              {authMode === 'pass_id' && (
                <form onSubmit={handlePassIdLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#ffb4a9] mb-1.5">
                      Kumbh e-Pass ID / Barcode Number <span className="text-[#ff8c00]">*</span>
                    </label>
                    <div className="relative">
                      <QrCode className="w-4 h-4 absolute left-3 top-3 text-[#ac8884]" />
                      <input
                        type="text"
                        value={passIdInput}
                        onChange={(e) => setPassIdInput(e.target.value.toUpperCase())}
                        placeholder="e.g. KMB-2027-8492"
                        className="w-full bg-[#0F1419] border border-[#5c403c] rounded-xl pl-9 pr-3 py-2.5 text-sm text-[#fadcd7] font-mono uppercase tracking-wider placeholder-[#7d5f5b] focus:outline-none focus:border-[#ffb4a9] transition-colors"
                        required
                      />
                    </div>
                    <p className="text-[11px] text-[#ac8884] mt-1">
                      Located on your printed Mahasnan registration card or SMS confirmation.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#ffb4a9] mb-1.5">
                      Registered Mobile Last 5 Digits
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-3 text-[#ac8884]" />
                      <input
                        type="password"
                        value={passSecret}
                        onChange={(e) => setPassSecret(e.target.value)}
                        placeholder="43210"
                        maxLength={5}
                        className="w-full bg-[#0F1419] border border-[#5c403c] rounded-xl pl-9 pr-3 py-2.5 text-sm text-[#fadcd7] font-mono placeholder-[#7d5f5b] focus:outline-none focus:border-[#ffb4a9] transition-colors"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#ff8c00] to-[#e65100] hover:from-[#ffa024] hover:to-[#f57c00] text-black font-extrabold text-sm tracking-wide shadow-lg shadow-[#ff8c00]/20 flex items-center justify-center gap-2 transition-all active:scale-[0.99] mt-4"
                  >
                    <span>Load Pilgrim Pass</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* Mode 3: Official Duty Staff / Volunteers */}
              {authMode === 'official' && (
                <form onSubmit={handleOfficialLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#ffb4a9] mb-1.5">
                      Official Volunteer / Police ID Badge <span className="text-[#ff8c00]">*</span>
                    </label>
                    <div className="relative">
                      <ShieldCheck className="w-4 h-4 absolute left-3 top-3 text-[#ac8884]" />
                      <input
                        type="text"
                        value={badgeNumber}
                        onChange={(e) => setBadgeNumber(e.target.value.toUpperCase())}
                        placeholder="e.g. MH-NSK-VOL-774"
                        className="w-full bg-[#0F1419] border border-[#5c403c] rounded-xl pl-9 pr-3 py-2.5 text-sm text-[#fadcd7] font-mono placeholder-[#7d5f5b] focus:outline-none focus:border-[#ffb4a9] transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#ffb4a9] mb-1.5">
                      Assigned Deployment Zone / Sector
                    </label>
                    <select
                      value={dutySector}
                      onChange={(e) => setDutySector(e.target.value)}
                      className="w-full bg-[#0F1419] border border-[#5c403c] rounded-xl px-3 py-2.5 text-sm text-[#fadcd7] focus:outline-none focus:border-[#ffb4a9] transition-colors"
                    >
                      <option value="Sector 4 (Ramkund - Godavari)">Sector 4 (Ramkund - Godavari)</option>
                      <option value="Sector 1 (Tapovan Ghats)">Sector 1 (Tapovan Ghats)</option>
                      <option value="Sector 2 (Panchavati Temples)">Sector 2 (Panchavati Temples)</option>
                      <option value="Sector 3 (Trimbakeshwar Temple)">Sector 3 (Trimbakeshwar Temple)</option>
                      <option value="Sector 5 (Nashik Central Station)">Sector 5 (Nashik Central Station)</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#b3261e] to-[#8c1d18] hover:from-[#c93b33] hover:to-[#9e211b] text-white font-extrabold text-sm tracking-wide shadow-lg shadow-[#b3261e]/20 flex items-center justify-center gap-2 transition-all active:scale-[0.99] mt-4"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#ffb4a9]" />
                    <span>Authorize Official Duty Access</span>
                  </button>
                </form>
              )}

              {/* Guest / Emergency Access Option at Bottom */}
              <div className="mt-6 pt-5 border-t border-[#3e2b27] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <span className="text-[#ac8884] flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-[#ff8c00]" />
                  Need urgent medical or SOS assistance?
                </span>
                <button
                  type="button"
                  onClick={handleGuestEmergencyAccess}
                  className="px-3 py-1.5 rounded-lg bg-[#281715] hover:bg-[#372623] text-[#fadcd7] border border-[#5c403c] hover:border-[#ffb4a9] transition-all font-semibold"
                >
                  Continue as Emergency Guest →
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Footer / Emergency Helpline Bar */}
      <footer className="w-full bg-[#161C24] border-t border-[#3e2b27] px-4 py-3 text-center text-xs text-[#ac8884]">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[#fadcd7] font-semibold">{t('emergencyHelpline247', '24x7 Kumbhmela Emergency Control: 112 (Police) • 108 (Ambulance) • 1077 (Disaster)')}</span>
          </div>
          <div className="text-[11px]">
            Govt of Maharashtra • Nashik City Police & Civil Administration
          </div>
        </div>
      </footer>
    </div>
  );
};
