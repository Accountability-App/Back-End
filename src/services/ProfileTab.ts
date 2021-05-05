import { UserProfile } from '../models/userProfile.model';

/*
Parameter(s): username
Returns: The user's basic profile information {username, firstname, description}
*/
export async function getUserProf(db: firebase.default.database.Database, user:string) : Promise<UserProfile> {
  let userInfo = await db.ref(`/Users/${user}`).get();
  let userProf: UserProfile = {
    username: user,
    firstname: userInfo.val()['firstname'],
    description: userInfo.val()['description']
  }
  console.log(userProf);
  return userProf;
}

/*
Parameter(s): old username, new username
Returns: Boolean of whether it failed/worked
*/
/*
export async function updateUsern(db: firebase.default.database.Database, user: string, newName: string) : Promise<string> {
  let exists = await db.ref(`/Users/${user}`).get();
  if(exists)
    return {"username": user}
  else
    await db.ref('/users/${user}').update()
    return {"username": newName}
}
*/

/*
Parameter(s): old username, new username
Returns: Boolean of whether it failed/worked
*/
export async function updateDescription(db: firebase.default.database.Database, user: string, description: string) {
  db.ref(`/Users/${user}`).update({"description": description})
  return "Description Updated"
}
