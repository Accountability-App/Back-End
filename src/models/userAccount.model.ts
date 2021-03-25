export interface UserAccount {
    userID: string,
    username: string,
    givenName: string,
    familyName: string,
    email: string,
    //birthdate: , //what type?
    friends: Array<string>,
    tasks: Array<BigInt>
}

export interface UserBuddies {
    username: string,
    givenName: string,
    familyName: string
}

export interface PendingFriends {
    username: string,
    givenName: string,
    familyName: string
}

export interface UserProfileSearch {
    username: string,
    givenName: string,
    familyName: string,
    friendStatus: number
}

export interface FriendRequestStatus {
    "0" : string = "notFriends,
    "ISentRequest" : string,
    "TheySentRequest" : string,
    "Friends" : string,
}