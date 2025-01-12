import { useState } from "react";
import { motion } from "framer-motion";
import { Idea, Subtask } from "../types";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

import SubtaskComponent from "./Subtask";

interface IdeaCardProps {
  idea: Idea;
  onToggleSubtask: (ideaId: number, subtaskId: number) => void;
  onGenerateBreakdown: (subtask: Subtask) => Promise<void>;
  breakdown?: string;
}

export function IdeaCard({
  idea,
  onToggleSubtask,
  onGenerateBreakdown,
}: IdeaCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSubtask, setActiveSubtask] = useState<number | null>(null);

  const handleSubtaskClick = (subtaskId: number) => {
    setActiveSubtask(activeSubtask === subtaskId ? null : subtaskId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="bg-white shadow-lg rounded-lg p-6 mb-6 min-w-full max-w-lg"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold capitalize">{idea.title}</h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-500 hover:text-gray-700"
        >
          {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
        </button>
      </div>
      <p className="text-gray-600 mt-2">{idea.description}</p>
      {isExpanded && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Subtasks:</h3>
          <div className="mt-2 overflow-hidden">
            {idea.subtasks.map((subtask: Subtask, index: number) => (
              <motion.div
                initial={{ opacity: 0, x: "-100%" }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  type: "spring",
                  duration: 0.2 * index,
                }}
                key={subtask.id}
                className=""
              >
                <SubtaskComponent
                  idea={idea}
                  subtask={subtask}
                  activeSubtask={activeSubtask}
                  handleSubtaskClick={handleSubtaskClick}
                  onToggleSubtask={onToggleSubtask}
                  handleGenerateBreakdown={onGenerateBreakdown}
                />
              </motion.div>
            ))}
          </div>
        </div>
      )}
      <div className="flex items-center">
        <div className="w-48 bg-gray-200 rounded-full h-2 mr-2">
          <motion.div
            className="bg-blue-600 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${idea.progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <span className="text-sm font-medium">{idea.progress}%</span>
      </div>
    </motion.div>
  );
}
