"use client";

import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";

export default function TermsPage() {
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
          <h1 className="text-2xl font-black text-gray-900">Terms of Use</h1>
        </div>

        <div className="prose-magazine">
          <p>Last updated: July 2026</p>

          <h2>Purpose of this course</h2>
          <p>
            TWH Academy teaches ethical hacking and computer fundamentals strictly for educational
            purposes. Techniques covered are meant to help you understand, secure, and protect systems —
            never to attack systems you don&apos;t own or don&apos;t have explicit written permission to test.
          </p>

          <h2>Your responsibility</h2>
          <p>
            You agree to use everything you learn here legally and ethically. Unauthorized access to
            computers, networks, or accounts that aren&apos;t yours is illegal in most jurisdictions and is
            never endorsed by TWH Academy.
          </p>

          <h2>No warranty</h2>
          <p>
            Course content, hands-on tasks, and MCQs are provided as-is, for learning purposes. We do our
            best to keep everything accurate, but TWH Academy makes no guarantee of completeness or fitness
            for any particular purpose.
          </p>

          <h2>Changes</h2>
          <p>
            These terms may be updated as the course evolves. Continuing to use TWH Academy after changes
            means you accept the updated terms.
          </p>

          <h2>Contact</h2>
          <p>
            Questions? Reach out via the <Link href="/contact" className="text-blue-600 font-semibold">Contact page</Link>.
          </p>
        </div>
      </div>
    </main>
  );
}
