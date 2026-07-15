"use client";

import { motion } from "framer-motion";
import { Play, Clock } from "lucide-react";

interface Props {
  topicTitle: string;
  accentColor?: string;
}

export default function VideoSection({ topicTitle, accentColor = "#00E5FF" }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-xl overflow-hidden border border-white/8"
    >
      {/* Video placeholder */}
      <div
        className="relative aspect-video flex items-center justify-center"
        style={{
          background: `linear-gradient(135deg, #0B1118 0%, #05070A 100%)`,
        }}
      >
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
            backgroundSize: "30px 30px",
          }}
        />

        {/* Glow */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: `radial-gradient(circle at center, ${accentColor} 0%, transparent 65%)`,
          }}
        />

        <div className="relative text-center space-y-4">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto border-2"
            style={{
              borderColor: `${accentColor}40`,
              background: `${accentColor}10`,
            }}
          >
            <Play size={24} style={{ color: accentColor }} />
          </motion.div>

          <div>
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold"
              style={{ background: `${accentColor}15`, color: accentColor }}
            >
              <Clock size={11} />
              COMING SOON
            </div>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h4 className="text-sm font-semibold text-white/80">
          Video Lesson — {topicTitle}
        </h4>
        <p className="text-xs text-white/40 mt-1">
          Is topic ka video lecture jald aa raha hai. Tab tak markdown content se seekho.
        </p>
      </div>
    </motion.div>
  );
}
