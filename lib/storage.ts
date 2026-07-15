export type UserName = "TWH" | "Prince" | "Ashish";

export interface TopicProgress {
  topicId: string;
  chapterId: string;
  unlocked: boolean;
  mcqScore: number | null; // null = not attempted
  mcqTotal: number;
  mcqAttempts: number;
  passed: boolean; // score >= 90%
}

export interface UserProgress {
  user: UserName;
  topicProgress: Record<string, TopicProgress>; // key: "chapterId:topicId"
  notes: Record<string, string>; // key: "chapterId:topicId"
  bookmarks: string[]; // ["chapterId:topicId"]
  timeSpentSeconds: number;
  lastActive: string; // ISO date
  currentChapter: string | null;
  currentTopic: string | null;
}

const STORAGE_KEY = "twh_academy";
const CURRENT_USER_KEY = "twh_current_user";

const PASS_THRESHOLD = 0.9; // 90%

function getAll(): Record<UserName, UserProgress> {
  if (typeof window === "undefined") return {} as Record<UserName, UserProgress>;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return {} as Record<UserName, UserProgress>;
  try {
    return JSON.parse(raw);
  } catch {
    return {} as Record<UserName, UserProgress>;
  }
}

function saveAll(data: Record<UserName, UserProgress>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function defaultProgress(user: UserName): UserProgress {
  // Chapter 1 Topic 1.1 is always unlocked by default
  return {
    user,
    topicProgress: {
      "1:1.1": {
        topicId: "1.1",
        chapterId: "1",
        unlocked: true,
        mcqScore: null,
        mcqTotal: 0,
        mcqAttempts: 0,
        passed: false,
      },
    },
    notes: {},
    bookmarks: [],
    timeSpentSeconds: 0,
    lastActive: new Date().toISOString(),
    currentChapter: null,
    currentTopic: null,
  };
}

export function getCurrentUser(): UserName | null {
  if (typeof window === "undefined") return null;
  return (localStorage.getItem(CURRENT_USER_KEY) as UserName) || null;
}

export function setCurrentUser(user: UserName) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CURRENT_USER_KEY, user);
}

export function clearCurrentUser() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CURRENT_USER_KEY);
}

export function getUserProgress(user: UserName): UserProgress {
  const all = getAll();
  if (!all[user]) {
    all[user] = defaultProgress(user);
    saveAll(all);
  }
  return all[user];
}

export function saveUserProgress(user: UserName, progress: UserProgress) {
  const all = getAll();
  all[user] = { ...progress, lastActive: new Date().toISOString() };
  saveAll(all);
}

export function isTopicUnlocked(
  user: UserName,
  chapterId: string,
  topicId: string
): boolean {
  const progress = getUserProgress(user);
  const key = `${chapterId}:${topicId}`;
  return progress.topicProgress[key]?.unlocked ?? false;
}

export function getTopicProgress(
  user: UserName,
  chapterId: string,
  topicId: string
): TopicProgress | null {
  const progress = getUserProgress(user);
  return progress.topicProgress[`${chapterId}:${topicId}`] ?? null;
}

export function saveMCQResult(
  user: UserName,
  chapterId: string,
  topicId: string,
  score: number,
  total: number,
  nextTopicId: string | null,
  nextChapterId: string | null
) {
  const all = getAll();
  if (!all[user]) all[user] = defaultProgress(user);
  const progress = all[user];

  const key = `${chapterId}:${topicId}`;
  const existing = progress.topicProgress[key] || {
    topicId,
    chapterId,
    unlocked: true,
    mcqScore: null,
    mcqTotal: total,
    mcqAttempts: 0,
    passed: false,
  };

  const passed = total > 0 && score / total >= PASS_THRESHOLD;

  progress.topicProgress[key] = {
    ...existing,
    mcqScore: score,
    mcqTotal: total,
    mcqAttempts: existing.mcqAttempts + 1,
    passed,
  };

  // Unlock next topic if passed
  if (passed && nextTopicId && nextChapterId) {
    const nextKey = `${nextChapterId}:${nextTopicId}`;
    if (!progress.topicProgress[nextKey]) {
      progress.topicProgress[nextKey] = {
        topicId: nextTopicId,
        chapterId: nextChapterId,
        unlocked: true,
        mcqScore: null,
        mcqTotal: 0,
        mcqAttempts: 0,
        passed: false,
      };
    } else {
      progress.topicProgress[nextKey].unlocked = true;
    }
  }

  saveAll(all);
  return passed;
}

