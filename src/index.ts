import express from 'express';
import firebase from 'firebase';
import * as buddyService from './services/BuddyTab';
firebase.initializeApp({
	apiKey: "",
	authDomain: "accountability-app-29b4b.firebaseapp.com",
	databaseURL: "https://accountability-app-29b4b-default-rtdb.firebaseio.com",
	projectId: "accountability-app-29b4b",
	appId: "",
});

var database = firebase.database();
/*database.ref('Users/').get().then(function(name){
	if(name.exists()){
		console.log(name.val())
	}
});*/
const server = express();
const PORT = 8082;
server.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
server.get('/', (req, res) => res.send('Express and Typescript Server'));
server.get('/BuddyTab/getFriends/:username', async (req, res) => {
	const buddyList = await buddyService.getFriendsList(database, req.params.username);
	res.send(buddyList)
})
server.get('/BuddyTab/getIncomingFriends/:username', async(req, res) => {
	const incomingFriends = await buddyService.getIncomingFriends(database, req.params.username)
	res.send(incomingFriends)
})
server.get('/BuddyTab/checkFriendStatus/:user1/:user2', async(req, res) => {
	const friendStatus = await buddyService.getFriendStatus(database, req.params.user1, req.params.user2)
	res.send(friendStatus)
})
server.get('/BuddyTab/makeFriendRequest/:user1/:user2', async(req, res) => {
	const newRequest = await buddyService.addFriendRequest(database, req.params.user1, req.params.user2)
	res.send(newRequest)
})
server.get('/BuddyTab/cancelFriendRequest/:user1/:user2', async(req, res) => {
	const cancelRequest = await buddyService.cancelFriendRequest(database, req.params.user1, req.params.user2)
	res.send(cancelRequest)
})
server.listen(PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${PORT}`)
})