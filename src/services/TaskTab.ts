import { Task } from '../models/tasks.model';
import { v4 as uuidv4 } from 'uuid';

/*
Parameter(s): username, a tasks: {taskName, details, date/time of task, repeat flag}
Returns: the created task object
*/
export async function createTask(db: firebase.default.database.Database, user: string, taskName: string, taskInfo: string, completeBy: string, repeatFlag: string) : Promise<Task> {
  //Need to create unique task IDs here
  let repeatOn: boolean = false;
  if(repeatFlag == "1")
    repeatOn = true;
  let taskID = uuidv4();
  let taskToAdd: Task = {
    createdBy: user,
    taskName: taskName,
    details: taskInfo,
    completeTime: completeBy,
    repeat: repeatOn
  };

  await db.ref("/Tasks").child(taskID).set(taskToAdd);
  console.log(taskToAdd);
  return taskToAdd;
}
