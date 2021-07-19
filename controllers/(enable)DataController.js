const firebase = require("firebase");
require("firebase/firestore");


firebase.initializeApp({
        apiKey: "AIzaSyBZTzTpAs5i_-Br_MnDwQQMAyWDQ9YYGDw",
        authDomain: "beex-avalon-training.firebaseapp.com",
        projectId: "beex-avalon-training",
        storageBucket: "beex-avalon-training.appspot.com",
        messagingSenderId: "692935627141",
        appId: "1:692935627141:web:7a4195d3397b394b4674ec",
        measurementId: "G-H21JBTQRRE"
});

var db = firebase.firestore();

class Database{
    testData(){
        // db.collection("users").get().then((querySnapshot) => {
        //     querySnapshot.forEach((doc) => {
        //         console.log(`${doc.id} => ${doc.data().name}`);
        //     });
        // });
        console.log("hello muc")
    }
}

module.exports = new Database;
