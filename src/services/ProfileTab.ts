import * as ProfileModels from '../models/userProfile.model';

/*
Parameter(s): username
Returns: The user's basic profile information {username, firstname, description}
*/
export async function getUserProf(db: firebase.default.database.Database, user:string) : Promise<void> {
  let userInfo = await db.ref(`/Users/${user}`).get();
  let userProf: ProfileModels.UserProfile = {
    username: user,
    firstname: userInfo.val()['firstname'],
    description: userInfo.val()['description']
  }
  console.log(userProf);
  userProf;
}
