import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { RiGeminiLine } from "react-icons/ri";
import { Idea, Subtask } from "../types";
import ThreeDotsWave from "./Loaders/Threedotsloading";
import { div } from "framer-motion/client";
import { TiTick } from "react-icons/ti";

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
  const [visibleBreakdowns, setVisibleBreakdowns] = useState<boolean>(false);

  useEffect(() => {
    if (showTooltip) {
      const interval = setInterval(() => {
        setShowTooltip(false);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [showTooltip]);

  useEffect(() => {
    if (subtask.breakdown) {
      setLoading(false);
    }
  }, [idea]);

  const toggleBreakdownVisibility = () => {
    setVisibleBreakdowns(!visibleBreakdowns);
  };

  const renderBreakdown = (html: string) => {
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  };
  useEffect(() => {
    if (activeSubtask !== subtask.id) {
      setVisibleBreakdowns(false);
    }
  }, [activeSubtask]);

  return (
    <>
      <motion.div
        key={subtask.id}
        className="w-full flex items-start justify-between mb-2 p-2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <input
          type="checkbox"
          checked={subtask.completed}
          onChange={() => onToggleSubtask(idea.id, subtask.id)}
          className="place-self-start m-2 mt-1"
        />
        <div className="w-full grid gap-1 ">
          <div className="flex items-center justify-between gap-2">
            <span
              className={`font-semibold relative flex items-center leading-4 ${
                subtask.completed
                  ? "line-through text-gray-400"
                  : "text-gray-800"
              }`}
              onClick={() => handleSubtaskClick(subtask.id)}
            >
              {subtask.title}
              {/* <motion.div className="w-full h-1 absolute bg-black"></motion.div> */}
            </span>
            <div
              className="relative place-self-start"
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
                  <>
                    Breakdown <RiGeminiLine />
                  </>
                )}
              </button>
              {showTooltip && (
                <div className="absolute z-20 right-0 mt-2 w-48  rounded-md shadow-lg   px-2 py-1 text-sm bg-slate-600 text-white">
                  For detailed breakdown of this step, use IdeaAI.
                </div>
              )}
            </div>
          </div>
          {activeSubtask === subtask.id && (
            <div>
              <p className="text-sm text-gray-600">{subtask.description}</p>
              {subtask.breakdown && (
                <motion.div
                  className={`overflow-hidden mt-4 grid gap-4 p-2 ${
                    visibleBreakdowns && "bg-gray-100"
                  } rounded `}
                >
                  {visibleBreakdowns && (
                    <motion.div
                      style={{ overflow: "hidden" }}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{
                        height: visibleBreakdowns ? "auto" : 0,
                        opacity: 1,
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      <h3 className="text-lg font-semibold">Breakdown:</h3>
                      <div className="text-sm text-gray-700">
                        {renderBreakdown(subtask.breakdown)}
                      </div>
                    </motion.div>
                  )}
                  <div className="w-full flex gap-2">
                    <button
                      onClick={() => onToggleSubtask(idea.id, subtask.id)}
                      className="w-fit flex items-center bg-blue-600 rounded-md text-sm p-2 py-1 text-white"
                    >
                      {subtask.completed && <TiTick />}
                      Done
                    </button>
                    <button
                      onClick={toggleBreakdownVisibility}
                      className="h-fit w-fit flex items-center shadow-[0_0_2px_0_black] rounded-md text-[12px] p-2 py-1 "
                    >
                      {visibleBreakdowns ? "Hide Breakdown" : "View Breakdown"}
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default SubtaskComponent;
