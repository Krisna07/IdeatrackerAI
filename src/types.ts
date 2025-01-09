export interface Subtask {
  id: number;
  title: string;
  completed: boolean;
  description: string;
}

export interface Idea {
  id: number;
  title: string;
  description: string;
  status: 'Not Started' | 'In Progress' | 'Completed';
  progress: number;
  subtasks: Subtask[];
}
