import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music } from 'lucide-react';
import { Track } from '../types';

interface MusicPlayerProps {
  tracks: Track[];
}

export default function MusicPlayer({ tracks }: MusicPlayerProps) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = tracks[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch((err) => {
        console.error("Audio playback failed:", err);
        setIsPlaying(false);
      });
    }
  }, [currentTrackIndex, isPlaying]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  };

  const playNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
    setIsPlaying(true);
  };

  const playPrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
    setIsPlaying(true);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="w-full max-w-sm rounded-2xl bg-zinc-950 border border-zinc-800 shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden relative group">
      {/* Dynamic background glow based on playing state */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br from-pink-500/10 to-indigo-500/10 transition-opacity duration-1000 ease-in-out ${
          isPlaying ? 'opacity-100' : 'opacity-0'
        }`}
      />
      
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onEnded={playNext}
        preload="metadata"
      />

      <div className="p-5 flex flex-col gap-6 relative z-10">
        
        {/* Header / Current Track Info */}
        <div className="flex gap-4 items-center">
          <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 shadow-[0_0_15px_rgba(0,0,0,0.5)] group">
            <img 
              src={currentTrack.coverArt} 
              alt={currentTrack.title}
              className={`w-full h-full object-cover transition-transform duration-700 ${isPlaying ? 'scale-110' : 'scale-100'}`}
            />
            {isPlaying && (
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <Music className="w-6 h-6 text-white animate-bounce" />
              </div>
            )}
          </div>
          
          <div className="flex flex-col min-w-0 flex-1">
            <h3 className="text-white font-semibold truncate tracking-wide text-lg drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">
              {currentTrack.title}
            </h3>
            <p className="text-indigo-400 font-medium text-sm truncate opacity-80">
              {currentTrack.artist}
            </p>
            <div className="flex items-center gap-2 mt-1">
               <span className="flex h-2 w-2 relative">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75 ${isPlaying ? 'block' : 'hidden'}`}></span>
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${isPlaying ? 'bg-pink-500' : 'bg-zinc-600'}`}></span>
                </span>
               <span className="text-[10px] uppercase font-mono text-zinc-500 tracking-wider">
                 AI Generated
               </span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 bg-zinc-900 rounded-full px-2 py-1 border border-zinc-800/80">
            <button 
              onClick={toggleMute}
              className="p-2 text-zinc-400 hover:text-white transition-colors hover:bg-zinc-800 rounded-full"
            >
              {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(parseFloat(e.target.value));
                setIsMuted(false);
              }}
              className="w-16 h-1 bg-zinc-700 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={playPrev}
              className="p-2 rounded-full text-zinc-300 hover:text-white hover:bg-white/10 transition-all active:scale-90"
            >
              <SkipBack size={24} fill="currentColor" className="opacity-80" />
            </button>
            
            <button
              onClick={togglePlay}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-indigo-600 text-white shadow-[0_0_15px_rgba(236,72,153,0.4)] hover:shadow-[0_0_25px_rgba(236,72,153,0.6)] transition-all active:scale-95 group-hover:from-pink-400 group-hover:to-indigo-500"
            >
              {isPlaying ? (
                <Pause size={24} fill="currentColor" />
              ) : (
                <Play size={24} fill="currentColor" className="ml-1" />
              )}
            </button>

            <button
              onClick={playNext}
              className="p-2 rounded-full text-zinc-300 hover:text-white hover:bg-white/10 transition-all active:scale-90"
            >
              <SkipForward size={24} fill="currentColor" className="opacity-80" />
            </button>
          </div>
        </div>
        
      </div>
      
      {/* Decorative spectrum lines at bottom */}
      <div className="h-1 w-full flex gap-[2px]">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i} 
            className={`flex-1 ${isPlaying ? 'bg-indigo-500/50 mix-blend-screen animate-pulse' : 'bg-transparent'}`}
            style={{ 
              animationDelay: `${Math.random() * 0.5}s`,
              animationDuration: `${0.4 + Math.random() * 0.4}s` 
            }}
          />
        ))}
      </div>
    </div>
  );
}
