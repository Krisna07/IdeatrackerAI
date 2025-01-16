import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { RiGeminiLine } from "react-icons/ri";
import { Idea, Subtask } from "../types";
import ThreeDotsWave from "./Loaders/Threedotsloading";
import ConfettiExplosion from "react-confetti-explosion";
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
  const [isExploding, setIsExploding] = useState<boolean>(false);

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
  }, [idea, subtask.breakdown]);

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
  }, [activeSubtask, subtask.id]);

  const handleToggleSubtask = () => {
    onToggleSubtask(idea.id, subtask.id);
    if (!subtask.completed) {
      setIsExploding(true);
      setTimeout(() => setIsExploding(false), 3000); // Reset confetti after 3 seconds
    }
  };

  return (
    <>
      <motion.div
        key={subtask.id}
        className="w-full flex items-start justify-between mb-2 py-2 gap-2 relative overflow-visible"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div
          className="relative w-fit grid place-items-center "
          onClick={handleToggleSubtask}
        >
          {subtask.completed && isExploding && (
            <ConfettiExplosion particleSize={8} force={0.4} />
          )}
          <svg className="w-[24px] h-[24px] grid place-content-center ">
            <circle
              className="text-gray-300"
              strokeWidth="4"
              stroke="currentColor"
              fill="transparent"
              r="8"
              cx="12"
              cy="12"
            />
            <motion.circle
              className="text-blue-600"
              strokeWidth="2"
              strokeDasharray="100"
              strokeDashoffset="100"
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="8"
              cx="12"
              cy="12"
              initial={{ strokeDashoffset: 100 }}
              animate={{
                strokeDashoffset: subtask.completed ? 100 - 100 : 100 - 0,
              }}
              transition={{ duration: 1 }}
            />
          </svg>
          <motion.div
            initial={{ scale: 0 }}
            animate={
              subtask.completed
                ? {
                    scale: 1,
                  }
                : {
                    scale: 0,
                  }
            }
            transition={{
              type: "spring",
            }}
            className="absolute"
          >
            <TiTick />
          </motion.div>
        </div>
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
                className={`flex items-center  rounded-md px-2 text-sm relative z-10 ${
                  !loading && "shadow-[0_0_2px_0_gray]"
                } gap-2`}
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
            <div className="">
              <p className="text-sm text-gray-600">{subtask.description}</p>
              {subtask.breakdown && (
                <motion.div
                  className={`overflow-hidden grid gap-4   ${
                    visibleBreakdowns && "bg-gray-100"
                  } rounded `}
                >
                  <motion.div
                    style={{ overflow: "hidden" }}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{
                      height: visibleBreakdowns ? "auto" : 0,
                      opacity: 1,
                    }}
                    transition={{ duration: 0.5 }}
                    className=""
                  >
                    <h3 className="text-lg font-semibold">Breakdown:</h3>
                    <div className="text-sm text-gray-700">
                      {renderBreakdown(subtask.breakdown)}
                    </div>
                  </motion.div>

                  <div className="w-full flex gap-2">
                    <button
                      onClick={handleToggleSubtask}
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
