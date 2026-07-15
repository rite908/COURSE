"use client";

import { motion } from "framer-motion";
import { Play, Clock, Tv2 } from "lucide-react";

interface Props {
  topicTitle: string;
  accentColor?: string;
}

export default function VideoSection({ topicTitle, accentColor = "#2563EB" }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm"
    >
      {/* Video placeholder */}
      <div
        className="relative aspect-video flex items-center justify-center overflow-hidden"
        style={{
          background: `linear-gradient(135deg, #F5F8FF 0%, #EEF3FF 100%)`,
        }}
      >
        {/* Subtle dot grid */}
        <div className="absolute inset-0 dot-grid opacity-60" />

        {/* Accent glow */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background: `radial-gradient(ellipse at center, ${accentColor} 0%, transparent 65%)`,
          }}
        />

        {/* Decoration rings */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <motion.div
            animate={{ scale: [1, 1.08, 1], opacity: [0.12, 0.2, 0.12] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-48 h-48 rounded-full border"
            style={{ borderColor: `${accentColor}40` }}
          />
          <motion.div
            animate={{ scale: [1, 1.05, 1], opacity: [0.08, 0.15, 0.08] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute w-32 h-32 rounded-full border"
            style={{ borderColor: `${accentColor}60` }}
          />
        </div>

        <div className="relative text-center space-y-4 z-10">
          {/* Play button */}
          <motion.div
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
            style={{
              background: `${accentColor}14`,
              border: `1.5px solid ${accentColor}30`,
              boxShadow: `0 4px 20px ${accentColor}15`,
            }}
          >
            <Play size={22} style={{ color: accentColor }} className="ml-0.5" />
          </motion.div>

          {/* Badge */}
          <div>
            <div
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold"
              style={{ background: `${accentColor}10`, color: accentColor, border: `1px solid ${accentColor}20` }}
            >
              <Clock size={11} />
              COMING SOON
            </div>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-5 flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: `${accentColor}10` }}
        >
          <Tv2 size={16} style={{ color: accentColor }} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-gray-900">
            Video Lesson — {topicTitle}
          </h4>
          <p className="text-xs text-gray-400 mt-0.5">
            Is topic ka video lecture jald aa raha hai. Tab tak text se seekho.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
