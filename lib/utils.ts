export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function estimateReadingTime(text: string): number {
  const wordsPerMinute = 150; // Hinglish is read slightly slower
  const wordCount = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

export function countWords(text: string): number {
  return text.trim().split(/\s+/).length;
}

export function formatTime(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function getRelativeTime(isoDate: string): string {
  const now = new Date();
  const date = new Date(isoDate);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Abhi abhi";
  if (diffMins < 60) return `${diffMins} min pehle`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} ghante pehle`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} din pehle`;
  return date.toLocaleDateString("en-IN");
}
