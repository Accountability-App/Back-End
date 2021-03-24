import express from 'express';
import firebase from 'firebase';
firebase.initializeApp({
	apiKey: "",
	authDomain: "accountability-app-29b4b.firebaseapp.com",
	databaseURL: "https://accountability-app-29b4b-default-rtdb.firebaseio.com",
	projectId: "accountability-app-29b4b",
	appId: "",
});
var database = firebase.database();
database.ref('Users/').get().then(function(name){
	if(name.exists()){
		console.log(name.val())
	}
});
const server = express();
const PORT = 8082;
server.get('/', (req, res) => res.send('Express and Typescript Server'));
server.listen(PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${PORT}`)
})