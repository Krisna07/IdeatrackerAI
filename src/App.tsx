import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { IdeaCard } from './components/IdeaCard';
import { AddIdeaForm } from './components/AddIdeaForm';
import { Idea, Subtask } from './types';

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
if (!API_KEY) {
  throw new Error('Missing Gemini API key - please add it to .env.local file');
}

const genAI = new GoogleGenerativeAI(API_KEY);

export default function Home() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateSubtasks = async (
    title: string,
    description: string
  ): Promise<Subtask[]> => {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

      const prompt = `Based on the following project idea, generate 6 detailed subtasks. For each subtask, provide both a title and a brief description of what needs to be done. Format your response exactly like this example:

1. Task Title | Brief description explaining what needs to be done
2. Task Title | Brief description explaining what needs to be done
3. Task Title | Brief description explaining what needs to be done
4. Task Title | Brief description explaining what needs to be done
5. Task Title | Brief description explaining what needs to be done
6. Task Title | Brief description explaining what needs to be done

Project Details:
Title: ${title}
Description: ${description}

Please ensure each subtask is specific, actionable, and directly contributes to completing the main idea. Use the project description to inform the detail and scope of each subtask.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      if (!text) {
        throw new Error('No response from Gemini AI');
      }

      const subtasksList = text
        .split('\n')
        .filter((task) => task.trim() && task.match(/^\d+\./))
        .map((task) => {
          const [title, description = ''] = task
            .replace(/^\d+\.\s*/, '')
            .split('|')
            .map((s) => s.trim());

          return {
            id: Date.now() + Math.random(),
            title,
            description,
            completed: false,
          };
        })
        .filter((task) => task.title.length > 0);

      if (subtasksList.length === 0) {
        throw new Error('Failed to parse subtasks from response');
      }

      return subtasksList;
    } catch (error) {
      console.error('Error generating subtasks:', error);
      throw error;
    }
  };

  const addIdea = async (title: string, description: string) => {
    if (!title.trim()) {
      setError('Please enter a title');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const subtasks = await generateSubtasks(title, description);

      const newIdea: Idea = {
        id: Date.now(),
        title,
        description,
        status: 'Not Started',
        progress: 0,
        subtasks,
      };

      setIdeas([...ideas, newIdea]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to generate subtasks'
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
              ? 'Completed'
              : progress === 0
              ? 'Not Started'
              : 'In Progress';

          return { ...idea, subtasks: updatedSubtasks, progress, status };
        }
        return idea;
      })
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        Idea Progress Tracker
      </h1>

      <AddIdeaForm onAddIdea={addIdea} loading={loading} error={error} />

      <AnimatePresence>
        {ideas.map((idea) => (
          <motion.div
            key={idea.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
          >
            <IdeaCard idea={idea} onToggleSubtask={toggleSubtask} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
