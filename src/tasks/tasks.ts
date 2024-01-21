import logger from "~/util/log.ts";
import { TransformTaskType } from "./defs.ts";
import AmendAttrsTask  from "./amend-attrs.ts";
import GroupElementsTask from "./group-elements.ts";
import ChangeCaseTask from "./change-case.ts";
import RemoveElementsTask from "./remove-elements.ts";
import MapElementsTask from "./map-elements.ts";

const log = logger(import.meta.url);

const _tasks = [
  AmendAttrsTask,
  GroupElementsTask,
  ChangeCaseTask,
  RemoveElementsTask,
  MapElementsTask
];

const tasks = _tasks.reduce((map, task) => {
  return map.set(task.type, task);
}, new Map<string, TransformTaskType<any>>());

log.info('Available tasks:', tasks);

const getTask = (taskName: string): TransformTaskType<any> => {
  if (!tasks.has(taskName)) {
    throw new Error(`Invalid task: ${taskName}`);
  }

  return tasks.get(taskName);
}

export default getTask;
