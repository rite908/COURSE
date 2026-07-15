"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, ChevronRight, RotateCcw, Trophy, Unlock, Clock } from "lucide-react";
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
  accentColor = "#2563EB",
  onComplete,
}: Props) {
  const [started,  setStarted]  = useState(false);
  const [current,  setCurrent]  = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [answers,  setAnswers]  = useState<Record<number, string>>({});
  const [finished, setFinished] = useState(false);
  const [score,    setScore]    = useState(0);
  const [timer,    setTimer]    = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const total         = questions.length;
  const passThreshold = Math.ceil(total * 0.9); // 90%

  // Timer
  useEffect(() => {
    if (started && !finished) {
      timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [started, finished]);

  const formatTimer = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

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
    const allAnswers = { ...answers, [current]: selected! };
    if (current + 1 >= total) {
      const finalScore = Object.entries(allAnswers).filter(
        ([i, ans]) => questions[parseInt(i)].correctAnswer === ans
      ).length;
      setScore(finalScore);
      setFinished(true);
      if (timerRef.current) clearInterval(timerRef.current);
      onComplete(finalScore, total, finalScore >= passThreshold);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setRevealed(false);
    }
  };

  const handleSkip = () => {
    if (current + 1 >= total) {
      handleNext();
    } else {
      setAnswers((prev) => ({ ...prev, [current]: "" }));
      setCurrent((c) => c + 1);
      setSelected(null);
      setRevealed(false);
    }
  };

  const handleRestart = () => {
    setCurrent(0); setSelected(null); setRevealed(false);
    setAnswers({}); setFinished(false); setScore(0); setTimer(0);
    setStarted(true);
  };

  if (!started) {
    return (
      <MCQIntro
        total={total} passThreshold={passThreshold}
        alreadyPassed={alreadyPassed} previousScore={previousScore}
        accentColor={accentColor} topicId={topicId}
        onStart={() => setStarted(true)}
      />
    );
  }

  if (finished) {
    const passed = score >= passThreshold;
    return (
      <MCQResult
        score={score} total={total} passed={passed}
        passThreshold={passThreshold} accentColor={accentColor}
        timeTaken={timer} answers={answers} questions={questions}
        onRestart={handleRestart}
      />
    );
  }

  const currentQ   = questions[current];
  if (!currentQ) return null;
  const progressPct = (current / total) * 100;

  return (
    <div className="space-y-5">
      {/* Header row: counter + timer */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-bold text-gray-900">Question {current + 1} of {total}</div>
          <div className="flex gap-1 mt-2">
            {questions.map((_, i) => (
              <div
                key={i}
                className="h-1 rounded-full transition-all"
                style={{
                  width: 28,
                  background: i < current
                    ? (answers[i] === questions[i].correctAnswer ? "#10B981" : "#EF4444")
                    : i === current
                    ? accentColor
                    : "#E2E8F0",
                }}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-200">
          <Clock size={13} className="text-gray-400" />
          <span className="font-mono text-sm font-bold text-gray-600">{formatTimer(timer)}</span>
        </div>
      </div>

      {/* Question card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.22 }}
          className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm"
        >
          {/* Progress bar */}
          <div className="h-1 bg-gray-100">
            <motion.div
              className="h-full"
              style={{ background: accentColor }}
              initial={{ width: `${progressPct}%` }}
              animate={{ width: `${((current + 1) / total) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>

          <div className="p-6">
            {/* Question */}
            <p className="text-gray-900 font-semibold leading-relaxed mb-6 text-base">
              <span
                className="inline-block font-bold text-xs mr-2 px-2 py-0.5 rounded-lg font-mono"
                style={{ color: accentColor, background: `${accentColor}12` }}
              >
                Q{current + 1}
              </span>
              {currentQ.question}
            </p>

            {/* Options */}
            <div className="space-y-3">
              {currentQ.options.map((opt) => {
                const isCorrect  = revealed && opt.letter === currentQ.correctAnswer;
                const isWrong    = revealed && opt.letter === selected && selected !== currentQ.correctAnswer;
                const isSelected = selected === opt.letter && !revealed;

                return (
                  <motion.button
                    key={opt.letter}
                    onClick={() => handleSelect(opt.letter)}
                    whileHover={!revealed ? { scale: 1.01 } : {}}
                    whileTap={!revealed ? { scale: 0.99 } : {}}
                    className="w-full text-left px-4 py-3.5 rounded-xl text-sm transition-all duration-200 flex items-center gap-3 border"
                    style={
                      isCorrect
                        ? { background: "#ECFDF5", borderColor: "#6EE7B7", color: "#064E3B" }
                        : isWrong
                        ? { background: "#FEF2F2", borderColor: "#FCA5A5", color: "#7F1D1D" }
                        : isSelected
                        ? { background: `${accentColor}08`, borderColor: accentColor, color: "#0A0F1E" }
                        : { background: "#FAFAFA", borderColor: "#E2E8F0", color: "#374151" }
                    }
                  >
                    {/* Letter badge */}
                    <span
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                      style={
                        isCorrect
                          ? { background: "#D1FAE5", color: "#059669" }
                          : isWrong
                          ? { background: "#FEE2E2", color: "#DC2626" }
                          : isSelected
                          ? { background: accentColor, color: "#FFFFFF" }
                          : { background: "#F1F5F9", color: "#64748B" }
                      }
                    >
                      {opt.letter}
                    </span>

                    <span className="flex-1 leading-snug">{opt.text}</span>

                    {isCorrect && <CheckCircle size={16} className="text-green-500 shrink-0" />}
                    {isWrong   && <XCircle    size={16} className="text-red-400  shrink-0" />}
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
                  className="mt-4 px-4 py-3 rounded-xl border-l-4 bg-blue-50 text-sm text-blue-800"
                  style={{ borderColor: accentColor }}
                >
                  <span className="font-bold text-xs block mb-1" style={{ color: accentColor }}>💡 Explanation</span>
                  {currentQ.explanation}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Actions */}
      <div className="flex items-center justify-between">
        {!revealed ? (
          <>
            <button
              onClick={handleSkip}
              className="px-5 py-2.5 rounded-xl text-sm text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all font-medium"
            >
              Skip
            </button>
            <motion.button
              whileHover={selected ? { scale: 1.03 } : {}}
              whileTap={selected ? { scale: 0.97 } : {}}
              onClick={handleReveal}
              disabled={!selected}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all"
              style={
                selected
                  ? { background: accentColor, color: "#FFFFFF", boxShadow: `0 4px 16px ${accentColor}30` }
                  : { background: "#F1F5F9", color: "#94A3B8", cursor: "not-allowed" }
              }
            >
              Check Answer
            </motion.button>
          </>
        ) : (
          <div className="flex justify-end w-full">
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white"
              style={{ background: accentColor, boxShadow: `0 4px 16px ${accentColor}30` }}
            >
              {current + 1 >= total ? "See Results" : "Next Question"}
              <ChevronRight size={15} />
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Intro Card ── */
function MCQIntro({ total, passThreshold, alreadyPassed, previousScore, accentColor, topicId, onStart }: {
  total: number; passThreshold: number; alreadyPassed: boolean;
  previousScore?: number | null; accentColor: string;
  topicId: string; onStart: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm text-center"
    >
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
        style={{ background: alreadyPassed ? "#ECFDF5" : `${accentColor}10` }}
      >
        {alreadyPassed
          ? <CheckCircle size={28} className="text-green-500" />
          : <span className="text-3xl">🧠</span>}
      </div>

      <h3 className="font-bold text-gray-900 text-xl mb-1.5">MCQ Set — Topic {topicId}</h3>
      <p className="text-gray-400 text-sm mb-2">
        {total} questions · Need {passThreshold}/{total} to pass (90%+)
      </p>

      {alreadyPassed && previousScore != null && (
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-green-50 text-green-600 text-sm font-semibold mb-4 border border-green-100">
          <CheckCircle size={13} /> Previously scored {previousScore}/{total}
        </div>
      )}

      {alreadyPassed ? (
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-50 border border-green-100 text-green-600 text-sm font-semibold">
            <Unlock size={14} /> Next Topic Unlocked
          </div>
          <button
            onClick={onStart}
            className="px-4 py-2 rounded-xl border border-gray-200 text-gray-500 hover:text-gray-700 text-sm transition-all hover:bg-gray-50"
          >
            <RotateCcw size={13} className="inline mr-1.5" />
            Retry for Better Score
          </button>
        </div>
      ) : (
        <motion.button
          whileHover={{ scale: 1.03, boxShadow: `0 8px 24px ${accentColor}30` }}
          whileTap={{ scale: 0.97 }}
          onClick={onStart}
          className="mt-4 px-10 py-3 rounded-xl font-bold text-sm text-white inline-flex items-center gap-2"
          style={{ background: accentColor }}
        >
          Start MCQ
          <ChevronRight size={15} />
        </motion.button>
      )}
    </motion.div>
  );
}

/* ── Result Screen ── */
function MCQResult({ score, total, passed, passThreshold, accentColor, timeTaken, answers, questions, onRestart }: {
  score: number; total: number; passed: boolean; passThreshold: number;
  accentColor: string; timeTaken: number;
  answers: Record<number, string>; questions: MCQuestion[];
  onRestart: () => void;
}) {
  const percent  = Math.round((score / total) * 100);
  const correct  = score;
  const wrong    = Object.values(answers).filter((ans, i) => questions[i] && answers[i] !== questions[i].correctAnswer).length;
  const circumference = 2 * Math.PI * 42;
  const formatTime = (s: number) => `${Math.floor(s/60).toString().padStart(2,"0")}:${(s%60).toString().padStart(2,"0")}`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
    >
      {/* Top color strip */}
      <div className="h-1.5" style={{ background: passed ? "linear-gradient(90deg,#10B981,#34D399)" : "linear-gradient(90deg,#EF4444,#F87171)" }} />

      <div className="p-8 text-center">
        {/* Score ring */}
        <div className="flex justify-center mb-6">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="#F1F5F9" strokeWidth="8" />
              <motion.circle
                cx="50" cy="50" r="42" fill="none"
                stroke={passed ? "#10B981" : "#EF4444"}
                strokeWidth="8" strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: circumference * (1 - percent / 100) }}
                transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-3xl font-black ${passed ? "text-green-600" : "text-red-500"}`}>
                {score}/{total}
              </span>
              <span className="text-xs text-gray-400 font-medium">{percent}%</span>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.3 }}
          className="text-4xl mb-3"
        >
          {passed ? "🎉" : "😤"}
        </motion.div>

        <h3 className={`text-2xl font-black mb-1.5 ${passed ? "text-green-600" : "text-red-500"}`}>
          {passed ? "Excellent! You Passed!" : "Not Quite — Try Again!"}
        </h3>
        <p className="text-gray-400 text-sm mb-8">
          {passed ? "Next topic is now unlocked." : `You need ${passThreshold}/${total} to pass.`}
        </p>

        {/* Performance stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Correct Answers", value: correct, color: "#10B981", bg: "#ECFDF5" },
            { label: "Wrong Answers",   value: wrong,   color: "#EF4444", bg: "#FEF2F2" },
            { label: "Time Taken",      value: formatTime(timeTaken), color: "#7C3AED", bg: "#F3EEFF" },
            { label: "Accuracy",        value: `${percent}%`, color: "#2563EB", bg: "#EEF3FF" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl p-3 text-center" style={{ background: s.bg }}>
              <div className="font-black text-xl" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Pass message */}
        {passed && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-green-50 border border-green-100 text-green-600 text-sm font-semibold mb-6"
          >
            <Unlock size={14} /> You passed! You can continue to the next topic.
          </motion.div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {passed ? (
            <button
              onClick={onRestart}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 text-sm font-medium transition-all"
            >
              <RotateCcw size={13} /> Retry for Better Score
            </button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onRestart}
              className="flex items-center gap-1.5 px-8 py-2.5 rounded-xl text-white text-sm font-bold"
              style={{ background: accentColor }}
            >
              <RotateCcw size={13} /> Try Again
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
