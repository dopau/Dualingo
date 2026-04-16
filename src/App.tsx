import React, { useState, useEffect } from 'react';
import { useLingoStore } from './hooks/useLingoStore';
import { COURSES } from './constants';
import { GamificationHeader } from './components/GamificationHeader';
import { LessonView } from './components/LessonView';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  Trophy, 
  User, 
  ShoppingBag, 
  Lock, 
  CheckCircle2, 
  Star,
  ChevronRight,
  Settings,
  Globe,
  Gem,
  Flame,
  Heart,
  Zap
} from 'lucide-react';
import { cn } from './lib/utils';
import confetti from 'canvas-confetti';

export default function App() {
  const { 
    stats, 
    currentLanguage, 
    setCurrentLanguage, 
    completedLessons, 
    completeLesson,
    toggleOffline,
    useHeart,
    addGems
  } = useLingoStore();

  const [activeTab, setActiveTab] = useState<'home' | 'leaderboard' | 'profile' | 'shop'>('home');
  const [activeLessonUnit, setActiveLessonUnit] = useState<string | null>(null);
  const [showSplash, setShowSplash] = useState(true);
  const [shopItemToBuy, setShopItemToBuy] = useState<{ name: string, cost: number } | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const currentCourse = COURSES.find(c => c.id === currentLanguage) || COURSES[0];

  const handleLessonComplete = () => {
    if (activeLessonUnit) {
      completeLesson(activeLessonUnit);
      setActiveLessonUnit(null);
    }
  };

  const handleBuy = () => {
    if (shopItemToBuy && stats.gems >= shopItemToBuy.cost) {
      addGems(-shopItemToBuy.cost);
      setShopItemToBuy(null);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 }
      });
    }
  };

  if (showSplash) {
    return (
      <div className="fixed inset-0 bg-white z-[100] flex flex-col items-center justify-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 12 }}
          className="relative"
        >
          <div className="w-32 h-32 bg-green-500 rounded-[2rem] flex items-center justify-center shadow-2xl">
            <Globe className="w-16 h-16 text-white" />
          </div>
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute -top-4 -right-4 bg-yellow-400 p-2 rounded-full shadow-lg"
          >
            <Star className="w-6 h-6 text-white fill-current" />
          </motion.div>
        </motion.div>
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-4xl font-black text-green-600 tracking-tighter"
        >
          Dualingo
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-2 text-gray-400 font-medium"
        >
          Learning made fun.
        </motion.p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F0F0] flex items-center justify-center p-0 sm:p-4 md:p-8 font-sans">
      {/* Mobile Device Frame */}
      <div className="w-full h-screen sm:h-[844px] sm:max-w-[390px] bg-white sm:rounded-[3rem] sm:shadow-2xl sm:border-[12px] sm:border-gray-900 relative flex flex-col overflow-hidden">
        
        {/* Status Bar (Simulated) */}
        <div className="h-12 bg-white flex items-center justify-between px-8 pt-4 shrink-0">
          <span className="text-sm font-black">9:41</span>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-2 bg-text rounded-[1px]" />
            <div className="w-3 h-3 bg-text rounded-full" />
          </div>
        </div>

        {/* App Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          <GamificationHeader stats={stats} onToggleOffline={toggleOffline} />

          {/* Shop Confirmation Modal */}
          <AnimatePresence>
            {shopItemToBuy && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/50 z-[60] flex items-center justify-center p-6"
              >
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-white rounded-3xl p-8 w-full text-center space-y-6 shadow-duo-white"
                >
                  <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mx-auto">
                    <Gem className="w-10 h-10 text-secondary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-text">Confirm Purchase</h3>
                    <p className="text-text-light font-bold">Are you sure you want to buy <b>{shopItemToBuy.name}</b> for <b>{shopItemToBuy.cost} gems</b>?</p>
                  </div>
                  <div className="flex flex-col gap-3">
                    <button 
                      onClick={handleBuy}
                      disabled={stats.gems < shopItemToBuy.cost}
                      className="w-full py-3 bg-secondary text-white font-black rounded-xl shadow-duo-secondary active:shadow-none active:translate-y-1 disabled:bg-gray-300 disabled:shadow-none disabled:translate-y-0"
                    >
                      {stats.gems < shopItemToBuy.cost ? "NOT ENOUGH GEMS" : "CONFIRM"}
                    </button>
                    <button 
                      onClick={() => setShopItemToBuy(null)}
                      className="w-full py-3 text-text-light font-black hover:bg-gray-50 rounded-xl transition-colors"
                    >
                      CANCEL
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <main className="flex-1 overflow-y-auto px-4 pt-1 pb-24 scrollbar-hide">
            <AnimatePresence mode="wait">
              {activeTab === 'home' && (
                <motion.div
                  key="home"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  {/* Course Selector */}
                  <div className="flex items-center justify-between bg-white p-4 rounded-2xl border-2 border-border shadow-duo-white">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{currentCourse.flag}</span>
                      <div>
                        <h3 className="font-bold">{currentCourse.name}</h3>
                        <p className="text-xs text-text-light">Learning path</p>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                      <Globe className="w-5 h-5 text-text-light" />
                    </button>
                  </div>

                  {/* Unit Card */}
                  <div className="bg-primary p-6 rounded-2xl text-white shadow-duo-primary">
                    <h2 className="text-xl font-black">Unit 1: Basics</h2>
                    <p className="text-sm opacity-90 mt-1">Order in a cafe, introduce yourself</p>
                  </div>

                  {/* Learning Path */}
                  <div className="flex flex-col items-center gap-10 relative py-4">
                    <div className="absolute top-0 bottom-0 w-3 bg-border left-1/2 -translate-x-1/2 -z-10" />

                    {currentCourse.units[0].lessons.map((lesson, index) => {
                      const isCompleted = completedLessons.includes(lesson.id);
                      const isAvailable = index === 0 || completedLessons.includes(currentCourse.units[0].lessons[index-1].id);

                      return (
                        <div key={lesson.id} className="flex flex-col items-center gap-4 w-full">
                          <motion.button
                            whileHover={isAvailable ? { scale: 1.05 } : {}}
                            whileTap={isAvailable ? { scale: 0.95 } : {}}
                            onClick={() => isAvailable && setActiveLessonUnit(currentCourse.units[0].id)}
                            className={cn(
                              "w-20 h-20 rounded-full flex items-center justify-center border-[6px] transition-all relative",
                              isCompleted 
                                ? "bg-primary border-[#A5ED6E] text-white shadow-duo-primary" 
                                : isAvailable 
                                  ? "bg-secondary border-[#84D8FF] text-white shadow-duo-secondary" 
                                  : "bg-white border-border text-text-light shadow-duo-gray"
                            )}
                          >
                            <span className="text-2xl font-black">
                              {isCompleted ? "✓" : isAvailable ? "★" : "?"}
                            </span>
                            
                            <div className={cn(
                              "absolute -bottom-6 font-black text-[10px] uppercase tracking-widest whitespace-nowrap bg-white/80 px-2 rounded-full",
                              isAvailable ? "text-secondary" : "text-text-light"
                            )}>
                              {lesson.title}
                            </div>
                          </motion.button>
                        </div>
                      );
                    })}

                    <div className="flex flex-col items-center gap-4 w-full mt-4">
                      <div className="w-20 h-20 rounded-full flex items-center justify-center bg-[#FFD900] border-[6px] border-accent text-white shadow-duo-accent relative">
                        <span className="text-2xl">🏆</span>
                        <div className="absolute -bottom-6 font-black text-[10px] uppercase tracking-widest text-accent whitespace-nowrap bg-white/80 px-2 rounded-full">
                          Checkpoint
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'leaderboard' && (
                <motion.div
                  key="leaderboard"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div className="text-center space-y-2">
                    <Trophy className="w-16 h-16 text-accent mx-auto" />
                    <h2 className="text-2xl font-black">Bronze League</h2>
                    <p className="text-text-light font-bold">Top 10 advance to Silver League</p>
                  </div>

                  <div className="bg-white rounded-2xl border-2 border-border overflow-hidden">
                    {[
                      { name: 'Senior Abdalla', xp: stats.xp, rank: 1, isUser: true, color: '#1CB0F6' },
                      { name: 'Saadiee', xp: 480, rank: 2, color: '#C0C0C0' },
                      { name: 'Abdulrahman', xp: 450, rank: 3, color: '#CD7F32' },
                      { name: 'Paul', xp: 390, rank: 4, color: '#58CC02' },
                      { name: 'Anas', xp: 310, rank: 5, color: '#FFC800' },
                      { name: 'Rashid', xp: 250, rank: 6, color: '#CE82FF' },
                    ].map((user) => (
                      <div 
                        key={user.name} 
                        className={cn(
                          "flex items-center justify-between p-4 border-b border-border last:border-0",
                          user.isUser && "bg-[#E5F7FF]"
                        )}
                      >
                        <div className="flex items-center gap-4">
                          <span className="font-black text-text-light w-6">{user.rank}</span>
                          <div 
                            className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white"
                            style={{ backgroundColor: user.color }}
                          >
                            {user.name[0]}
                          </div>
                          <span className="font-bold">{user.name}</span>
                        </div>
                        <span className="text-text-light font-black">{user.xp} XP</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'profile' && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center text-3xl border-4 border-white shadow-duo-white">
                      👤
                    </div>
                    <div>
                      <h2 className="text-xl font-black">Senior Abdalla</h2>
                      <p className="text-text-light font-bold text-sm">Joined April 2026</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white rounded-2xl border-2 border-border shadow-duo-white">
                      <p className="text-[10px] text-text-light uppercase font-black mb-1">Total XP</p>
                      <p className="text-lg font-black">{stats.xp}</p>
                    </div>
                    <div className="p-4 bg-white rounded-2xl border-2 border-border shadow-duo-white">
                      <p className="text-[10px] text-text-light uppercase font-black mb-1">Streak</p>
                      <p className="text-lg font-black">{stats.streak} d</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-black text-lg">Settings</h3>
                    <div className="space-y-3">
                      <button className="w-full flex items-center justify-between p-4 bg-white border-2 border-border rounded-2xl hover:bg-gray-50 transition-colors shadow-duo-white">
                        <div className="flex items-center gap-3">
                          <Settings className="w-5 h-5 text-text-light" />
                          <span className="font-bold">Account</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-border" />
                      </button>
                      <button className="w-full flex items-center justify-between p-4 bg-white border-2 border-border rounded-2xl hover:bg-gray-50 transition-colors shadow-duo-white">
                        <div className="flex items-center gap-3">
                          <Globe className="w-5 h-5 text-text-light" />
                          <span className="font-bold">Language</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-border" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'shop' && (
                <motion.div
                  key="shop"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div className="bg-gradient-to-br from-secondary to-blue-600 p-6 rounded-3xl text-white shadow-duo-secondary">
                    <h2 className="text-xl font-black mb-2">Plus</h2>
                    <p className="text-blue-100 text-xs mb-6 font-medium">Unlimited hearts & no ads.</p>
                    <button className="w-full py-3 bg-white text-secondary font-black rounded-xl shadow-duo-white active:translate-y-1 active:shadow-none transition-all">
                      FREE TRIAL
                    </button>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-black text-lg">Power-Ups</h3>
                    <div className="grid grid-cols-1 gap-4">
                      {[
                        { name: 'Streak Shield', desc: 'Protects for 1 day', cost: 200, icon: <Flame className="text-orange-500" /> },
                        { name: 'Heart Refill', desc: 'Full health', cost: 450, icon: <Heart className="text-red-500 fill-current" /> },
                        { name: 'XP Boost', desc: 'Double XP (15m)', cost: 100, icon: <Zap className="text-blue-500" /> },
                      ].map((item) => (
                        <button 
                          key={item.name}
                          onClick={() => setShopItemToBuy(item)}
                          className="flex items-center justify-between p-4 bg-white border-2 border-border rounded-2xl hover:bg-gray-50 transition-colors text-left shadow-duo-white"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-bg flex items-center justify-center">
                              {item.icon}
                            </div>
                            <div>
                              <h4 className="font-black text-sm">{item.name}</h4>
                              <p className="text-[10px] text-text-light font-bold">{item.desc}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-secondary font-black text-sm">
                            <Gem className="w-4 h-4" />
                            <span>{item.cost}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </main>

          {/* Bottom Navigation */}
          <nav className="absolute bottom-0 left-0 right-0 bg-white border-t-2 border-border px-6 py-4 flex items-center justify-between z-40">
            {[
              { id: 'home', label: 'Home', icon: <Home /> },
              { id: 'leaderboard', label: 'Rank', icon: <Trophy /> },
              { id: 'shop', label: 'Shop', icon: <ShoppingBag /> },
              { id: 'profile', label: 'Profile', icon: <User /> },
            ].map((item) => (
              <button 
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={cn(
                  "flex flex-col items-center gap-1 transition-colors",
                  activeTab === item.id ? "text-primary" : "text-text-light"
                )}
              >
                {React.cloneElement(item.icon as React.ReactElement, { className: "w-6 h-6" })}
                <span className="text-[10px] font-black uppercase tracking-tighter">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Home Indicator (Simulated) */}
        <div className="h-8 bg-white flex justify-center items-end pb-2 shrink-0">
          <div className="w-32 h-1.5 bg-gray-200 rounded-full" />
        </div>

        {/* Lesson Overlay */}
        <AnimatePresence>
          {activeLessonUnit && (
            <div className="absolute inset-0 z-[100]">
              <LessonView 
                lessons={currentCourse.units.find(u => u.id === activeLessonUnit)?.lessons || []}
                language={currentCourse.name}
                isOffline={stats.isOffline}
                onComplete={handleLessonComplete}
                onClose={() => setActiveLessonUnit(null)}
                onHeartLost={useHeart}
              />
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
