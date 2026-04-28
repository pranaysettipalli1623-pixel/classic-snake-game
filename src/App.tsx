import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Track } from './types';

// Dummy AI generated music tracks
const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Odyssey',
    artist: 'AI.Gen',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    coverArt: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: '2',
    title: 'Cybernetic Dreams',
    artist: 'SynthNet',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    coverArt: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: '3',
    title: 'Digital Horizon',
    artist: 'AudioBot-9',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    coverArt: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=200&auto=format&fit=crop'
  }
];

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans overflow-hidden relative">
      {/* Dynamic ambient global background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-black to-black -z-20 pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-pink-900/10 via-transparent to-transparent -z-20 pointer-events-none"></div>
      
      {/* Header */}
      <header className="w-full flex items-center justify-between px-8 py-6 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-gradient-to-tr from-cyan-400 to-pink-500 shadow-[0_0_15px_rgba(34,211,238,0.5)] flex items-center justify-center">
            <span className="text-black font-black font-mono tracking-tighter">NS</span>
          </div>
          <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-pink-500 tracking-tight drop-shadow-[0_0_10px_rgba(34,211,238,0.3)]">
            NEONSNAKE
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-mono text-zinc-400">
            v1.0.0
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-12 p-6 z-10 relative">
        
        {/* Play Area (Snake Game) */}
        <section className="flex-1 flex justify-center w-full relative">
          <SnakeGame />
        </section>

        {/* Side Panel (Music Player & Info) */}
        <aside className="w-full lg:w-96 flex flex-col gap-8 items-center lg:items-start shrink-0">
          <div className="text-center lg:text-left space-y-4 max-w-xs">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-100">
              Retro Game,<br/>
              <span className="text-indigo-400">Next-Gen Audio.</span>
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Play classic Snake in a synthwave dimension while listening to AI-generated dummy tracks. Use arrow keys to navigate.
            </p>
          </div>
          
          <MusicPlayer tracks={DUMMY_TRACKS} />
        </aside>

      </main>
      
      {/* Minor decorative grid base */}
      <div 
        className="absolute bottom-0 w-full h-[30vh] bg-repeat-x -z-10 opacity-20 pointer-events-none" 
        style={{
          backgroundImage: 'linear-gradient(rgba(236, 72, 153, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(236, 72, 153, 0.3) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          transform: 'perspective(500px) rotateX(60deg)',
          transformOrigin: 'bottom'
        }}
      />
    </div>
  );
}
