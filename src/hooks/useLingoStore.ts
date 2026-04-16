import { useState, useEffect } from 'react';
import { UserStats, Language } from '../types';

const INITIAL_STATS: UserStats = {
  xp: 0,
  streak: 0,
  gems: 500,
  hearts: 5,
  lastActive: new Date().toISOString(),
  isOffline: false,
};

export function useLingoStore() {
  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('lingo_stats');
    return saved ? JSON.parse(saved) : INITIAL_STATS;
  });

  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => {
    return (localStorage.getItem('lingo_lang') as Language) || 'Spanish';
  });

  const [completedLessons, setCompletedLessons] = useState<string[]>(() => {
    const saved = localStorage.getItem('lingo_completed');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('lingo_stats', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem('lingo_lang', currentLanguage);
  }, [currentLanguage]);

  useEffect(() => {
    localStorage.setItem('lingo_completed', JSON.stringify(completedLessons));
  }, [completedLessons]);

  const addXP = (amount: number) => {
    setStats(prev => ({ ...prev, xp: prev.xp + amount }));
  };

  const useHeart = () => {
    setStats(prev => ({ ...prev, hearts: Math.max(0, prev.hearts - 1) }));
  };

  const addGems = (amount: number) => {
    setStats(prev => ({ ...prev, gems: prev.gems + amount }));
  };

  const toggleOffline = () => {
    setStats(prev => ({ ...prev, isOffline: !prev.isOffline }));
  };

  const completeLesson = (id: string) => {
    if (!completedLessons.includes(id)) {
      setCompletedLessons(prev => [...prev, id]);
      addXP(10);
      addGems(5);
    }
  };

  return {
    stats,
    currentLanguage,
    setCurrentLanguage,
    completedLessons,
    addXP,
    useHeart,
    addGems,
    toggleOffline,
    completeLesson,
  };
}
