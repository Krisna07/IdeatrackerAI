import { useState } from "react";
import { motion } from "framer-motion";
import { Idea, Subtask as SubtaskType, Breakdown } from "../types";
import Subtask from "./Subtask";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { TiTick } from "react-icons/ti";

interface IdeaCardProps {
  idea: Idea;
  onToggleSubtask: (ideaId: number, subtaskId: number) => void;
  onGenerateBreakdown: (subtask: SubtaskType) => Promise<void>;
  breakdowns: { [key: number]: Breakdown };
}

export function IdeaCard({
  idea,
  onToggleSubtask,
  onGenerateBreakdown,
  breakdowns,
}: IdeaCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSubtask, setActiveSubtask] = useState<number | null>(null);
  const [visibleBreakdowns, setVisibleBreakdowns] = useState<{
    [key: number]: boolean;
  }>({});

  const handleSubtaskClick = (subtaskId: number) => {
    setActiveSubtask(activeSubtask === subtaskId ? null : subtaskId);
  };

  const toggleBreakdownVisibility = (subtaskId: number) => {
    setVisibleBreakdowns((prev) => ({
      ...prev,
      [subtaskId]: !prev[subtaskId],
    }));
  };

  const renderBreakdown = (text: string) => {
    const lines = text.split("\n").filter((line) => line.trim() !== "");
    return lines.map((line, index) => {
      if (line.startsWith("**")) {
        return (
          <h4 key={index} className="font-bold mt-2">
            {line.replace(/\*\*/g, "")}
          </h4>
        );
      } else if (line.startsWith("*")) {
        return (
          <li key={index} className="ml-4 list-disc">
            {line.replace(/^\*\s*/, "")}
          </li>
        );
      } else {
        return (
          <p key={index} className="mt-1">
            {line}
          </p>
        );
      }
    });
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
            {idea.subtasks.map((subtask, index) => (
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
                <Subtask
                  idea={idea}
                  subtask={subtask}
                  activeSubtask={activeSubtask}
                  handleSubtaskClick={handleSubtaskClick}
                  onToggleSubtask={onToggleSubtask}
                  handleGenerateBreakdown={onGenerateBreakdown}
                />
                {breakdowns[subtask.id] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "fit-content", opacity: 1 }}
                    className="overflow-hidden mt-4 grid gap-4 p-2 bg-gray-100 rounded"
                  >
                    <button
                      onClick={() => toggleBreakdownVisibility(subtask.id)}
                      className="w-fit flex items-center bg-blue-600 rounded-md text-sm p-2 py-1 text-white"
                    >
                      {visibleBreakdowns[subtask.id]
                        ? "Hide Breakdown"
                        : "View Breakdown"}
                    </button>
                    {visibleBreakdowns[subtask.id] && (
                      <>
                        <h3 className="text-lg font-semibold">Breakdown:</h3>
                        <div className="text-sm text-gray-700">
                          {renderBreakdown(breakdowns[subtask.id].details)}
                        </div>
                        <button
                          onClick={() => onToggleSubtask(idea.id, subtask.id)}
                          className="w-fit flex items-center bg-blue-600 rounded-md text-sm p-2 py-1 text-white"
                        >
                          {subtask.completed && <TiTick />}
                          Done
                        </button>
                      </>
                    )}
                  </motion.div>
                )}
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
