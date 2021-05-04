import { Task } from '../models/tasks.model';
import { v4 as uuidv4 } from 'uuid';

/*
Parameter(s): username, a tasks: {taskName, details, date/time of task, repeat flag}
Returns: the created task object
*/
export async function createTask(db: firebase.default.database.Database, user: string, taskName: string, taskInfo: string,
completeBy: string, completeDay: string, buddies: Array<string>, repeatFlag: boolean, repWeekDay: Array<boolean>) : Promise<Task> {
  //Need to create unique task IDs here
	
	//let taskBuddies = await getBuddyUsernames(db, user)
  let taskID = uuidv4();
  let taskToAdd: Task = {
    createdBy: user,
    taskName: taskName,
    details: taskInfo,
    completeTime: completeBy,
		completeDay: completeDay,
		buddies: buddies,
    repeat: repeatFlag,
		repWeekDay: repWeekDay
  };
	
	let userRef = await db.ref(`/Users/${user}/tasks`).get();
	let temp = userRef.val();
	if(temp == null) {
		temp = {}
	}
	temp[taskID] = taskID;
	await db.ref("/Users/${user}/tasks").update(temp);  // Should add the task ID in the users JSON, thus allowing easier searching
  
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
	
	let userTasks: UserTasks = {
		taskID: "working"
	}
	
	console.log(friendUsernames);
	return friendUsernames;
}

/*
 * Given: current user
 * Return: list of the tasks that user created
*/
export async function getMyTasks(db: firebase.default.database.Database, user: string) {
	let userData = await db.ref(`/Users/${user}`).get();
	let taskId : Array<string> = new Array<string>();
	for(const element in userData.val()['tasks']) {
		let taskName = userData.val()['tasks'][element];
		taskId.push(taskName);
		console.log(taskId);
	}
	let allTasks : Array<Task> = new Array<Task>();
	
	for(const taskLabel of taskId) {
		console.log(taskLabel);
		let taskData = await db.ref(`/Tasks/${taskLabel}`).get();
		allTasks.push(taskData.val());
		console.log(allTasks);
	}
	console.log(allTasks);
	return allTasks;
}

/*
 * Given: current user
 * Return: list of the tasks that user is a buddy of
*/
export async function getHelpingTasks(db: firebase.default.database.Database, user: string) {
	let allTasks = await db.ref(`/Tasks`).get();
	let helperTasks : Array<Task> = new Array<Task>();
	for(const element in allTasks.val()) {
		let currTask = await db.ref(`/Tasks/${element}`).get();
		for(const el of currTask.val()['buddies']) {
			if(el == user) {
				helperTasks.push(currTask.val())
			}
		}
	}
	console.log(helperTasks);
	return helperTasks;
}
