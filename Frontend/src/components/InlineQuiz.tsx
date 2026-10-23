"use client";

import React, { useState } from "react";
import { useVisualizerStore } from "@/store/useVisualizerStore";
import { ALGORITHMS } from "@/lib/algorithms";
import { Check, X, Award, RotateCcw, ArrowRight } from "lucide-react";

export default function InlineQuiz() {
  const { selectedTopic, recordQuizScore, setShowInlineQuiz } = useVisualizerStore();
  const algorithm = ALGORITHMS[selectedTopic];

  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  if (!algorithm || !algorithm.quiz || algorithm.quiz.length === 0) return null;

  const currentQ = algorithm.quiz[currentQIndex];
  const total = algorithm.quiz.length;

  const handleSelect = (idx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    if (idx === currentQ.correctIndex) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQIndex + 1 < total) {
      setCurrentQIndex((p) => p + 1);
      setSelectedOption(null);
    } else {
      setIsFinished(true);
      recordQuizScore(selectedTopic, score + (selectedOption === currentQ.correctIndex ? 1 : 0), total);
    }
  };

  const handleReset = () => {
    setCurrentQIndex(0);
    setSelectedOption(null);
    setScore(0);
    setIsFinished(false);
  };

  return (
    <div className="w-full p-4 border border-[var(--border-color)] bg-[var(--bg-surface)] rounded-md flex flex-col gap-3 text-xs">
      {/* Quiz Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[var(--border-color)]">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm text-[var(--text-primary)]">
            {algorithm.name} Conceptual Quiz
          </span>
          <span className="text-[11px] font-mono text-[var(--text-muted)]">
            ({currentQIndex + 1}/{total})
          </span>
        </div>

        <button
          onClick={() => setShowInlineQuiz(false)}
          className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]"
        >
          Close
        </button>
      </div>

      {isFinished ? (
        <div className="py-4 flex flex-col items-center text-center gap-2">
          <div className="p-2 rounded-full bg-emerald-500/10 text-emerald-600">
            <Award className="w-6 h-6" />
          </div>
          <span className="font-bold text-sm text-[var(--text-primary)]">
            Quiz Completed! Score: {score}/{total}
          </span>
          <p className="text-xs text-[var(--text-muted)]">
            {score === total ? "Excellent! Full mastery recorded." : "Good review. Retry anytime to test yourself."}
          </p>
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleReset}
              className="px-3 py-1 rounded border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-raised)] text-xs flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Retry
            </button>
            <button
              onClick={() => setShowInlineQuiz(false)}
              className="px-3 py-1 rounded bg-[var(--accent)] text-white text-xs font-semibold"
            >
              Back to Canvas
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <p className="font-semibold text-xs text-[var(--text-primary)] leading-normal">
            {currentQ.question}
          </p>

          <div className="flex flex-col gap-1.5">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQ.correctIndex;
              const answered = selectedOption !== null;

              let btnStyle = "border-[var(--border-color)] bg-[var(--bg-raised)] hover:border-[var(--border-strong)]";
              if (answered) {
                if (isCorrect) btnStyle = "border-green-600 bg-green-500/10 text-green-800 dark:text-green-300 font-semibold";
                else if (isSelected) btnStyle = "border-red-500 bg-red-500/10 text-red-800 dark:text-red-300";
                else btnStyle = "border-[var(--border-color)] opacity-50";
              }

              return (
                <button
                  key={idx}
                  disabled={answered}
                  onClick={() => handleSelect(idx)}
                  className={`w-full text-left p-2 rounded border text-xs transition-colors flex items-center justify-between ${btnStyle}`}
                >
                  <span>{opt}</span>
                  {answered && isCorrect && <Check className="w-3.5 h-3.5 text-green-600 shrink-0" />}
                  {answered && isSelected && !isCorrect && <X className="w-3.5 h-3.5 text-red-600 shrink-0" />}
                </button>
              );
            })}
          </div>

          {selectedOption !== null && (
            <div className="p-2 rounded bg-[var(--bg-raised)] border border-[var(--border-color)] text-[11px] text-[var(--text-secondary)]">
              <span className="font-semibold text-[var(--text-primary)] block">Explanation:</span>
              {currentQ.explanation}
            </div>
          )}

          {selectedOption !== null && (
            <div className="flex justify-end pt-1">
              <button
                onClick={handleNext}
                className="px-3 py-1.5 rounded bg-[var(--accent)] text-white text-xs font-semibold hover:opacity-90 flex items-center gap-1"
              >
                <span>{currentQIndex + 1 < total ? "Next Question" : "View Score"}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

