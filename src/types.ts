export interface Subtask {
  id: string;

  ideaId: string;

  title: string;

  description: string;

  dueDate: Date;

  completed: boolean;
  breakdown?: string | null;
}

export interface Idea {
  id: string;
  title: string;
  description: string;
  status: "Not Started" | "In Progress" | "Completed";
  progress: number;
  dateCreated?: Date;
  subtasks: Subtask[];
}

export interface Breakdown {
  details: string;
}
