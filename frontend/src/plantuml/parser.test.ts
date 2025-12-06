/// <reference types="vitest" />

import { describe, expect, it, vi } from "vitest";
import { parsePlantUml } from "./parser";
import { serializeProject } from "./serializer";
import { PlantUmlParseError } from "./errors";

const baseHeader = "@startgantt\n";
const baseFooter = "\n@endgantt";

function buildDocument(body: string) {
  return `${baseHeader}${body}${baseFooter}`;
}

describe("parsePlantUml header", () => {
  it("falls back to current date when Project starts is missing", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-05-05T00:00:00Z"));
    const text = buildDocument('task "One" as [T1] lasts 2 days');
    const project = parsePlantUml(text);
    expect(project.calendarStart).toBe("2024-05-05");
    vi.useRealTimers();
  });
});

describe("task parsing", () => {
  const header = "@startgantt\nProject starts 2024-01-01\n";
  const footer = "\n@endgantt";

  it("parses durations and computes dates", () => {
    const text = `${header}task "Build" as [T1] lasts 5 days${footer}`;
    const project = parsePlantUml(text);
    const task = project.tasks[0];
    expect(task.start).toBe("2024-01-01");
    expect(task.end).toBe("2024-01-06");
    expect(task.durationDays).toBe(5);
  });

  it("prefers dates when both dates and duration are present", () => {
    const text = `${header}task "Plan" as [T2] starts 2024-01-10 ends 2024-01-12 lasts 10 days${footer}`;
    const project = parsePlantUml(text);
    const task = project.tasks[0];
    expect(task.start).toBe("2024-01-10");
    expect(task.end).toBe("2024-01-12");
    expect(task.durationDays).toBe(2);
  });

  it("throws validation error for missing duration and dates", () => {
    const text = `${header}task "No Dates" as [T3]${footer}`;
    expect(() => parsePlantUml(text)).toThrow(PlantUmlParseError);
  });
});

describe("milestones, groups and dependencies", () => {
  const body = [
    "Project starts 2024-03-01",
    "-- Phase 1 --",
    'task "Design" as [T1] lasts 2 days',
    'task "Dev" as [T2] lasts 4 days',
    "-- end --",
    'milestone "Launch" as [M1] happens at 2024-03-10',
    "[T1] --> [T2]",
    "[T2] --> [M1]",
  ].join("\n");

  it("sets group parent relationships and flags", () => {
    const project = parsePlantUml(buildDocument(body));
    const [group, task1, task2, milestone] = project.tasks;
    expect(group.isGroup).toBe(true);
    expect(task1.parentId).toBe(group.id);
    expect(task2.parentId).toBe(group.id);
    expect(milestone.isMilestone).toBe(true);
    expect(milestone.durationDays).toBe(0);
  });

  it("applies dependencies to targets", () => {
    const project = parsePlantUml(buildDocument(body));
    const design = project.tasks.find((task) => task.id === "T1");
    const dev = project.tasks.find((task) => task.id === "T2");
    const milestone = project.tasks.find((task) => task.id === "M1");
    expect(design?.dependencies).toEqual([]);
    expect(dev?.dependencies).toEqual(["T1"]);
    expect(milestone?.dependencies).toEqual(["T2"]);
  });
});

describe("serialization", () => {
  it("round-trips through serializer and parser", () => {
    const text = buildDocument(
      [
        "Project starts 2024-06-01",
        'task "Alpha" as [A1] lasts 3 days',
        'task "Beta" as [B1] starts 2024-06-05 ends 2024-06-06',
        "[A1] --> [B1]",
      ].join("\n")
    );
    const parsed = parsePlantUml(text);
    const serialized = serializeProject(parsed);
    const reparsed = parsePlantUml(serialized);
    expect(reparsed.tasks.length).toBe(parsed.tasks.length);
    expect(reparsed.tasks[0].name).toBe("Alpha");
    expect(reparsed.tasks[1].dependencies).toEqual(["A1"]);
  });
});
