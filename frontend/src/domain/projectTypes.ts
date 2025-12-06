export interface Dependency {
  fromId: string;
  toId: string;
}

export interface Task {
  id: string;
  name: string;
  start?: string;
  end?: string;
  durationDays: number;
  order: number;
  parentId?: string;
  dependencies: string[];
  isGroup?: boolean;
  isMilestone?: boolean;
}

export interface Project {
  id: string;
  name: string;
  calendarStart: string;
  tasks: Task[];
}
