import { FriendRequest, PendingFriends, UserBuddies, UserProfileSearch } from '../models/userAccount.model';


//figure out how to store friend requests and user

/*
 * Given: a user name
 * During: authenticate they're the logged in user
 * Return: a list of friends (first, last, username)
 */
export async function getFriendsList(db: firebase.default.database.Database, user: string) : Promise<UserBuddies[]> {
    let friendsList = await db.ref(`/Users/${user}`).get();
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
export async function getIncomingFriends(db: firebase.default.database.Database, username: string): Promise<PendingFriends[]> {
    let pendingFriendsList = await db.ref('/FriendReqs').orderByChild('toUser').equalTo(username).get()
    let pendingData: Array<PendingFriends> = new Array<PendingFriends>();
    for (const element in pendingFriendsList.val()) {
        let pendingRequest = pendingFriendsList.val()[element]['fromUser']
        let pendingFriend = await db.ref(`/Users/${pendingRequest}`).get();
        let newPendingFriend: PendingFriends = {
            username: pendingRequest,
            givenName: pendingFriend.val()['firstname'],
            familyName: pendingFriend.val()['lastname']
        }
        pendingData.push(newPendingFriend)
    }
    return pendingData
}


/*
 * Given: a logged in username and another persons username
 * During: authenticate user (can be any level of friendship with other user)
 * Return: first, last, username, friend status between users
 */
export async function getFriendStatus(db: firebase.default.database.Database, user1: string, user2: string) {
    let friendsList = await db.ref(`/Users/${user1}`).get()
    let areFriends
    areFriends = (friendsList.val()['friends'].indexOf(user2) >= 0)
    let response: UserProfileSearch
    if (areFriends) {
        let thatFriend = await db.ref(`/Users/${user2}`).get()
        response = {
            username: user2,
            givenName: thatFriend.val()['firstname'],
            familyName: thatFriend.val()['lastname'],
            friendStatus: 1
        }
        return response
    } else {
        let pendingFriendsList = await db.ref('/FriendReqs').orderByChild('toUser').equalTo(user1).get()
        for (const element in pendingFriendsList.val()) {
            areFriends = (friendsList.val()[element]['fromUser'].indexOf(user2) >= 0)
            if (areFriends) {
                let thatFriend = await db.ref(`/Users/${user2}`).get()
                response = {
                    username: user2,
                    givenName: thatFriend.val()['firstname'],
                    familyName: thatFriend.val()['lastname'],
                    friendStatus: 2
                }
                return response
            }
        }
        pendingFriendsList = await db.ref('/FriendReqs').orderByChild('fromUser').equalTo(user1).get()
        for (const element in pendingFriendsList.val()) {
            areFriends = (friendsList.val()[element]['toUser'].indexOf(user2) >= 0)
            if (areFriends) {
                let thatFriend = await db.ref(`/Users/${user2}`).get()
                response = {
                    username: user2,
                    givenName: thatFriend.val()['firstname'],
                    familyName: thatFriend.val()['lastname'],
                    friendStatus: 3
                }
                return response
            }
        }
    }
    let thatFriend = await db.ref(`/Users/${user2}`).get()
    response = {
        username: user2,
        givenName: thatFriend.val()['firstname'],
        familyName: thatFriend.val()['lastname'],
        friendStatus: 0
    }
    return response
    
}


 /*
  * Given: two users
  * During: authenticate first user, add friend request from first person to second person
  * Return: HTTP Status indicating success/failure
  */
export async function addFriendRequest(db: firebase.default.database.Database, user1: string, user2: string): Promise<string> {
    let areFriends = false
    let existReqs = await db.ref('/FriendReqs').orderByChild('toUser').equalTo(user1).get()
    for (const element in existReqs.val()) {
        console.log(element)
        console.log(existReqs.val()[element])
        areFriends = (existReqs.val()[element]['fromUser'].indexOf(user2) >= 0)
        if (areFriends) {
            return `Pending request from ${user2}`
        }
    }
    existReqs = await db.ref('/FriendReqs').orderByChild('fromUser').equalTo(user1).get()
    for (const element in existReqs.val()) {
        areFriends = (existReqs.val()[element]['toUser'].indexOf(user2) >= 0)
        if (areFriends) {
            return `Pending request to ${user2}`
        }
    }
    let newFriendReq: FriendRequest = {
        fromUser: user1,
        toUser: user2
    }
    await (await db.ref(`/FriendReqs/${user1}${user2}`).push()).set(newFriendReq)
    return `Added friend request to ${user2}`
}


  /*
   * Given: two users
   * During: authenticate first user, if a request exists from the first user to the second, cancel the request
   * Return: HTTP Status indicating success/failure
   */
/*export async function cancelFriendRequest(db: firebase.default.database.Database, user1: string, user2: string): Promise<string> {
    let friendReq = await db.ref(`/FriendReqs/${user1}${user2}`).get()
    if (friendReq.val().length >= 1) {
        db.ref(`/FriendReqs/${user1}${user2}`)
    }
}*/

  /*
   * Given: two users, accept/decline
   * During: authenticate first user, accept or decline friend request to the first user from the second user
   * Return: HTTP Status indicating success/failure
   */

/*
 * Given: two users
 * During: unfriends the users
 * Return: Http Status indicating success/failure
 */