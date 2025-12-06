import { Project, Task } from "../domain/projectTypes";
import { PlantUmlParseError } from "./errors";

const DATE_REGEX = /\d{4}-\d{2}-\d{2}/;
const TASK_REGEX = /^task\s+"(?<name>[^"]+)"\s+as\s+\[(?<id>[^\]]+)\](?:\s+(?<rest>.*))?$/i;
const MILESTONE_REGEX = /^milestone\s+"(?<name>[^"]+)"\s+as\s+\[(?<id>[^\]]+)\]\s+happens\s+at\s+(?<date>\d{4}-\d{2}-\d{2})$/i;
const DEP_REGEX = /^\[(?<from>[^\]]+)\]\s*-->\s*\[(?<to>[^\]]+)\]$/;
const GROUP_REGEX = /^--\s*(?<name>.+?)\s*--$/;
const START_TOKEN = "@startgantt";
const END_TOKEN = "@endgantt";

function normalizeDateString(date: string): string {
  if (!DATE_REGEX.test(date)) {
    throw new PlantUmlParseError(0, `Invalid date format: ${date}`, "validation");
  }
  return date;
}

function addDays(start: string, days: number): string {
  const startDate = new Date(start);
  const result = new Date(startDate.getTime());
  result.setDate(result.getDate() + days);
  return result.toISOString().slice(0, 10);
}

function diffDays(start: string, end: string): number {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diff = endDate.getTime() - startDate.getTime();
  return Math.max(0, Math.round(diff / (1000 * 60 * 60 * 24)));
}

function ensureIdValid(id: string, lineNumber: number) {
  if (!/^[-\w]+$/.test(id)) {
    throw new PlantUmlParseError(lineNumber, `Invalid ID: [${id}]`, "validation");
  }
}

function computeStartAndEnd(
  projectStart: string,
  start: string | undefined,
  end: string | undefined,
  durationDays: number
): { start: string; end: string; durationDays: number } {
  let finalStart = start ?? projectStart;
  let finalEnd = end;
  let finalDuration = durationDays;

  if (start && end) {
    finalDuration = diffDays(start, end);
  }

  if (!finalEnd) {
    finalEnd = addDays(finalStart, durationDays);
  }

  return { start: finalStart, end: finalEnd, durationDays: finalDuration };
}

export function parsePlantUml(text: string): Project {
  const lines = text.split(/\r?\n/);
  const startIndex = lines.findIndex((line) => line.trim().toLowerCase() === START_TOKEN);
  if (startIndex === -1) {
    throw new PlantUmlParseError(1, "Missing @startgantt", "syntax");
  }

  const endIndex = lines.findIndex((line) => line.trim().toLowerCase() === END_TOKEN);
  if (endIndex === -1 || endIndex < startIndex) {
    throw new PlantUmlParseError(lines.length, "Missing @endgantt", "syntax");
  }

  const contentLines = lines.slice(startIndex + 1, endIndex);
  let projectStart = new Date().toISOString().slice(0, 10);

  const project: Project = {
    id: "project-1",
    name: "Project",
    calendarStart: projectStart,
    tasks: [],
  };

  const dependencyPairs: Array<{ from: string; to: string; line: number }> = [];
  const groupStack: string[] = [];
  let orderCounter = 0;

  contentLines.forEach((rawLine, index) => {
    const lineNumber = startIndex + 2 + index;
    const line = rawLine.trim();
    if (!line) return;

    if (/^Project\s+starts\s+/i.test(line)) {
      const dateMatch = line.match(/Project\s+starts\s+(?<date>\d{4}-\d{2}-\d{2})/i);
      if (!dateMatch?.groups?.date) {
        throw new PlantUmlParseError(lineNumber, "Project start date is missing", "syntax");
      }
      projectStart = normalizeDateString(dateMatch.groups.date);
      project.calendarStart = projectStart;
      return;
    }

    const groupMatch = line.match(GROUP_REGEX);
    if (groupMatch) {
      const groupName = groupMatch.groups?.name?.trim();
      if (groupName?.toLowerCase() === "end") {
        groupStack.pop();
        return;
      }
      if (!groupName) {
        throw new PlantUmlParseError(lineNumber, "Group name is empty", "syntax");
      }
      const groupTask: Task = {
        id: `group-${orderCounter + 1}`,
        name: groupName,
        durationDays: 0,
        order: orderCounter,
        parentId: groupStack[groupStack.length - 1],
        dependencies: [],
        isGroup: true,
      };
      project.tasks.push(groupTask);
      groupStack.push(groupTask.id);
      orderCounter += 1;
      return;
    }

    const milestoneMatch = line.match(MILESTONE_REGEX);
    if (milestoneMatch?.groups) {
      const { name, id, date } = milestoneMatch.groups as { name: string; id: string; date: string };
      ensureIdValid(id, lineNumber);
      const normalizedDate = normalizeDateString(date);
      const milestone: Task = {
        id,
        name,
        start: normalizedDate,
        end: normalizedDate,
        durationDays: 0,
        order: orderCounter,
        parentId: groupStack[groupStack.length - 1],
        dependencies: [],
        isMilestone: true,
      };
      project.tasks.push(milestone);
      orderCounter += 1;
      return;
    }

    const taskMatch = line.match(TASK_REGEX);
    if (taskMatch?.groups) {
      const { name, id, rest } = taskMatch.groups as { name: string; id: string; rest?: string };
      ensureIdValid(id, lineNumber);
      let start: string | undefined;
      let end: string | undefined;
      let durationDays: number | undefined;

      if (rest) {
        const startsMatch = rest.match(/starts\s+(?<start>\d{4}-\d{2}-\d{2})/i);
        const endsMatch = rest.match(/ends\s+(?<end>\d{4}-\d{2}-\d{2})/i);
        const lastsMatch = rest.match(/lasts\s+(?<duration>\d+)\s+days?/i);

        if (startsMatch?.groups?.start) {
          start = normalizeDateString(startsMatch.groups.start);
        }
        if (endsMatch?.groups?.end) {
          end = normalizeDateString(endsMatch.groups.end);
        }
        if (lastsMatch?.groups?.duration) {
          durationDays = Number(lastsMatch.groups.duration);
        }
      }

      if (!durationDays && !start && !end) {
        throw new PlantUmlParseError(
          lineNumber,
          "Task must include start/end dates or duration",
          "validation"
        );
      }

      const computed = computeStartAndEnd(projectStart, start, end, durationDays ?? 0);

      const task: Task = {
        id,
        name,
        start: computed.start,
        end: computed.end,
        durationDays: computed.durationDays,
        order: orderCounter,
        parentId: groupStack[groupStack.length - 1],
        dependencies: [],
      };
      project.tasks.push(task);
      orderCounter += 1;
      return;
    }

    const depMatch = line.match(DEP_REGEX);
    if (depMatch?.groups) {
      dependencyPairs.push({ from: depMatch.groups.from, to: depMatch.groups.to, line: lineNumber });
      return;
    }

    throw new PlantUmlParseError(lineNumber, `Unrecognized line: ${line}`, "syntax");
  });

  const taskIds = new Set(project.tasks.map((task) => task.id));
  dependencyPairs.forEach((pair) => {
    if (!taskIds.has(pair.from) || !taskIds.has(pair.to)) {
      throw new PlantUmlParseError(pair.line, "Dependency references unknown task", "semantic");
    }
    const targetTask = project.tasks.find((task) => task.id === pair.to);
    if (targetTask) {
      targetTask.dependencies.push(pair.from);
    }
  });

  return project;
}
