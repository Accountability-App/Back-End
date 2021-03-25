import express from 'express';
import firebase from 'firebase';
import * as buddyService from './services/BuddyTab';
firebase.initializeApp({
	apiKey: "AIzaSyBuZj5uAT7srhb4PH4lUFympENp8xynvV8",
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
server.get('/', (req, res) => res.send('Express and Typescript Server'));
server.get('/BuddyTab/getFriends/:username', (req, res) => {
	buddyService.getFriendsList(database, req.params.username);
})
server.listen(PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${PORT}`)
})