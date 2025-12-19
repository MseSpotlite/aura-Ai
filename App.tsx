
import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { Chat } from '@google/genai';
import { GoogleGenAI } from '@google/genai';
import { WaveOptions, AIState, ChatMessage, AIEmotion } from './types';
import { DEFAULT_WAVE_OPTIONS, CogIcon, CURATED_VOICE_NAMES, EMOTION_STYLES } from './constants';
import AIVisualizer from './components/AIVisualizer';
import ControlPanel from './components/ControlPanel';
import ChatInterface from './components/ChatInterface';

const App: React.FC = () => {
  const [waveOptions, setWaveOptions] = useState<WaveOptions>(DEFAULT_WAVE_OPTIONS);
  const [aiState, setAIState] = useState<AIState>('idle');
  const [aiEmotion, setAIEmotion] = useState<AIEmotion>('neutral');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { sender: 'ai', text: "I am Aura, a visual AI. How can I help you today? My form and motion will change based on the tone of our conversation." }
  ]);
  const aiRef = useRef<GoogleGenAI | null>(null);
  const chatInstanceRef = useRef<Chat | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string | null>(null);

  // Effect to load and filter speech synthesis voices
  useEffect(() => {
    const loadVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      if (allVoices.length > 0) {
        const curatedVoices = CURATED_VOICE_NAMES.map(name => 
            allVoices.find(v => v.name === name)
        ).filter((v): v is SpeechSynthesisVoice => v !== undefined);
        
        let finalVoices = curatedVoices;
        // If no curated voices found, fall back to any english voices
        if (finalVoices.length === 0) {
            finalVoices = allVoices.filter(v => v.lang.startsWith('en'));
        }

        setVoices(finalVoices);
        if (!selectedVoiceURI && finalVoices.length > 0) {
          setSelectedVoiceURI(finalVoices[0].voiceURI);
        }
      }
    };
    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
      window.speechSynthesis.cancel();
    };
  }, [selectedVoiceURI]);

  // Effect to initialize AI
  useEffect(() => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      aiRef.current = ai;
      const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: 'You are Aura, a visual AI. Keep your responses concise, friendly, and helpful. You are represented by waves of light and energy.',
        },
      });
      chatInstanceRef.current = chat;
    } catch (error) {
      console.error("Failed to initialize Gemini AI:", error);
      setChatHistory(prev => [...prev, { sender: 'ai', text: 'Error: Could not connect to the AI. Please check the API key.' }]);
      setAIState('idle');
    }
  }, []);

  // Effect to update wave options when emotion changes
  useEffect(() => {
    const style = EMOTION_STYLES[aiEmotion] || EMOTION_STYLES['neutral'];
    setWaveOptions(prevOptions => ({
      ...prevOptions,
      ...style,
    }));
  }, [aiEmotion]);

  const analyzeAndSetEmotion = useCallback(async (text: string) => {
    if (!aiRef.current || !text) return;
    try {
      const prompt = `Analyze the sentiment of the following text and classify it into one of these categories: "neutral", "calm", "happy", "excited", "angry", "sad", "curious", "contemplative", "playful". Respond with only the category name in lowercase and nothing else. Text: "${text}"`;

      const response = await aiRef.current.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { temperature: 0 },
      });
      
      const emotionResult = response.text.trim().toLowerCase() as AIEmotion;
      if (Object.keys(EMOTION_STYLES).includes(emotionResult)) {
        setAIEmotion(emotionResult);
      } else {
        setAIEmotion('neutral');
      }
    } catch (error) {
      console.error("Emotion analysis failed:", error);
      setAIEmotion('neutral');
    }
  }, []);

  const speak = useCallback((text: string) => {
    if (!text || voices.length === 0 || !selectedVoiceURI) {
      setAIState('idle');
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const selectedVoice = voices.find(v => v.voiceURI === selectedVoiceURI);
    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.onstart = () => setAIState('speaking');
    utterance.onend = () => setAIState('idle');
    utterance.onerror = () => {
      console.error("Speech synthesis error");
      setAIState('idle');
    };
    window.speechSynthesis.speak(utterance);
  }, [voices, selectedVoiceURI]);
  
  const handleSendMessage = useCallback(async (message: string) => {
    if (!chatInstanceRef.current || !message.trim()) return;
    setAIState('thinking');
    setAIEmotion('neutral'); // Reset emotion to neutral while thinking
    setChatHistory(prev => [...prev, { sender: 'user', text: message }]);
    setChatHistory(prev => [...prev, { sender: 'ai', text: '' }]);

    try {
      const stream = await chatInstanceRef.current.sendMessageStream({ message });
      let fullResponse = "";
      for await (const chunk of stream) {
        fullResponse += chunk.text;
        setChatHistory(prev => {
          const newHistory = [...prev];
          newHistory[newHistory.length - 1] = { sender: 'ai', text: fullResponse };
          return newHistory;
        });
      }
      speak(fullResponse);
      analyzeAndSetEmotion(fullResponse);
    } catch (error) {
      console.error('Error sending message to Gemini:', error);
      const errorMessage = 'Sorry, I encountered an error. Please try again.';
      setChatHistory(prev => {
        const newHistory = [...prev];
        newHistory[newHistory.length - 1] = { sender: 'ai', text: errorMessage };
        return newHistory;
      });
      setAIState('idle');
      setAIEmotion('sad');
    }
  }, [speak, analyzeAndSetEmotion]);

  return (
    <div style={{ backgroundColor: waveOptions.background }} className="min-h-screen text-gray-100 font-sans transition-colors duration-500">
      <div className="relative flex flex-col lg:flex-row h-screen overflow-hidden">
        <button 
          onClick={() => setIsPanelOpen(!isPanelOpen)}
          className="absolute top-4 left-4 z-30 p-2 bg-gray-800/50 rounded-full text-gray-300 hover:bg-gray-700/70 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500"
          aria-label="Toggle controls panel"
        >
          <CogIcon />
        </button>

        <div className={`absolute lg:relative top-0 left-0 h-full z-20 transition-transform duration-300 ease-in-out ${isPanelOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <ControlPanel
                options={waveOptions}
                setOptions={setWaveOptions}
                onClose={() => setIsPanelOpen(false)}
                voices={voices}
                selectedVoiceURI={selectedVoiceURI}
                setSelectedVoiceURI={setSelectedVoiceURI}
            />
        </div>
        
        <main className="flex-1 flex flex-col h-full w-full">
          <div className="flex-1 flex items-center justify-center relative">
            <AIVisualizer options={waveOptions} state={aiState} />
          </div>
          <div className="flex-grow-0 flex-shrink-0 h-2/5 max-h-[45vh] p-4 pt-0">
             <ChatInterface
                messages={chatHistory}
                onSendMessage={handleSendMessage}
                isThinking={aiState === 'thinking'}
             />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
