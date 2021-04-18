import { Task } from '../models/tasks.model';
import { v4 as uuidv4 } from 'uuid';

/*
Parameter(s): username, a tasks: {taskName, details, date/time of task, repeat flag}
Returns: the created task object
*/
export async function createTask(db: firebase.default.database.Database, user: string, taskName: string, taskInfo: string,
completeBy: string, completeDay: string, buddies: Array<string> repeatFlag: string, repWeekDay: Array<boolean>) : Promise<Task> {
  //Need to create unique task IDs here
  let repeatOn: boolean = false;
  if(repeatFlag == "1")
    repeatOn = true;
	//let taskBuddies = await getBuddyUsernames(db, user)
  let taskID = uuidv4();
  let taskToAdd: Task = {
    createdBy: user,
    taskName: taskName,
    details: taskInfo,
    completeTime: completeBy,
		completeDay: completeDay,
		buddies: buddies,
    repeat: repeatOn,
		repWeekDay: repWeekDay
  };

  await db.ref("/Tasks").child(taskID).set(taskToAdd);
  console.log(taskToAdd);
  return taskToAdd;
}


/*
 * Given: current user
 * Return: list of the usernames of the current users buddies
*/
export async function getBuddyUsernames(db: firebase.default.database.Database, user: string) {
	let friendsList = await db.ref(`/Users/${user}`).get();
	let friendUsernames: Array<string> = new Array<string>();
	for(const element in friendsList.val()['friends']) {
    let friendUser = friendsList.val()['friends'][element]
		friendUsernames.push(friendUser);
		console.log(friendUsernames);
	}
	console.log(friendUsernames);
	return friendUsernames;
}