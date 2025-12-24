
import React, { useState, useRef } from 'react';
import { Music, Music2 } from 'lucide-react';
import { COLORS } from '../constants';
import musicUrl from '../background.mp3';

const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Import music file to let Vite handle the path and hashing


  // Royalty-free Christmas music link (placeholder)
  // const musicUrl = "/Users/yue/Desktop/MoonNight_ReadingGroup/docs/kuusi/backgroud.mp3";

  const toggleMusic = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(musicUrl);
      audioRef.current.loop = true;
    }

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.log("Audio play failed:", e));
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <button
      onClick={toggleMusic}
      className="fixed top-6 right-6 z-[60] p-3 rounded-full shadow-lg transition-transform hover:scale-110 active:scale-95"
      style={{ backgroundColor: COLORS.poinsettaRed, color: COLORS.candle }}
    >
      {isPlaying ? (
        <Music className="w-6 h-6 animate-pulse" />
      ) : (
        <Music2 className="w-6 h-6 opacity-60" />
      )}
      <span className="sr-only">Toggle Background Music</span>
    </button>
  );
};

export default MusicPlayer;
