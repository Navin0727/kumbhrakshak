import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface SplashScreenProps {
  onComplete?: () => void;
  onFinish?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete, onFinish }) => {
  const [statusText, setStatusText] = useState('Initializing Secure Network...');

  const handleDone = () => {
    if (typeof onComplete === 'function') {
      onComplete();
    } else if (typeof onFinish === 'function') {
      onFinish();
    }
  };

  useEffect(() => {
    const t1 = setTimeout(() => setStatusText('Connecting to Sector 4 Command...'), 900);
    const t2 = setTimeout(() => setStatusText('Synchronizing Live Ghat Safety Map...'), 1700);
    const t3 = setTimeout(() => {
      handleDone();
    }, 2500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete, onFinish]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0F1419] text-[#fadcd7] overflow-hidden select-none"
      >
        {/* Background Image with dark overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/65 z-10" />
          <img
            alt="Nashik Godavari Ghats at Dawn"
            className="w-full h-full object-cover scale-105 filter brightness-75"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBuZQLZePVrVrt0lGJim7mqhmXlDgQ5bVN_VnwKw3aktTU4jLdgMZhu559Rqq6TWfx117MvQAbqC0_OitnkYGAQNC51WvYGTB8o0E1Vc_LeT_QEL8X_fCo8j9AY9k0Phn3J3YcbHkChE1APN0yPYUVpR0OM6tfswhTDSWb-w7eUyQVOocTzX-DBa-aEFT5IgLAIsCCTpdD_ZY2pEUE584RV2CO8PrSh_8HoFwjNstO3TRzbVB24DlG0nw"
          />
        </div>

        {/* Center Branding Content */}
        <div className="relative z-20 flex flex-col items-center justify-center px-6 max-w-sm text-center">
          {/* Pulsing Shield Icon */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="mb-4 text-[#ffb4a9]"
          >
            <div className="w-24 h-24 rounded-full bg-[#ffb4a9]/10 flex items-center justify-center border border-[#ffb4a9]/30 shadow-[0_0_30px_rgba(255,180,169,0.2)]">
              <span className="material-symbols-outlined text-[64px] icon-fill text-[#ffb4a9]">
                shield
              </span>
            </div>
          </motion.div>

          {/* App Name */}
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#ffb4a9] font-['Atkinson_Hyperlegible_Next']"
          >
            KumbhRakshak
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-xs sm:text-sm text-[#e5bdb8] font-bold tracking-[0.25em] uppercase mt-2.5 font-['Atkinson_Hyperlegible_Next']"
          >
            YOUR SAFETY. OUR PRIORITY.
          </motion.p>
        </div>

        {/* Bottom Loading Progress */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="absolute bottom-16 sm:bottom-20 flex flex-col items-center z-20"
        >
          <div className="relative w-12 h-12 mb-3">
            <div className="w-10 h-10 border-3 border-[#ffb4a9]/20 border-t-[#ffb4a9] rounded-full animate-spin mx-auto" />
          </div>
          <p className="text-xs sm:text-sm text-[#fadcd7]/75 font-medium tracking-wide">
            {statusText}
          </p>

          <button
            onClick={handleDone}
            className="mt-4 px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs text-[#fadcd7] border border-white/20 transition-colors"
          >
            Skip Intro →
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
