import { Project, Task } from "../domain/projectTypes";

function formatTaskLine(task: Task): string {
  if (task.isMilestone) {
    return `milestone "${task.name}" as [${task.id}] happens at ${task.start ?? task.end}`;
  }

  const base = `task "${task.name}" as [${task.id}]`;
  if (task.start && task.end) {
    return `${base} starts ${task.start} ends ${task.end}`;
  }
  return `${base} lasts ${task.durationDays} days`;
}

function sortTasks(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => a.order - b.order);
}

function serializeTaskBlock(tasks: Task[], parentId?: string, lines: string[] = []): string[] {
  const children = sortTasks(tasks.filter((task) => task.parentId === parentId));

  children.forEach((task) => {
    if (task.isGroup) {
      lines.push(`-- ${task.name} --`);
      serializeTaskBlock(tasks, task.id, lines);
      lines.push("-- end --");
    } else {
      lines.push(formatTaskLine(task));
    }
  });

  return lines;
}

export function serializeProject(project: Project): string {
  const lines: string[] = [];
  lines.push("@startgantt");
  lines.push(`Project starts ${project.calendarStart}`);

  serializeTaskBlock(project.tasks, undefined, lines);

  const dependencies: string[] = [];
  project.tasks.forEach((task) => {
    task.dependencies.forEach((depId) => {
      dependencies.push(`[${depId}] --> [${task.id}]`);
    });
  });

  lines.push(...dependencies);
  lines.push("@endgantt");
  return lines.join("\n");
}
