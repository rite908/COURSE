"use client";

import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen pt-28 pb-20 px-6" style={{ background: "#F8FAFF" }}>
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 mb-8 hover:underline">
          <ArrowLeft size={15} /> Back to Home
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #2563EB, #7C3AED)" }}>
            <Shield size={18} className="text-white" />
          </div>
          <h1 className="text-2xl font-black text-gray-900">Privacy Policy</h1>
        </div>

        <div className="prose-magazine">
          <p>Last updated: July 2026</p>

          <h2>What we store</h2>
          <p>
            TWH Academy runs entirely in your browser. Your selected profile name, chapter progress,
            MCQ scores, and notes are saved using your browser&apos;s <code>localStorage</code> —
            nothing is sent to or stored on any external server or database.
          </p>

          <h2>What we don&apos;t do</h2>
          <p>
            We don&apos;t collect emails, passwords, payment information, or any personally identifying
            data. We don&apos;t use tracking cookies or third-party analytics.
          </p>

          <h2>Clearing your data</h2>
          <p>
            Since everything lives in your browser&apos;s local storage, clearing your browser data or
            using a different browser/device will reset your progress. There is currently no cross-device
            sync.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about this policy? Reach out via the <Link href="/contact" className="text-blue-600 font-semibold">Contact page</Link>.
          </p>
        </div>
      </div>
    </main>
  );
}
