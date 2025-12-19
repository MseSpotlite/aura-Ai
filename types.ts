
export interface WaveOptions {
  waveCount: number;
  amplitude: number;
  frequency: number;
  speed: number;
  color1: string;
  color2: string;
  background: string;
}

export type AIState = 'idle' | 'thinking' | 'speaking';

export type AIEmotion = 'neutral' | 'calm' | 'happy' | 'excited' | 'angry' | 'sad';

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}
