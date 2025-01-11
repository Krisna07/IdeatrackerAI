import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { RiGeminiLine } from "react-icons/ri";
import { Idea, Subtask } from "../types";
import ThreeDotsWave from "./Loaders/Threedotsloading";

interface SubtaskProps {
  idea: Idea;
  subtask: Subtask;
  activeSubtask: number | null;
  onToggleSubtask: (ideaId: number, subtaskId: number) => void;
  handleSubtaskClick: (subtaskId: number) => void;
  handleGenerateBreakdown: (subtask: Subtask) => void;
}

const SubtaskComponent = ({
  idea,
  subtask,
  activeSubtask,
  handleSubtaskClick,
  onToggleSubtask,
  handleGenerateBreakdown,
}: SubtaskProps) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (subtask.breakdown) {
      setLoading(false);
    }
  }, [idea]);

  return (
    <>
      <motion.div
        key={subtask.id}
        className="w-full flex items-center justify-between mb-2 p-2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div
          className="flex gap-1 items-start "
          onClick={() => handleSubtaskClick(subtask.id)}
        >
          <input
            type="checkbox"
            checked={subtask.completed}
            onChange={() => onToggleSubtask(idea.id, subtask.id)}
            className="mt-1 mr-2"
          />
          <div>
            <span className="font-semibold">{subtask.title}</span>
            {activeSubtask === subtask.id && (
              <p className="text-sm text-gray-600">{subtask.description}</p>
            )}
          </div>
        </div>
        <div
          className="relative "
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <button
            onClick={() => {
              handleGenerateBreakdown(subtask);
              setLoading(true);
            }}
            className="flex items-center  rounded-md px-2 text-sm relative z-10 shadow-[0_0_2px_0_gray] gap-2"
          >
            {loading ? (
              <ThreeDotsWave />
            ) : subtask.breakdown ? (
              "Regenerate"
            ) : (
              "AI"
            )}
            <div className="">
              <RiGeminiLine />
            </div>
          </button>
          {showTooltip && (
            <div className="absolute z-20 right-0 mt-2 w-48  rounded-md shadow-lg   px-2 py-1 text-sm bg-slate-600 text-white">
              For detailed breakdown of this step, use IdeaAI.
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default SubtaskComponent;
