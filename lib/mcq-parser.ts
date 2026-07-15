export interface MCQOption {
  letter: string;
  text: string;
}

export interface MCQuestion {
  id: number;
  question: string;
  options: MCQOption[];
  correctAnswer: string;
  explanation: string;
}

export interface MCQSet {
  topicId: string;
  questions: MCQuestion[];
}

/**
 * Parse all MCQ sets from a full chapter markdown.
 * Format:
 *   ## 🧠 MCQ Set — Topic X.Y
 *   **Q1.** Question?
 *   - A) Option
 *   ✅ **Sahi Jawab: A**
 *   > Explanation
 */
export function parseMCQSets(markdown: string): Record<string, MCQuestion[]> {
  const result: Record<string, MCQuestion[]> = {};

  // Split on MCQ set headings
  const setRegex = /## 🧠 MCQ Set — Topic (\d+\.\d+)/g;
  const setMatches: { topicId: string; index: number }[] = [];
  let sm;
  while ((sm = setRegex.exec(markdown)) !== null) {
    setMatches.push({ topicId: sm[1], index: sm.index });
  }

  for (let i = 0; i < setMatches.length; i++) {
    const { topicId, index } = setMatches[i];
    const end =
      i + 1 < setMatches.length
        ? setMatches[i + 1].index
        : markdown.length;
    // Stop also at task heading
    const taskIdx = markdown.indexOf(`## 🎯 Task — Topic ${topicId}`, index);
    const sliceEnd = taskIdx !== -1 && taskIdx < end ? taskIdx : end;
    const block = markdown.slice(index, sliceEnd);
    result[topicId] = parseQuestionsFromBlock(block);
  }

  return result;
}

function parseQuestionsFromBlock(block: string): MCQuestion[] {
  const questions: MCQuestion[] = [];

  // Split on question markers: **Q1.**
  const qSplit = block.split(/(?=\n\*\*Q\d+\.)/);

  for (const chunk of qSplit) {
    const qMatch = chunk.match(/\*\*Q(\d+)\.\*\*\s*([\s\S]*?)(?=\n\n- [A-D]\)|\n- [A-D]\))/);
    if (!qMatch) continue;

    const questionNum = parseInt(qMatch[1]);
    const questionText = qMatch[2].trim();

    // Parse options
    const options: MCQOption[] = [];
    const optionRegex = /^- ([A-D])\) (.+)$/gm;
    let om;
    while ((om = optionRegex.exec(chunk)) !== null) {
      options.push({ letter: om[1], text: om[2].trim() });
    }

    if (options.length === 0) continue;

    // Parse correct answer
    const answerMatch = chunk.match(/✅\s*\*\*Sahi Jawab:\s*([A-D])\*\*/);
    const correctAnswer = answerMatch ? answerMatch[1] : options[0].letter;

    // Parse explanation
    const explMatch = chunk.match(/> (.+)/);
    const explanation = explMatch ? explMatch[1].trim() : "";

    questions.push({
      id: questionNum,
      question: questionText,
      options,
      correctAnswer,
      explanation,
    });
  }

  return questions;
}

/** Extract just the theory + hands-on portion, excluding MCQ set */
export function extractTheoryContent(topicMarkdown: string, topicId: string): string {
  const mcqIdx = topicMarkdown.indexOf(`## 🧠 MCQ Set — Topic ${topicId}`);
  if (mcqIdx !== -1) {
    return topicMarkdown.slice(0, mcqIdx).trim();
  }
  return topicMarkdown.trim();
}

export function extractTaskContent(topicMarkdown: string, topicId: string): string {
  const taskIdx = topicMarkdown.indexOf(`## 🎯 Task — Topic ${topicId}`);
  if (taskIdx !== -1) {
    return topicMarkdown.slice(taskIdx).trim();
  }
  return "";
}
