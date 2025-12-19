
import React from 'react';
import type { WaveOptions } from '../types';
import { CloseIcon } from '../constants';

interface ControlPanelProps {
  options: WaveOptions;
  setOptions: (options: WaveOptions) => void;
  onClose: () => void;
  voices: SpeechSynthesisVoice[];
  selectedVoiceURI: string | null;
  setSelectedVoiceURI: (uri: string) => void;
}

interface ControlSliderProps {
    id: keyof WaveOptions;
    label: string;
    min: number;
    max: number;
    step: number;
    value: number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ControlSlider: React.FC<ControlSliderProps> = ({ id, label, min, max, step, value, onChange }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
        <div className="flex items-center space-x-3">
            <input
                id={id}
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={onChange}
                className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <span className="text-xs font-mono w-12 text-center bg-gray-700/50 rounded p-1">{value}</span>
        </div>
    </div>
);

const ControlPanel: React.FC<ControlPanelProps> = ({ options, setOptions, onClose, voices, selectedVoiceURI, setSelectedVoiceURI }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type } = e.target;
    setOptions({
      ...options,
      [id]: type === 'number' || type === 'range' ? parseFloat(value) : value,
    });
  };

  const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedVoiceURI(e.target.value);
  };

  return (
    <div className="w-80 h-full bg-gray-800/80 backdrop-blur-lg p-6 shadow-2xl flex flex-col">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Customize Aura</h2>
            <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-white">
                <CloseIcon />
            </button>
        </div>
        
        <div className="space-y-6 flex-1 overflow-y-auto pr-2">
            <p className="text-sm text-gray-400">The AI's motion and speed will change dynamically based on its emotional tone. You can control the core aesthetics below.</p>

            <ControlSlider id="waveCount" label="Wave Complexity" min={1} max={10} step={1} value={options.waveCount} onChange={handleChange} />

            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Colors</label>
                <div className="flex items-center space-x-4">
                    <input type="color" id="color1" value={options.color1} onChange={handleChange} className="w-full h-10 p-1 bg-gray-700 border border-gray-600 rounded-md cursor-pointer"/>
                    <input type="color" id="color2" value={options.color2} onChange={handleChange} className="w-full h-10 p-1 bg-gray-700 border border-gray-600 rounded-md cursor-pointer"/>
                </div>
            </div>

            <div>
                <label htmlFor="background" className="block text-sm font-medium text-gray-300 mb-1">Background Color</label>
                <input type="color" id="background" value={options.background} onChange={handleChange} className="w-full h-10 p-1 bg-gray-700 border border-gray-600 rounded-md cursor-pointer"/>
            </div>

            <div>
                <label htmlFor="voice" className="block text-sm font-medium text-gray-300 mb-1">AI Voice</label>
                <select
                    id="voice"
                    value={selectedVoiceURI || ''}
                    onChange={handleVoiceChange}
                    disabled={voices.length === 0}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {voices.length === 0 ? (
                        <option>Loading voices...</option>
                    ) : (
                        voices.map(voice => (
                            <option key={voice.voiceURI} value={voice.voiceURI}>
                                {voice.name} ({voice.lang})
                            </option>
                        ))
                    )}
                </select>
            </div>
        </div>
    </div>
  );
};

export default ControlPanel;
