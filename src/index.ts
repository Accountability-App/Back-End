import express from 'express';
import firebase from 'firebase';
import { type } from 'node:os';
import * as buddyService from './services/BuddyTab';
import * as profileService from './services/ProfileTab';
import * as taskService from './services/TaskTab';
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
server.use(express.json());
const PORT = 8082;
server.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});
server.get('/', (req, res) => res.send('Express and Typescript Server'));
server.get('/ProfileTab/:username', async (req, res) => {
	const userProfile = await profileService.getUserProf(database, req.params.username);
	res.send(userProfile);
})
server.get('/ProfileTab/updateDesc/:username/:saveDescription', async (req, res) => {
	const updateStatus = await profileService.updateDescription(database, req.params.username, req.params.saveDescription);
	res.send(updateStatus);
})
server.post('/TaskTab/createTask', async (req, res) => {
	let task = req.body;
	const newTask = await taskService.createTask(database, task.createdBy, task.taskName, task.details, task.completeTime, task.completeDay, task.buddies, task.repeat, task.repWeekDay);
	
	res.send(newTask);
})
server.get('/TaskTab/getBuddyUsername/:user', async (req, res) => {
  const getBuddies = await taskService.getBuddyUsernames(database, req.params.user);
	res.send(getBuddies);
})
server.get('/TaskTab/getMyTasks/:user', async (req, res) => {
	const getTasks = await taskService.getMyTasks(database, req.params.user);
	res.send(getTasks);
})
server.get('/TaskTab/getHelpingTasks/:user', async (req, res) => {
	const getHelpTasks = await taskService.getHelpingTasks(database, req.params.user);
	res.send(getHelpTasks);
})
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
server.get('/BuddyTab/respondToFriendRequest/:user1/:user2/:action', async(req, res) => {
	const respondRequest = await buddyService.respondToFriendRequest(database, req.params.user1, req.params.user2, req.params.action)
	res.send(respondRequest)
})
server.get('/BuddyTab/removeFriend/:user1/:user2', async(req, res) => {
	const removeFriend = await buddyService.removeFriend(database, req.params.user1, req.params.user2)
	res.send(removeFriend)
})

server.listen(PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${PORT}`)
})
