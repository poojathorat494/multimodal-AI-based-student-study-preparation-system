import React, { useState } from "react";
import data from "../utils/data/data.json";
import { mockPlacementAssistant } from "../utils/mockAssistant";

type QAItem = {
  question: string;
  answer: string;
};

const ChatMatcher: React.FC = () => {
  const [qaData] = useState<QAItem[]>(data);
  const [answer, setAnswer] = useState("");

  const handleAsk = (query: string) => {
    if (!query || !qaData.length) {
      setAnswer("No data available...");
      return;
    }

    const result = mockPlacementAssistant(query, qaData);
    setAnswer(result);
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-2">Ask a question</h2>

      <input
        type="text"
        placeholder="Ask a question..."
        className="border p-2 mt-2 w-full"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleAsk((e.target as HTMLInputElement).value);
            (e.target as HTMLInputElement).value = "";
          }
        }}
      />

      {answer && (
        <div className="mt-4 p-4 bg-gray-100 rounded shadow">
          <strong>Answer:</strong> <br />
          {answer}
        </div>
      )}
    </div>
  );
};

export default ChatMatcher;