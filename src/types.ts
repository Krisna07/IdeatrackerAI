export interface Subtask {
  id: number;
  ideaId: number;
  title: string;
  completed: boolean;
  description: string;
  breakdown?: string | null;
}

export interface Idea {
  id: number;
  title: string;
  description: string;
  status: "Not Started" | "In Progress" | "Completed";
  progress: number;
  subtasks: Subtask[];
}

export interface Breakdown {
  details: string;
}
