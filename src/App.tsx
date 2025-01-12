import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import AddIdeaForm from "./components/AddIdeaForm";
import Navbar from "./components/Navbar";
import { Idea, Subtask, Breakdown } from "./types";
import { IdeaCard } from "./components/IdeaCard";
import generate from "./utils/generate";

export default function Home() {
  const [ideas, setIdeas] = useState<Idea[]>(() => {
    const savedIdeas = localStorage.getItem("ideas");
    return savedIdeas ? JSON.parse(savedIdeas) : [];
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ideaform, showIdeaForm] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem("ideas", JSON.stringify(ideas));
  }, [ideas]);

  const generateSubtasks = async (
    title: string,
    description: string,
    ideaId: number
  ): Promise<Subtask[]> => {
    try {
      const SubtaskObject: { title: string; description: string } = {
        title: "",
        description: "",
      };
      //Prmopt for the gemini
      const prompt = `based on the title: ${title} and description: ${description} generate a list of subtasks that need to be done to meet the goal. Format it to meet the schema :
      {
      title: "this should be the title of the subtask",
      description: "this should be the description of the subtask",
      }
      `;
      const response = await generate(prompt, SubtaskObject);

      const subtasksList: Subtask[] = response.map((item: Subtask) => {
        const { title, description = "" } = item;
        return {
          ideaId: ideaId,
          id: Math.floor(Math.random() * 100000),
          title,
          description,
          completed: false,
        };
      });

      // console.log("Formatted Response Array:", subtasksList);
      return subtasksList;
    } catch (error) {
      console.error("Error parsing response:", error);
      throw error;
    }
  };

  const addIdea = async (title: string, description: string) => {
    if (!title.trim()) {
      setError("Please enter a title");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const ideaId = Math.floor(Math.random() * 356662);
      const subtasks: Subtask[] = await generateSubtasks(
        title,
        description,
        ideaId
      );
      // setSubtasks(subtasks);
      setIdeas((ideas) => [
        ...ideas,
        {
          id: ideaId,
          title,
          description,
          status: "Not Started",
          progress: 0,
          subtasks,
        },
      ]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate subtasks"
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleSubtask = (ideaId: number, subtaskId: number) => {
    setIdeas(
      ideas.map((idea) => {
        if (idea.id === ideaId) {
          const updatedSubtasks = idea.subtasks.map((subtask: Subtask) =>
            subtask.id === subtaskId
              ? { ...subtask, completed: !subtask.completed }
              : subtask
          );
          const completedCount = updatedSubtasks.filter(
            (task) => task.completed
          ).length;
          const progress = Math.round(
            (completedCount / updatedSubtasks.length) * 100
          );
          const status =
            progress === 100
              ? "Completed"
              : progress === 0
              ? "Not Started"
              : "In Progress";

          return { ...idea, subtasks: updatedSubtasks, progress, status };
        }
        return idea;
      })
    );
  };

  const generateBreakdown = async (subtask: Subtask): Promise<void> => {
    const prompt = `
    Give a breakdown of the subtask: ${subtask.title}.
    based on the subtask: ${subtask.title} generate a detailed breakdown of the steps required to complete it. Format the response to meet the schema:
    {
      details: "this should be a detailed breakdown of the subtask formatted as html just write inside a <div>  with headings, list and paragraphs use tailwind css to make it look better"
    }
    `;
    const breakDownObject: { details: string } = { details: "" };
    try {
      const response = await generate(prompt, breakDownObject);
      const breakdownList: Breakdown[] = response.map((item: Breakdown) => {
        const { details = "" } = item;
        return {
          subtask: subtask.title,
          details: details,
        };
      });

      console.log("Formatted Response Array:", response);
      setIdeas((ideas) =>
        ideas.map((idea) => {
          if (idea.id === subtask.ideaId) {
            const updatedSubtasks = idea.subtasks.map((st: Subtask) =>
              st.id === subtask.id
                ? { ...st, breakdown: breakdownList[0].details }
                : st
            );
            const updatedIdea = { ...idea, subtasks: updatedSubtasks };
            localStorage.setItem(
              "ideas",
              JSON.stringify(
                ideas.map((i) => (i.id === idea.id ? updatedIdea : i))
              )
            );
            return updatedIdea;
          }
          return idea;
        })
      );

      return;
    } catch (error) {
      console.error("Error generating breakdown:", error);
    }
  };

  const formVisibilityhandler = (item: boolean) => {
    showIdeaForm(item);
  };
  useEffect(() => {
    if (!loading) {
      formVisibilityhandler(false);
    }
  }, [loading]);

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 grid gap-4 place-items-center">
        <div className="h-fit gap-4 text-center">
          <h1 className="text-4xl font-bold text-center leading-[150%]">
            Idea Progress Tracker
          </h1>
          <p>Have an idea? Brainstorm with Ideatracker AI. </p>
        </div>

        <motion.div
          initial={{ scale: 0 }}
          animate={
            ideaform ? { scale: 1, height: "auto" } : { scale: 0, height: 0 }
          }
          transition={{ type: "keyframes", stiffness: 100 }}
          className="w-full grid place-items-center"
        >
          <AddIdeaForm
            onAddIdea={addIdea}
            loading={loading}
            error={error}
            formVisibilityhandler={formVisibilityhandler}
          />
        </motion.div>

        <div className="relative flex items-center justify-center">
          <motion.button
            initial={{ scale: 0 }}
            animate={
              !ideaform ? { scale: 1, height: "auto" } : { scale: 0, height: 0 }
            }
            transition={{ type: "keyframes", stiffness: 100 }}
            onClick={() => formVisibilityhandler(true)}
            className="w-fit flex justify-center items-center  py-2 px-4 border border-transparent rounded-md shadow-[0_0_4px_0_black] text-sm font-medium
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 relative z-10"
          >
            Track New Idea
          </motion.button>
          {/* <div className="absolute w-[200%] h-[140%] p-2  bg-gradient-to-r from-white  animate-pulse via-emerald-500/50 to-transpare z-0"></div> */}
        </div>

        <AnimatePresence>
          <div
            style={{
              gridTemplateColumns: `repeat(${
                ideas.length < 3 ? ideas.length : 3
              }, 1fr)`,
            }}
            className={`w-full sm:grid grid-cols-1  gap-4`}
          >
            {ideas.map((idea) => (
              <motion.div
                key={idea.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5 }}
              >
                <IdeaCard
                  idea={idea}
                  onToggleSubtask={toggleSubtask}
                  onGenerateBreakdown={generateBreakdown}
                />
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      </div>
    </>
  );
}
