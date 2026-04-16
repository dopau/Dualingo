import React from 'react';
import { Flame, Zap, Gem, Wifi, WifiOff, Info } from 'lucide-react';
import { UserStats } from '../types';
import { motion } from 'motion/react';

interface GamificationHeaderProps {
  stats: UserStats;
  onToggleOffline: () => void;
}

export const GamificationHeader: React.FC<GamificationHeaderProps> = ({ stats, onToggleOffline }) => {
  return (
    <div className="sticky top-0 bg-white z-40 border-b-2 border-border px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {/* Streak */}
        <div className="group relative flex items-center gap-1.5 text-[#FF9600] font-black cursor-help">
          <Flame className="w-5 h-5 fill-current" />
          <span>{stats.streak}</span>
          <div className="absolute top-full left-0 mt-2 w-48 p-3 bg-text text-white text-[10px] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
            <p className="font-black mb-1 uppercase tracking-wider">Streak</p>
            <p className="font-bold opacity-80">Complete a lesson every day to build your streak! Use a Streak Shield to protect it.</p>
          </div>
        </div>

        {/* Gems */}
        <div className="group relative flex items-center gap-1.5 text-secondary font-black cursor-help">
          <Gem className="w-5 h-5 fill-current" />
          <span>{stats.gems}</span>
          <div className="absolute top-full left-0 mt-2 w-48 p-3 bg-text text-white text-[10px] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
            <p className="font-black mb-1 uppercase tracking-wider">Gems</p>
            <p className="font-bold opacity-80">Gems are used to buy items in the shop, like Streak Shields and Heart Refills.</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button 
          onClick={onToggleOffline}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black transition-all border-2 ${
            stats.isOffline 
              ? "bg-bg text-text-light border-border" 
              : "bg-[#EDFFDF] text-primary border-primary"
          }`}
        >
          {stats.isOffline ? <WifiOff className="w-3 h-3" /> : <Wifi className="w-3 h-3" />}
          <span className="uppercase tracking-widest">{stats.isOffline ? "Offline" : "Online"}</span>
        </button>
      </div>
    </div>
  );
};
