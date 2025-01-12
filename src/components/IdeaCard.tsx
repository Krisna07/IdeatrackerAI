import { useState } from "react";
import { motion } from "framer-motion";
import { Idea, Subtask } from "../types";
import { FaChevronUp } from "react-icons/fa";

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
      className="bg-white h-full shadow-[0_0_2px_0_gray] rounded-lg p-6 mb-6 min-w-full max-w-lg"
    >
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold capitalize">{idea.title}</h2>
          <p className="text-gray-600 mt-2">{idea.description}</p>
        </div>
        <div className="grid place-content-center">
          <svg className="w-24 h-24">
            <circle
              className="text-gray-300"
              strokeWidth="4"
              stroke="currentColor"
              fill="transparent"
              r="32"
              cx="48"
              cy="48"
            />
            <motion.circle
              className="text-blue-600"
              strokeWidth="4"
              strokeDasharray="200"
              strokeDashoffset="200"
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="32"
              cx="48"
              cy="48"
              initial={{ strokeDashoffset: 200 }}
              animate={{ strokeDashoffset: 200 - idea.progress * 2 }}
              transition={{ duration: 0.5 }}
            />
            <text
              x="50%"
              y="50%"
              dominantBaseline="middle"
              textAnchor="middle"
              className="text-xs font-semibold "
            >
              {idea.progress}%
            </text>
          </svg>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`text-gray-500 transition-all ease-in-out place-self-end  hover:text-gray-700 ${
              isExpanded && "rotate-180"
            }`}
          >
            <FaChevronUp />
          </button>
        </div>
      </div>

      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: isExpanded ? "auto" : 0, opacity: 1 }}
        className={`mt-4 overflow-hidden `}
      >
        <h3 className="text-lg font-semibold">Roadmap </h3>
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
      </motion.div>

      {/* <div className="flex items-center">
        <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
          <motion.div
            className="bg-blue-600 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${idea.progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <span className="text-sm font-medium">{idea.progress}%</span>
      </div> */}
    </motion.div>
  );
}
