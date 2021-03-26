import express from 'express';
import firebase from 'firebase';
import * as buddyService from './services/BuddyTab';
import * as profileService from './services/ProfileTab';
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
/*server.get('/BuddyTab/getFriends/:username', (req, res) => {
	buddyService.getFriendsList(database, req.params.username);
})*/
server.get('/ProfileTab/:username', async (req, res) => {
	const userProfile = await profileService.getUserProf(database, req.params.username);
	res.send(userProfile);
})
server.listen(PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${PORT}`)
})
