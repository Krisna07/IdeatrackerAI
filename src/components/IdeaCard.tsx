import { useState } from "react";
import { motion } from "framer-motion";
import { Idea, Subtask } from "../types";
import { FaChevronUp } from "react-icons/fa";
import { FaTrashCan } from "react-icons/fa6";
import SubtaskComponent from "./Subtask";
import Confirm from "./Confirm";

interface IdeaCardProps {
  idea: Idea;
  onToggleSubtask: (ideaId: number, subtaskId: number) => void;
  onGenerateBreakdown: (subtask: Subtask) => Promise<void>;
  breakdown?: string;
  removeIdea: (id: number) => void;
}

export function IdeaCard({
  idea,
  onToggleSubtask,
  onGenerateBreakdown,
  removeIdea,
}: IdeaCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSubtask, setActiveSubtask] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubtaskClick = (subtaskId: number) => {
    setActiveSubtask(activeSubtask === subtaskId ? null : subtaskId);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="bg-white h-fit shadow-[0_0_2px_0_gray] rounded-lg p-4  mb-6 min-w-full max-w-lg"
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

            <div className="w-full flex items-center gap-8 justify-between ">
              {idea.progress == 100 && (
                <motion.div
                  onClick={() => setShowConfirm(true)}
                  initial={{ scale: 1 }}
                  whileHover={{
                    scale: [1.1, 0.9, 1],
                    rotate: ["20deg", "-10deg", "10deg", "-20deg", "0"],
                  }}
                  transition={{ type: "keyframe", duration: 0.3 }}
                >
                  <FaTrashCan className="text-red-400" />
                </motion.div>
              )}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={`w-full text-gray-500      hover:text-gray-700 `}
              >
                <FaChevronUp
                  className={` transition-all ease-in-out place-self-end ${
                    isExpanded && "rotate-180"
                  }`}
                />
              </button>
            </div>
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
                className="p-1"
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
      </motion.div>
      {showConfirm && (
        <Confirm
          id={idea.id}
          removeIdea={removeIdea}
          onClose={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}
