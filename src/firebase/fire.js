import firebase from 'firebase';

const config = {
    apiKey: "AIzaSyBZFTPrsypgvXZDYN80M413o3GofYefaaY",
    authDomain: "login-7fda6.firebaseapp.com",
    databaseURL: "https://login-7fda6.firebaseio.com",
    projectId: "login-7fda6",
    storageBucket: "login-7fda6.appspot.com",
    messagingSenderId: "823004768187"
};

const fire = firebase.initializeApp(config);

export default fire;