export interface ChapterMeta {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  description: string;
  file: string;
  theme: "startup" | "computer" | "network" | "linux" | "kali";
  accentColor: string;
  accentClass: string;
  glowClass: string;
  bgGradient: string;
  icon: string;
  totalTopics: number;
}

export interface TopicMeta {
  id: string; // e.g. "1.1"
  chapterId: string;
  title: string;
  index: number; // 0-based position in chapter
}

export const CHAPTERS: ChapterMeta[] = [
  {
    id: "1",
    number: 1,
    title: "Startup",
    subtitle: "Hacker Ka Pehla Kadam",
    description:
      "Zero se shuru karo — hacker mindset, history, aur ethical hacking ki pehchaan.",
    file: "Chapter-1-Startup.md",
    theme: "startup",
    accentColor: "#2563EB",
    accentClass: "text-blue-600",
    glowClass: "shadow-blue-200",
    bgGradient: "from-blue-50 to-white",
    icon: "🚀",
    totalTopics: 6,
  },
  {
    id: "2",
    number: 2,
    title: "How Computer Works",
    subtitle: "Computer Ki Andar Ki Duniya",
    description:
      "CPU, RAM, motherboard — hardware se leke software tak ka poora safar.",
    file: "Chapter-2-How-Computer-Works.md",
    theme: "computer",
    accentColor: "#0EA5E9",
    accentClass: "text-sky-500",
    glowClass: "shadow-sky-200",
    bgGradient: "from-sky-50 to-white",
    icon: "💻",
    totalTopics: 6,
  },
  {
    id: "3",
    number: 3,
    title: "Networking",
    subtitle: "Internet Ki Secret Language",
    description:
      "IP, TCP, DNS, packets — data kaise travel karta hai poori duniya mein.",
    file: "Chapter-3-Networking.md",
    theme: "network",
    accentColor: "#7C3AED",
    accentClass: "text-violet-600",
    glowClass: "shadow-violet-200",
    bgGradient: "from-violet-50 to-white",
    icon: "🌐",
    totalTopics: 6,
  },
  {
    id: "4",
    number: 4,
    title: "Linux Command Line",
    subtitle: "Hacker Ka Asli Weapon",
    description:
      "Terminal, bash, commands — Linux woh cheez hai jo real hackers use karte hain.",
    file: "Chapter-4-Linux-CommandLine.md",
    theme: "linux",
    accentColor: "#059669",
    accentClass: "text-emerald-600",
    glowClass: "shadow-emerald-200",
    bgGradient: "from-emerald-50 to-white",
    icon: "🐧",
    totalTopics: 6,
  },
  {
    id: "5",
    number: 5,
    title: "Kali Linux",
    subtitle: "Pentester Ka Toolkit",
    description:
      "Tools, exploits, reconnaissance — real ethical hacking ka practical duniya.",
    file: "Chapter-5-Kali-Linux.md",
    theme: "kali",
    accentColor: "#DC2626",
    accentClass: "text-red-600",
    glowClass: "shadow-red-200",
    bgGradient: "from-red-50 to-white",
    icon: "⚔️",
    totalTopics: 6,
  },
];

export function getChapter(id: string): ChapterMeta | undefined {
  return CHAPTERS.find((c) => c.id === id);
}

export function extractTopicsFromMarkdown(
  content: string,
  chapterId: string
): TopicMeta[] {
  const topics: TopicMeta[] = [];
  // Matches: ## 📌 Topic 1.1 — Title
  const topicRegex = /^## 📌 Topic (\d+\.\d+) — (.+)$/gm;
  let match;
  let index = 0;
  while ((match = topicRegex.exec(content)) !== null) {
    topics.push({
      id: match[1],
      chapterId,
      title: match[2].trim(),
      index,
    });
    index++;
  }
  return topics;
}

/** Extract the raw markdown slice for a specific topic */
export function extractTopicContent(
  fullMarkdown: string,
  topicId: string
): string {
  const topicRegex = /^## 📌 Topic \d+\.\d+ — .+$/gm;
  const matches: { index: number; text: string }[] = [];
  let m;
  while ((m = topicRegex.exec(fullMarkdown)) !== null) {
    matches.push({ index: m.index, text: m[0] });
  }

  const targetIdx = matches.findIndex((m) => m.text.includes(`Topic ${topicId}`));
  if (targetIdx === -1) return "";

  const start = matches[targetIdx].index;
  const end =
    targetIdx + 1 < matches.length
      ? matches[targetIdx + 1].index
      : fullMarkdown.length;

  return fullMarkdown.slice(start, end);
}
