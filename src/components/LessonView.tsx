import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, Info, ChevronRight, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';
import { Lesson } from '../types';
import { cn } from '../lib/utils';
import { getExplanation, getLessonTip } from '../services/geminiService';
import confetti from 'canvas-confetti';

interface LessonViewProps {
  lessons: Lesson[];
  language: string;
  isOffline: boolean;
  onComplete: () => void;
  onClose: () => void;
  onHeartLost: () => void;
}

export const LessonView: React.FC<LessonViewProps> = ({
  lessons,
  language,
  isOffline,
  onComplete,
  onClose,
  onHeartLost
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);

  const currentLesson = lessons[currentIndex];
  const progress = ((currentIndex) / lessons.length) * 100;

  const handleCheck = async () => {
    const isCorrect = currentLesson.type === 'multiple-choice' 
      ? selectedOption === currentLesson.correctAnswer
      : inputValue.toLowerCase().trim() === currentLesson.correctAnswer.toLowerCase().trim();

    if (isCorrect) {
      setStatus('correct');
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#58CC02', '#FFC800', '#CE82FF']
      });
    } else {
      setStatus('incorrect');
      onHeartLost();
      if (!isOffline) {
        setIsExplaining(true);
        const expl = await getExplanation(
          currentLesson.question,
          currentLesson.type === 'multiple-choice' ? (selectedOption || '') : inputValue,
          currentLesson.correctAnswer,
          language
        );
        setExplanation(expl);
        setIsExplaining(false);
      }
    }
  };

  const handleNext = () => {
    if (currentIndex < lessons.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setInputValue('');
      setSelectedOption(null);
      setStatus('idle');
      setExplanation(null);
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col font-sans">
      {/* Header */}
      <div className="p-4 flex items-center gap-4 border-b-2 border-border">
        <button 
          onClick={() => setShowQuitConfirm(true)}
          className="p-2 hover:bg-bg rounded-full transition-colors"
        >
          <X className="w-6 h-6 text-text-light" />
        </button>
        
        <div className="flex-1 h-4 bg-border rounded-full overflow-hidden relative">
          <motion.div 
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-text-light uppercase">
            {currentIndex + 1} of {lessons.length}
          </div>
        </div>

        <div className="flex items-center gap-1 text-red-500 font-black">
          <Heart className="w-5 h-5 fill-current" />
          <span>5</span>
        </div>

        <button 
          onClick={async () => {
            setIsExplaining(true);
            const tip = await getLessonTip(currentLesson.title, language);
            setExplanation(tip);
            setStatus('incorrect'); // Reuse the explanation area
            setIsExplaining(false);
          }}
          className="p-2 hover:bg-blue-50 rounded-full transition-colors text-secondary"
          title="Get a tip"
        >
          <HelpCircle className="w-6 h-6" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto max-w-2xl mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-text">
                {currentLesson.type === 'translation' ? 'Translate this sentence' : 'Select the correct meaning'}
              </h2>
              {currentLesson.context && (
                <div className="flex items-center gap-2 text-sm text-secondary bg-blue-50 p-3 rounded-xl border-2 border-blue-100 font-bold">
                  <Info className="w-4 h-4" />
                  <span>Tip: {currentLesson.context}</span>
                </div>
              )}
            </div>

            <div className="p-8 bg-bg rounded-2xl border-2 border-border text-xl font-bold text-center shadow-duo-white">
              {currentLesson.question}
            </div>

            {currentLesson.type === 'multiple-choice' ? (
              <div className="grid grid-cols-1 gap-4">
                {currentLesson.options?.map((option) => (
                  <button
                    key={option}
                    onClick={() => status === 'idle' && setSelectedOption(option)}
                    className={cn(
                      "p-4 rounded-xl border-2 text-left transition-all font-bold shadow-duo-white",
                      selectedOption === option 
                        ? "border-secondary bg-blue-50 text-secondary shadow-duo-secondary" 
                        : "border-border hover:bg-gray-50 text-text",
                      status !== 'idle' && "cursor-default"
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>
            ) : (
              <textarea
                value={inputValue}
                onChange={(e) => status === 'idle' && setInputValue(e.target.value)}
                placeholder="Type your answer here..."
                className="w-full p-4 rounded-xl border-2 border-border focus:border-secondary focus:ring-0 outline-none min-h-[120px] text-lg transition-all font-bold bg-bg shadow-duo-white"
                disabled={status !== 'idle'}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer / Feedback */}
      <div className={cn(
        "p-6 border-t-2 transition-colors duration-300",
        status === 'correct' ? "bg-[#EDFFDF] border-primary" : 
        status === 'incorrect' ? "bg-red-50 border-red-200" : "bg-white border-border"
      )}>
        <div className="max-w-2xl mx-auto flex flex-col gap-4">
          {status === 'idle' ? (
            <div className="flex justify-between items-center">
              <button 
                onClick={() => handleNext()} // Skip functionality
                className="text-text-light font-black hover:text-text transition-colors uppercase tracking-widest text-xs"
              >
                Skip
              </button>
              <button
                disabled={currentLesson.type === 'multiple-choice' ? !selectedOption : !inputValue}
                onClick={handleCheck}
                className="px-12 py-3 bg-primary text-white font-black rounded-xl shadow-duo-primary active:shadow-none active:translate-y-1 transition-all disabled:bg-border disabled:shadow-none disabled:translate-y-0 uppercase tracking-widest"
              >
                Check
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                {status === 'correct' ? (
                  <CheckCircle2 className="w-8 h-8 text-primary" />
                ) : (
                  <AlertCircle className="w-8 h-8 text-red-600" />
                )}
                <div className="flex-1">
                  <h3 className={cn(
                    "font-black text-lg uppercase tracking-tight",
                    status === 'correct' ? "text-primary-dark" : "text-red-700"
                  )}>
                    {status === 'correct' ? 'Excellent!' : 'Correct solution:'}
                  </h3>
                  {status === 'incorrect' && (
                    <p className="text-red-600 font-bold">{currentLesson.correctAnswer}</p>
                  )}
                </div>
              </div>

              {status === 'incorrect' && (
                <div className="bg-white/50 p-4 rounded-xl text-sm text-text font-bold italic border-2 border-red-100">
                  {isExplaining ? (
                    <div className="flex items-center gap-2 animate-pulse">
                      <HelpCircle className="w-4 h-4" />
                      <span>Tutor is thinking...</span>
                    </div>
                  ) : (
                    explanation || "Practice makes perfect!"
                  )}
                </div>
              )}

              <button
                onClick={handleNext}
                className={cn(
                  "w-full py-4 text-white font-black rounded-xl shadow-lg transition-all active:translate-y-1 active:shadow-none uppercase tracking-widest",
                  status === 'correct' ? "bg-primary shadow-duo-primary" : "bg-red-500 shadow-[0_4px_0_rgb(185,28,28)]"
                )}
              >
                Continue
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quit Confirmation */}
      <AnimatePresence>
        {showQuitConfirm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full text-center space-y-6 shadow-duo-white"
            >
              <h3 className="text-2xl font-black text-text">Wait, don't go!</h3>
              <p className="text-text-light font-bold">You're doing great. If you quit now, you'll lose your progress in this lesson.</p>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => setShowQuitConfirm(false)}
                  className="w-full py-3 bg-secondary text-white font-black rounded-xl shadow-duo-secondary active:shadow-none active:translate-y-1 uppercase tracking-widest"
                >
                  Keep Learning
                </button>
                <button 
                  onClick={onClose}
                  className="w-full py-3 text-red-500 font-black hover:bg-red-50 rounded-xl transition-colors uppercase tracking-widest"
                >
                  Quit Lesson
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