export function saveNote(
  user: UserName,
  chapterId: string,
  topicId: string,
  note: string
) {
  const all = getAll();
  if (!all[user]) all[user] = defaultProgress(user);
  all[user].notes[`${chapterId}:${topicId}`] = note;
  saveAll(all);
}

export function toggleBookmark(
  user: UserName,
  chapterId: string,
  topicId: string
): boolean {
  const all = getAll();
  if (!all[user]) all[user] = defaultProgress(user);
  const key = `${chapterId}:${topicId}`;
  const idx = all[user].bookmarks.indexOf(key);
  if (idx === -1) {
    all[user].bookmarks.push(key);
    saveAll(all);
    return true;
  } else {
    all[user].bookmarks.splice(idx, 1);
    saveAll(all);
    return false;
  }
}

export function setCurrentLocation(
  user: UserName,
  chapterId: string,
  topicId: string
) {
  const all = getAll();
  if (!all[user]) all[user] = defaultProgress(user);
  all[user].currentChapter = chapterId;
  all[user].currentTopic = topicId;
  saveAll(all);
}

export function addTimeSpent(user: UserName, seconds: number) {
  const all = getAll();
  if (!all[user]) all[user] = defaultProgress(user);
  all[user].timeSpentSeconds = (all[user].timeSpentSeconds || 0) + seconds;
  saveAll(all);
}

export function getChapterStats(user: UserName, chapterId: string, totalTopics: number) {
  const progress = getUserProgress(user);
  let completed = 0;
  let unlocked = 0;
  for (let i = 0; i < totalTopics; i++) {
    // We can't know exact topic ids here without parsing, so iterate keys
    const keys = Object.keys(progress.topicProgress).filter(
      (k) => k.startsWith(`${chapterId}:`)
    );
    keys.forEach((k) => {
      const tp = progress.topicProgress[k];
      if (tp.passed) completed++;
      if (tp.unlocked) unlocked++;
    });
    break; // computed above
  }
  // Re-compute properly
  const chapterKeys = Object.keys(progress.topicProgress).filter(
    (k) => k.startsWith(`${chapterId}:`)
  );
  const completedCount = chapterKeys.filter(
    (k) => progress.topicProgress[k].passed
  ).length;
  const unlockedCount = chapterKeys.filter(
    (k) => progress.topicProgress[k].unlocked
  ).length;

  return {
    completed: completedCount,
    unlocked: unlockedCount,
    total: totalTopics,
    percent: totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0,
  };
}

export function getOverallStats(user: UserName) {
  const progress = getUserProgress(user);
  const allTopics = Object.values(progress.topicProgress);
  const totalAttempts = allTopics.reduce((s, t) => s + t.mcqAttempts, 0);
  const totalPassed = allTopics.filter((t) => t.passed).length;
  const totalScoreSum = allTopics.reduce((s, t) => s + (t.mcqScore ?? 0), 0);
  const totalQuestions = allTopics.reduce((s, t) => s + (t.mcqAttempts > 0 ? t.mcqTotal : 0), 0);

  return {
    topicsPassed: totalPassed,
    totalAttempts,
    mcqAccuracy: totalQuestions > 0 ? Math.round((totalScoreSum / totalQuestions) * 100) : 0,
    timeSpentMinutes: Math.round((progress.timeSpentSeconds || 0) / 60),
    currentChapter: progress.currentChapter,
    currentTopic: progress.currentTopic,
  };
}
