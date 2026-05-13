// utils/mockAssistant.ts
import Fuse from 'fuse.js';

type QAItem = {
  question: string;
  answer: string;
};

export const mockPlacementAssistant = (
  userMessage: string,
  qaData: QAItem[]
): string => {
  if (!qaData || qaData.length === 0) {
    return "Sorry, I don't have any information right now. Please try again later.";
  }

  const fuse = new Fuse(qaData, {
    keys: ['question'],
    threshold: 0.6,
    includeScore: true,
  });

  const results = fuse.search(userMessage);
  const topMatch = results[0];

  if (topMatch && topMatch.item) {
    return topMatch.item.answer;
  } else {
    return 'Sorry, no good match found. Try rephrasing your question.';
  }
};
