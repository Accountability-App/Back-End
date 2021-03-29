export interface Task {
  createdBy: string, //Should be the username of the creator
  taskName: string,
  details: string,
  completeTime,  //Need to specify how to store dates
  //completeDay: string, 
  //buddies: Array<string>,
  repeat: boolean
}
