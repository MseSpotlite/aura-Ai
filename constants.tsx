import React from 'react';
import type { WaveOptions, AIEmotion } from './types';

export const DEFAULT_WAVE_OPTIONS: WaveOptions = {
  waveCount: 3,
  amplitude: 60,
  frequency: 30,
  speed: 0.15,
  color1: '#6366F1', // indigo-500
  color2: '#EC4899', // pink-500
  background: '#111827', // gray-900
};

export const EMOTION_STYLES: Record<AIEmotion, Partial<WaveOptions>> = {
  neutral: { 
    amplitude: 60, frequency: 30, speed: 0.15, 
    color1: '#6366F1', color2: '#EC4899', background: '#111827' 
  },
  calm: { 
    amplitude: 40, frequency: 20, speed: 0.1, 
    color1: '#2dd4bf', color2: '#38bdf8', background: '#0f172a' 
  },
  happy: { 
    amplitude: 80, frequency: 40, speed: 0.25, 
    color1: '#facc15', color2: '#fb923c', background: '#1c1917' 
  },
  excited: { 
    amplitude: 100, frequency: 50, speed: 0.35, 
    color1: '#f472b6', color2: '#c084fc', background: '#1e1b4b' 
  },
  angry: { 
    amplitude: 120, frequency: 70, speed: 0.4, 
    color1: '#ef4444', color2: '#f97316', background: '#18181b' 
  },
  sad: { 
    amplitude: 30, frequency: 15, speed: 0.08, 
    color1: '#6b7280', color2: '#3b82f6', background: '#111827' 
  },
};


export const CURATED_VOICE_NAMES: string[] = [
    'Google US English',
    'Microsoft Zira - English (United States)',
    'Samantha',
    'Google UK English Female',
];


export const CogIcon: React.FC<{className?: string}> = ({className = "h-6 w-6"}) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l-1.41-.513M5.106 17.785l1.15-.964m11.69-9.642l-1.149-.964M7.501 19.795l.75-1.3m7.5-12.99l-.75-1.3m-6.063 16.68l.26-1.42m7.563-12.43l-.26-1.42m-8.583 15.602l-.513-1.41m5.13-14.095l-.513 1.41M17.785 5.106l-.964 1.15m-9.642 11.69l-.964-1.15M19.795 7.501l-1.3-.75m-12.99 7.5l-1.3.75m16.68-6.063l-1.42.26M3.205 12l1.42.26m12.43-7.563l1.42-.26M12 3.205l.26 1.42m0 15.15l.26-1.42m5.66-8.583l-1.41-.513M5.905 16.095l-1.41-.513" />
  </svg>
);

export const SendIcon: React.FC<{className?: string}> = ({className = "h-6 w-6"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
    </svg>
);

export const CloseIcon: React.FC<{className?: string}> = ({className = "h-6 w-6"}) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);