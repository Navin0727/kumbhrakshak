import React, { useState, useRef, useEffect } from 'react';
import { UserProfile } from '../types';

interface KumbhMitraAIModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onOpenSOS: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  suggestions?: string[];
}

export const KumbhMitraAIModal: React.FC<KumbhMitraAIModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onOpenSOS,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'bot',
      text: `Namaste ${userProfile.fullName || 'Pilgrim'}! 🙏 I am **Kumbh Mitra (कुंभ मित्र)**, your dedicated AI Pilgrim Safety & Navigation Assistant.
How can I assist your holy pilgrimage in Nashik today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestions: [
        'How to reach Ramkund safe bathing zone?',
        'Where is the nearest medical aid camp?',
        'Goda Maha Aarti timings and entrance gate',
        'What to do if someone in my group is lost?',
      ],
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/safety-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          language: userProfile.language || 'English',
          context: {
            pilgrimName: userProfile.fullName,
            bloodGroup: userProfile.bloodGroup,
            currentSector: 'Nashik Sector 4 (Panchavati / Ramkund)',
          },
        }),
      });

      const data = await response.json();
      const botMsg: ChatMessage = {
        id: 'msg-' + (Date.now() + 1),
        sender: 'bot',
        text:
          data.reply ||
          'For immediate help, please approach the nearest Police Booth in Sector 4 or call 112 / 108.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const fallbackMsg: ChatMessage = {
        id: 'msg-' + (Date.now() + 1),
        sender: 'bot',
        text: `🙏 **KumbhRakshak Emergency Guide**:
- **Immediate Rescue/Police**: Call 112 or press the RED SOS button.
- **Medical Emergency / First Aid**: Ramkund Ghat #2 First-Aid Tent & Civil Hospital Nashik (1.2 km).
- **Lost & Found Desk**: Panchavati Sector 4 Police Outpost.
- **Holy Snan Water Safety**: Please stay within safety chains at Ramkund.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-[#171c21] border border-[#ff8c00]/50 rounded-2xl max-w-lg w-full h-[85vh] sm:h-[650px] shadow-2xl flex flex-col overflow-hidden text-[#dee3ea]">
        {/* Header */}
        <div className="p-3.5 sm:p-4 bg-[#0a0f14] border-b border-[#5c403c] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#ff8c00]/20 flex items-center justify-center border border-[#ff8c00]/50 text-[#ffb77d]">
              <span className="material-symbols-outlined text-[22px]">smart_toy</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-sm sm:text-base text-white">
                  Kumbh Mitra (कुंभ मित्र)
                </h3>
                <span className="text-[9px] bg-[#46DFA6]/20 text-[#46DFA6] font-bold px-1.5 py-0.2 rounded border border-[#46DFA6]/30">
                  AI Active
                </span>
              </div>
              <p className="text-[11px] text-[#ddc1ae]">
                Nashik 2027 Official Safety &amp; Spiritual Concierge
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onOpenSOS}
              className="px-2.5 py-1 bg-[#F44336] text-white font-extrabold text-[11px] rounded shadow hover:bg-[#d32f2f]"
            >
              SOS
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#252a30] text-[#dee3ea] flex items-center justify-center hover:bg-[#30353b]"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-3 bg-[#0F1419]/90 bg-tactical-grid text-xs sm:text-sm">
          {messages.map((m) => {
            const isBot = m.sender === 'bot';
            return (
              <div
                key={m.id}
                className={`flex flex-col ${isBot ? 'items-start' : 'items-end'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 sm:p-3.5 shadow-md ${
                    isBot
                      ? 'bg-[#1B2025] text-[#fadcd7] border border-[#5c403c]/60 rounded-tl-sm'
                      : 'bg-[#ff8c00] text-black font-semibold rounded-tr-sm'
                  }`}
                >
                  <p className="whitespace-pre-line leading-relaxed">{m.text}</p>
                </div>
                <span className="text-[9px] text-[#ac8884] mt-1 px-1">{m.timestamp}</span>

                {/* Suggestions Pills if any */}
                {m.suggestions && (
                  <div className="flex flex-wrap gap-1.5 mt-2 max-w-[90%]">
                    {m.suggestions.map((sug, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(sug)}
                        className="text-[11px] bg-[#252a30] hover:bg-[#30353b] text-[#ffb77d] border border-[#ff8c00]/30 rounded-full px-2.5 py-1 text-left transition-colors cursor-pointer"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-[#ffb77d] bg-[#1B2025] p-3 rounded-2xl border border-[#5c403c] w-max">
              <div className="w-2 h-2 rounded-full bg-[#ff8c00] animate-ping" />
              <span>Kumbh Mitra is retrieving safety data...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-[#0a0f14] border-t border-[#5c403c] flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask about safe routes, medical tents, Aarti timings..."
            className="flex-1 bg-[#1B2025] border border-[#5c403c] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-[#ac8884] focus:outline-none focus:border-[#ff8c00]"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || isLoading}
            className="w-10 h-10 rounded-xl bg-[#ff8c00] hover:bg-[#ff8c00]/90 disabled:opacity-50 text-black flex items-center justify-center font-bold cursor-pointer transition-all active:scale-95 shrink-0"
          >
            <span className="material-symbols-outlined text-[20px]">send</span>
          </button>
        </div>
      </div>
    </div>
  );
};
