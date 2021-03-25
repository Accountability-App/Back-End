import { UserBuddies } from '../models/userAccount.model';


//figure out how to store friend requests and user

/*
 * Given: a user name
 * During: authenticate they're the logged in user
 * Return: a list of friends (first, last, username)
 */
export async function getFriendsList(db: firebase.default.database.Database, user: string) : Promise<UserBuddies[]> {
    //console.log(user);
    let friendsList = await db.ref(`/Users/${user}`).get();
    //console.log(friendsList.val())
    //console.log(typeof friendsList.val())
    //console.log(friendsList.val()['friends']);
    let friendsData: Array<UserBuddies> = new Array<UserBuddies>();
    for(const element in friendsList.val()['friends']) {
        let friendUser = friendsList.val()['friends'][element]
        let newFriendData = await db.ref(`/Users/${friendUser}`).get();
        let newFriendUser: UserBuddies = {
            username: friendUser,
            givenName: newFriendData.val()['firstname'],
            familyName: newFriendData.val()['lastname']
        }
        friendsData.push(newFriendUser)
        console.log(friendsData)
    }
    console.log(friendsData)
    return friendsData
}

/*
 * Given: a user name
 * During: authenticate user
 * Return: a list of users that have sent friend requests
 *           to a given username (first, last, username)
 * 
 */


/*
 * Given: a logged in username and another persons username
 * During: authenticate user (can be any level of friendship with other user)
 * Return: first, last, username, friend status between users
 */


 /*
  * Given: two users
  * During: authenticate first user, add friend request from first person to second person
  * Return: HTTP Status indicating success/failure
  */


  /*
   * Given: two users
   * During: authenticate first user, if a request exists from the first user to the second, cancel the request
   * Return: HTTP Status indicating success/failure
   */


  /*
   * Given: two users, accept/decline
   * During: authenticate first user, accept or decline friend request to the first user from the second user
   * Return: HTTP Status indicating success/failure
   */