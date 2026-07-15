"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, ChevronRight, RotateCcw, Trophy, Lock, Unlock } from "lucide-react";
import type { MCQuestion } from "@/lib/mcq-parser";

interface Props {
  questions: MCQuestion[];
  topicId: string;
  chapterId: string;
  alreadyPassed: boolean;
  previousScore?: number | null;
  accentColor?: string;
  onComplete: (score: number, total: number, passed: boolean) => void;
}

export default function MCQSection({
  questions,
  topicId,
  alreadyPassed,
  previousScore,
  accentColor = "#00E5FF",
  onComplete,
}: Props) {
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0);

  const total = questions.length;
  const passThreshold = Math.ceil(total * 0.9);
  const currentQ = questions[current];

  const handleSelect = (letter: string) => {
    if (revealed) return;
    setSelected(letter);
  };

  const handleReveal = () => {
    if (!selected) return;
    setRevealed(true);
    setAnswers((prev) => ({ ...prev, [current]: selected }));
  };

  const handleNext = () => {
    if (current + 1 >= total) {
      // Finish
      const finalScore = Object.entries({ ...answers, [current]: selected! }).filter(
        ([i, ans]) => questions[parseInt(i)].correctAnswer === ans
      ).length;
      setScore(finalScore);
      setFinished(true);
      const passed = finalScore >= passThreshold;
      onComplete(finalScore, total, passed);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setRevealed(false);
    }
  };

  const handleRestart = () => {
    setCurrent(0);
    setSelected(null);
    setRevealed(false);
    setAnswers({});
    setFinished(false);
    setScore(0);
    setStarted(true);
  };

  if (!started) {
    return (
      <MCQIntro
        total={total}
        passThreshold={passThreshold}
        alreadyPassed={alreadyPassed}
        previousScore={previousScore}
        accentColor={accentColor}
        topicId={topicId}
        onStart={() => setStarted(true)}
      />
    );
  }

  if (finished) {
    const passed = score >= passThreshold;
    return (
      <MCQResult
        score={score}
        total={total}
        passed={passed}
        passThreshold={passThreshold}
        accentColor={accentColor}
        onRestart={handleRestart}
      />
    );
  }

  if (!currentQ) return null;

  const isCorrect = revealed && selected === currentQ.correctAnswer;
  const isWrong = revealed && selected !== currentQ.correctAnswer;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      {/* Progress */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-white/40 font-mono">
          Q{current + 1} / {total}
        </span>
        <div className="flex gap-1">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 w-6 rounded-full transition-all ${
                i < current
                  ? answers[i] === questions[i].correctAnswer
                    ? "bg-accent-green"
                    : "bg-accent-red"
                  : i === current
                  ? "bg-accent-cyan"
                  : "bg-white/10"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="glass rounded-xl p-5 border border-white/8"
        >
          <p className="text-white font-medium leading-relaxed mb-5 text-sm md:text-base">
            <span
              className="font-mono text-xs font-bold mr-2 px-1.5 py-0.5 rounded"
              style={{ color: accentColor, background: `${accentColor}15` }}
            >
              Q{currentQ.id}
            </span>
            {currentQ.question}
          </p>

          <div className="space-y-2.5">
            {currentQ.options.map((opt) => {
              const isThisCorrect = revealed && opt.letter === currentQ.correctAnswer;
              const isThisWrong = revealed && opt.letter === selected && selected !== currentQ.correctAnswer;
              const isSelected = selected === opt.letter && !revealed;

              return (
                <motion.button
                  key={opt.letter}
                  onClick={() => handleSelect(opt.letter)}
                  whileHover={!revealed ? { scale: 1.01 } : {}}
                  whileTap={!revealed ? { scale: 0.99 } : {}}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-all duration-200 flex items-start gap-3 ${
                    isThisCorrect
                      ? "bg-accent-green/15 border border-accent-green/50 text-white"
                      : isThisWrong
                      ? "bg-accent-red/15 border border-accent-red/50 text-white"
                      : isSelected
                      ? "border text-white"
                      : "glass border border-white/8 text-white/70 hover:border-white/20 hover:text-white"
                  }`}
                  style={
                    isSelected
                      ? { borderColor: accentColor, background: `${accentColor}10` }
                      : {}
                  }
                >
                  <span
                    className="font-mono font-bold text-xs shrink-0 mt-0.5 w-5 h-5 flex items-center justify-center rounded"
                    style={
                      isThisCorrect
                        ? { color: "#00FF95", background: "#00FF9520" }
                        : isThisWrong
                        ? { color: "#FF3B5C", background: "#FF3B5C20" }
                        : isSelected
                        ? { color: accentColor, background: `${accentColor}20` }
                        : { color: accentColor, background: `${accentColor}15` }
                    }
                  >
                    {opt.letter}
                  </span>
                  <span className="leading-relaxed">{opt.text}</span>
                  {isThisCorrect && <CheckCircle size={16} className="text-accent-green shrink-0 ml-auto mt-0.5" />}
                  {isThisWrong && <XCircle size={16} className="text-accent-red shrink-0 ml-auto mt-0.5" />}
                </motion.button>
              );
            })}
          </div>

          {/* Explanation */}
          <AnimatePresence>
            {revealed && currentQ.explanation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-4 px-4 py-3 rounded-lg border-l-2 border-accent-cyan/50 bg-accent-cyan/5 text-sm text-white/70"
              >
                <span className="text-accent-cyan font-semibold text-xs block mb-1">💡 Explanation</span>
                {currentQ.explanation}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      {/* Action buttons */}
      <div className="flex justify-end gap-3">
        {!revealed ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleReveal}
            disabled={!selected}
            className={`px-5 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2 transition-all ${
              selected
                ? "text-bg-primary"
                : "bg-white/10 text-white/30 cursor-not-allowed"
            }`}
            style={selected ? { background: accentColor } : {}}
          >
            Check Answer
          </motion.button>
        ) : (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleNext}
            className="px-5 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2 text-bg-primary"
            style={{ background: accentColor }}
          >
            {current + 1 >= total ? "See Results" : "Next"}
            <ChevronRight size={16} />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

function MCQIntro({
  total,
  passThreshold,
  alreadyPassed,
  previousScore,
  accentColor,
  topicId,
  onStart,
}: {
  total: number;
  passThreshold: number;
  alreadyPassed: boolean;
  previousScore?: number | null;
  accentColor: string;
  topicId: string;
  onStart: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-xl p-6 border border-white/8 text-center space-y-4"
    >
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center mx-auto"
        style={{ background: `${accentColor}15` }}
      >
        {alreadyPassed ? (
          <CheckCircle size={26} style={{ color: "#00FF95" }} />
        ) : (
          <span className="text-2xl">🧠</span>
        )}
      </div>
      <div>
        <h3 className="text-white font-bold text-lg">MCQ Set — Topic {topicId}</h3>
        <p className="text-white/50 text-sm mt-1">
          {total} questions · Pass with {passThreshold}/{total} correct (90%+)
        </p>
        {alreadyPassed && previousScore !== null && previousScore !== undefined && (
          <p className="text-accent-green text-sm font-semibold mt-2">
            ✅ Previously scored {previousScore}/{total}
          </p>
        )}
      </div>
      {alreadyPassed ? (
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-green/10 border border-accent-green/30 text-accent-green text-sm font-semibold">
            <Unlock size={15} />
            Next Topic Unlocked
          </div>
          <button
            onClick={onStart}
            className="px-4 py-2 rounded-lg border border-white/15 text-white/60 hover:text-white text-sm transition-all hover:border-white/30"
          >
            <RotateCcw size={14} className="inline mr-1.5" />
            Retry for Better Score
          </button>
        </div>
      ) : (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onStart}
          className="px-8 py-2.5 rounded-lg font-bold text-sm text-bg-primary inline-flex items-center gap-2"
          style={{ background: accentColor, boxShadow: `0 0 20px ${accentColor}40` }}
        >
          Start MCQ
          <ChevronRight size={16} />
        </motion.button>
      )}
    </motion.div>
  );
}

function MCQResult({
  score,
  total,
  passed,
  passThreshold,
  accentColor,
  onRestart,
}: {
  score: number;
  total: number;
  passed: boolean;
  passThreshold: number;
  accentColor: string;
  onRestart: () => void;
}) {
  const percent = Math.round((score / total) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`glass rounded-xl p-8 border text-center space-y-5 ${
        passed ? "border-accent-green/30" : "border-accent-red/30"
      }`}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.1 }}
        className="text-5xl"
      >
        {passed ? "🎉" : "😤"}
      </motion.div>

      <div>
        <h3
          className={`text-2xl font-bold ${passed ? "text-accent-green" : "text-accent-red"}`}
        >
          {passed ? "Sahi Hai! Pass!" : "Aur Koshish Karo"}
        </h3>
        <p className="text-white/50 text-sm mt-1">
          {passed
            ? "Next topic unlock ho gaya!"
            : `${passThreshold}/${total} chahiye tha — ${score}/${total} mila.`}
        </p>
      </div>

      {/* Score ring */}
      <div className="flex justify-center">
        <div className="relative w-28 h-28">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
            <motion.circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke={passed ? "#00FF95" : "#FF3B5C"}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 42}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - percent / 100) }}
              transition={{ duration: 1, delay: 0.3 }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-2xl font-bold ${passed ? "text-accent-green" : "text-accent-red"}`}>
              {percent}%
            </span>
            <span className="text-white/40 text-xs">{score}/{total}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-3">
        {passed && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-green/10 border border-accent-green/30 text-accent-green text-sm font-semibold">
            <Unlock size={14} />
            Next Topic Unlocked!
          </div>
        )}
        <button
          onClick={onRestart}
          className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-all ${
            passed
              ? "border border-white/15 text-white/60 hover:text-white"
              : "text-bg-primary font-bold"
          }`}
          style={!passed ? { background: accentColor } : {}}
        >
          <RotateCcw size={14} />
          {passed ? "Retry" : "Try Again"}
        </button>
      </div>
    </motion.div>
  );
}
