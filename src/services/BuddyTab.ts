import { FriendRequest, PendingFriends, UserBuddies, UserProfileSearch } from '../models/userAccount.model';


//figure out how to store friend requests and user

/*
 *Determine if the second user exists
 *
 * 
 */
async function checkUsers(db: firebase.default.database.Database, user1: string, user2?:string):Promise<string> {
    let checkuser = await db.ref(`/Users/${user1}`).get()
    if (checkuser.val() === null) {
        return `${user1} does not exist`
    }
    if (user2 !== null) {
        checkuser = await db.ref(`/Users/${user2}`).get()
        if (checkuser.val() === null) {
            return `${user2} does not exist`
        }
    }
    return "Users exist"
}


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
    console.log(pendingFriendsList.val(), username)
    for (const element in pendingFriendsList.val()) {
        let pendingRequest = pendingFriendsList.val()[element]['fromUser']
        console.log(pendingRequest);
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
    let response: UserProfileSearch
    if ((await checkUsers(db, user1, user2)).includes("does not exist")) {
        response = {
            username: "",
            givenName: "",
            familyName: "",
            friendStatus: -1
        }
        return response
    }
    for (const element in friendsList.val()['friends']) {
        if (element === user2) {
            let thatFriend = await db.ref(`/Users/${user2}`).get()
            response = {
                username: user2,
                givenName: thatFriend.val()['firstname'],
                familyName: thatFriend.val()['lastname'],
                friendStatus: 1
            }
            console.log(response)
            return response
        }
    }
    let pendingFriendsList = await db.ref('/FriendReqs').orderByChild('toUser').equalTo(user1).get()
    for (const element in pendingFriendsList.val()) {
        areFriends = (pendingFriendsList.val()[element]['fromUser'].indexOf(user2) >= 0)
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
        areFriends = (pendingFriendsList.val()[element]['toUser'].indexOf(user2) >= 0)
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
    let thatFriend = await db.ref(`/Users/${user2}`).get()
    try {
        response = {
            username: user2,
            givenName: thatFriend.val()['firstname'],
            familyName: thatFriend.val()['lastname'],
            friendStatus: 0
        }
        return response
    } catch {
        response = {
            username: "",
            givenName: "",
            familyName: "",
            friendStatus: -1
        }
        return response
    }
    
}


 /*
  * Given: two users
  * During: authenticate first user, add friend request from first person to second person
  * Return: HTTP Status indicating success/failure
  */
export async function addFriendRequest(db: firebase.default.database.Database, user1: string, user2: string): Promise<string> {
    // validate the two users exist
    try {
    let areFriends = false
    let existReqs = await db.ref(`/FriendReqs`).orderByChild('fromUser').equalTo(user2).get()
    if (existReqs.val() !== null) {
        for (const element in existReqs.val()) {
            console.log(existReqs.val())
            areFriends = (existReqs.val()[element]['toUser'] == user1)
            if (areFriends) {
                return `Pending request from ${user2}`
            }
        }
    }
    existReqs = await db.ref(`/FriendReqs`).orderByChild('toUser').equalTo(user2).get()
    if (existReqs.val() !== null) {
        console.log(existReqs.val())
        for (const element in existReqs.val()) {
            console.log(element)
            console.log(existReqs.val()[element])
            areFriends = (existReqs.val()[element]['fromUser'] == user1)
            if (areFriends) {
                return `Pending request to ${user2}`
            }
        }
    }
    let newFriendReq: FriendRequest = {
        fromUser: user1,
        toUser: user2
    }
    await db.ref(`/FriendReqs/${user1}${user2}`).update(newFriendReq)
    return `Added friend request to ${user2}`
    } catch(e) {
        console.log(e)
        return "FAILED"
    }
}


  /*
   * Given: two users
   * During: authenticate first user, if a request exists from the first user to the second, cancel the request
   * Return: HTTP Status indicating success/failure
   */
export async function cancelFriendRequest(db: firebase.default.database.Database, user1: string, user2: string): Promise<string> {
    let friendReq = await db.ref(`/FriendReqs/${user1}${user2}`).get()
    if (friendReq.val() !== null) {
        db.ref(`/FriendReqs/${user1}${user2}/toUser`).remove()
        db.ref(`/FriendReqs/${user1}${user2}/fromUser`).remove()
        db.ref(`/FriendReqs/${user1}${user2}`).remove()
        return `Deleted request from ${user1} to ${user2}`
    }
    return `No request from ${user1} to ${user2}`
}

/*
* Given: two users, accept/decline
* During: authenticate first user, accept or decline friend request to the first user from the second user
* Return: HTTP Status indicating success/failure
*/
export async function respondToFriendRequest(db: firebase.default.database.Database, user1: string, user2: string, action: string): Promise<string> {
    let friendReq = await db.ref(`/FriendReqs/${user2}${user1}`).get()
    console.log(friendReq.val())
    if (friendReq.val() !== null) {
        if (action === "Accept") {
            // clean up the friend requests
            db.ref(`/FriendReqs/${user2}${user1}/toUser`).remove()
            db.ref(`/FriendReqs/${user2}${user1}/fromUser`).remove()
            db.ref(`/FriendReqs/${user2}${user1}`).remove()

            let userRef = await db.ref(`/Users/${user1}/friends`).get()
            let temp = userRef.val()
            if (temp === null) {
                temp = {}
            }
            console.log(temp)
            temp[user2] = user2;
            await db.ref(`/Users/${user1}/friends`).update(temp)

            userRef = await db.ref(`/Users/${user2}/friends`).get()
            temp = userRef.val()
            console.log(temp)
            if (temp === null) {
                temp = {}
            }
            // fix adding this element here
            temp[user1] = user1;
            await db.ref(`/Users/${user2}/friends`).update(temp)

            return `Accepted friend request from ${user2}`
        } else {
            // clean up the friend requests
            db.ref(`/FriendReqs/${user2}${user1}/toUser`).remove()
            db.ref(`/FriendReqs/${user2}${user1}/fromUser`).remove()
            db.ref(`/FriendReqs/${user2}${user1}`).remove()

            return `Declined friend request from ${user2}`
        }
    } 
    return `No friend request from ${user2}`
}

/*
 * Given: two users
 * During: unfriends the users
 * Return: Http Status indicating success/failure
 */

export async function removeFriend(db: firebase.default.database.Database, user1: string, user2: string): Promise<string> {
    await db.ref(`/Users/${user1}/friends/${user2}`).remove()
    await db.ref(`/Users/${user2}/friends/${user1}`).remove()
    // fix adding this element here
    return `Removed friends state between ${user1} and ${user2}`
}