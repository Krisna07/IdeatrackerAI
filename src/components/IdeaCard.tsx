import { motion } from 'framer-motion'
import { Idea } from '../types'

interface IdeaCardProps {
  idea: Idea
  onToggleSubtask: (ideaId: number, subtaskId: number) => void
}

export function IdeaCard({ idea, onToggleSubtask }: IdeaCardProps) {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
      <h3 className="text-2xl font-semibold mb-2">{idea.title}</h3>
      <p className="text-gray-600 mb-4">{idea.description}</p>

      <div className="mb-4">
        <h4 className="text-lg font-semibold mb-2">Subtasks:</h4>
        {idea.subtasks.map((subtask) => (
          <motion.div
            key={subtask.id}
            className="flex items-start mb-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <input
              type="checkbox"
              checked={subtask.completed}
              onChange={() => onToggleSubtask(idea.id, subtask.id)}
              className="mt-1 mr-2"
            />
            <div>
              <span className={`font-medium ${subtask.completed ? 'line-through text-gray-400' : ''}`}>
                {subtask.title}
              </span>
              {subtask.description && (
                <p className="text-sm text-gray-500 mt-1">{subtask.description}</p>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <span
          className={`px-2 py-1 rounded text-sm font-semibold ${
            idea.status === 'Completed'
              ? 'bg-green-200 text-green-800'
              : idea.status === 'In Progress'
              ? 'bg-yellow-200 text-yellow-800'
              : 'bg-gray-200 text-gray-800'
          }`}
        >
          {idea.status}
        </span>
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
      </div>
    </div>
  )
}

