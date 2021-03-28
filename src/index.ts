import express from 'express';
import firebase from 'firebase';
import * as buddyService from './services/BuddyTab';
import * as profileService from './services/ProfileTab';
import * as taskService from './services/TaskTab';
firebase.initializeApp({
	apiKey: "AIzaSyC-LNcsyrnk4JavlEXUVhfJCOQTs6yXcJY",
	authDomain: "accountability-app-29b4b.firebaseapp.com",
	databaseURL: "https://accountability-app-29b4b-default-rtdb.firebaseio.com",
	projectId: "accountability-app-29b4b",
	appId: "1:514146284743:web:c6b30b0e7ea61958433ae2",
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
/*server.get('/BuddyTab/getFriends/:username', (req, res) => {
	buddyService.getFriendsList(database, req.params.username);
})*/
server.get('/ProfileTab/:username', async (req, res) => {
	const userProfile = await profileService.getUserProf(database, req.params.username);
	res.send(userProfile);
})
server.get('/TaskTab/createTask/:user/:task/:info/:completeTime/:rep', async (req, res) => {
  const newTask = await taskService.createTask(database, req.params.user, req.params.task, req.params.info, req.params.completeTime, req.params.rep);
	res.send(newTask);
})

server.listen(PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${PORT}`)
})
