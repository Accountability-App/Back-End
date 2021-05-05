export interface Task {
  createdBy: string, //Should be the username of the creator
  taskName: string,
  details: string,
  completeTime: string,  //Need to specify how to store dates
  completeDay: string, 
  buddies: Array<string>,
  repeat: boolean,
	repWeekDay: Array<boolean>
}

/*  model for the stringify for posting tasks
{
	"task": {
		createdBy: string,
		taskName: string,
		details: string,
		completeTime: string,  
		completeDay: string, 
		buddies: Array<string>,
		repeat: boolean,
		repWeekDay: Array<boolean>
	}
}
*/