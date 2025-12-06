import { useSyncExternalStore } from "react";
import { Project } from "../domain/projectTypes";
import { PlantUmlParseError } from "../plantuml/errors";
import { parsePlantUml } from "../plantuml/parser";
import { serializeProject } from "../plantuml/serializer";

type StoreState = {
  project: Project | null;
  plantUmlText: string;
  parseError: PlantUmlParseError | null;
};

type Store = StoreState & {
  loadFromPlantUml: (text: string) => void;
  updatePlantUmlFromModel: () => string;
  subscribe: (listener: () => void) => () => void;
  listeners: Array<() => void>;
};

const store: Store = {
  project: null,
  plantUmlText: "",
  parseError: null,
  loadFromPlantUml(text: string) {
    try {
      const project = parsePlantUml(text);
      store.project = project;
      store.plantUmlText = text;
      store.parseError = null;
    } catch (error) {
      if (error instanceof PlantUmlParseError) {
        store.parseError = error;
        store.plantUmlText = text;
      } else {
        throw error;
      }
    }
    store.listeners.forEach((listener) => listener());
  },
  updatePlantUmlFromModel() {
    if (!store.project) {
      return "";
    }
    const plantUmlText = serializeProject(store.project);
    store.plantUmlText = plantUmlText;
    store.listeners.forEach((listener) => listener());
    return plantUmlText;
  },
  subscribe(listener: () => void) {
    store.listeners.push(listener);
    return () => {
      store.listeners = store.listeners.filter((item) => item !== listener);
    };
  },
  listeners: [],
};

export function useProjectStore() {
  return useSyncExternalStore(store.subscribe, () => store, () => store);
}
