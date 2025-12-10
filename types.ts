export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

// Convex-like document types
export interface Project {
  _id: string;
  _creationTime: number;
  name: string;
  description: string;
}

export interface Task {
  _id: string;
  _creationTime: number;
  projectId: string;
  title: string;
  status: TaskStatus;
}

export interface ChatMessage {
  _id: string;
  _creationTime: number;
  projectId: string;
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}
