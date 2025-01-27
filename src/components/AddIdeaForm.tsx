import { useState } from "react";
import { motion } from "framer-motion";
import ThreeDotsWave from "./Loaders/Threedotsloading";
import generate from "../utils/generate";

interface AddIdeaFormProps {
  onAddIdea: (title: string, description: string) => void;
  loading: boolean;
  error: string | null;
  ideaform: boolean;
  formVisibilityhandler: (item: boolean) => void;
}

export default function AddIdeaForm({
  onAddIdea,
  loading,
  error,
  ideaform,
  formVisibilityhandler,
}: AddIdeaFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setFormError("Title is required.");
      return;
    }
    if (!description.trim()) {
      setFormError("Description is required.");
      return;
    }
    setFormError(null);

    try {
      const prompt = `Correct the spelling and grammar for the following title and longer description of 15 words description:
      Title: ${title}
      Description: ${description}
   
      return it in the format:{
        title: "corrected title",
        description: "abit longer description of 15 words"
        }
      
      `;
      const response = await generate(prompt, { title: "", description: "" });
      const correctedTitle = response[0].title;
      const correctedDescription = response[0].description;

      onAddIdea(correctedTitle, correctedDescription);
      setTitle("");
      setDescription("");
    } catch (error) {
      console.log(error);
      setFormError("Failed to auto-correct title and description.");
    }
  };

  return (
    <div
      className={`w-fit relative grid place-items-center overflow-hidden ${
        loading ? "p-[4px]" : "p-[2px]"
      } rounded-lg`}
    >
      <motion.div
        className={` ${
          ideaform ? "w-[400px] p-6 ring-1 ring-blue-300" : "w-fit px-4 p-2 "
        } bg-white z-10 shadow-[0_0_2px_0_gray]  rounded-lg  relative  max-w-md grid place-items-center gap-2 transition-all ease-in-out overflow-hidden`}
      >
        {" "}
        {ideaform ? (
          <h2 className="text-2xl font-bold  text-center  ">Add New Idea</h2>
        ) : (
          <h2
            onClick={() => formVisibilityhandler(true)}
            className="text-2xl font-bold  text-center cursor-pointer "
          >
            Track new idea
          </h2>
        )}
        <div
          className={`${
            !ideaform ? "h-0 absolute bottom-0 w-0" : "h-fit w-full "
          } grid  z-10  gap-2 transition-all ease-in-out`}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                rows={4}
              />
            </div>
            {formError && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="text-red-500 text-sm"
              >
                {formError}
              </motion.div>
            )}
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="text-red-500 text-sm"
              >
                {error}
              </motion.div>
            )}
            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                {loading ? (
                  <div className="rounded-full flex items-center gap-2">
                    Generating
                    <ThreeDotsWave />
                  </div>
                ) : (
                  "Add Idea"
                )}
              </button>
            </div>
          </form>
          <button
            type="button"
            disabled={loading}
            onClick={() => formVisibilityhandler(false)}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-[0_0_4px_0_black] text-sm font-medium
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
          >
            Cancel
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity }}
        className="w-[400%] h-[400%] rounded-full  bg-gradient-to-r from-blue-800 via-transparent  to-green-600 absolute z-0  "
      ></motion.div>
    </div>
  );
}
