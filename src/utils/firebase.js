import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCT0XidrRC25UAUmlUXZnbY8P2GMmW8jVw",
  authDomain: "denuncias-ronald.firebaseapp.com",
  projectId: "denuncias-ronald",
  storageBucket: "denuncias-ronald.appspot.com",
  messagingSenderId: "908342821134",
  appId: "1:908342821134:web:231378adf6221a690a175f"
};

// Initialize Firebase
//const app = initializeApp(firebaseConfig);
const  defaultStorage = getStorage();

export const  UploadFile = (file)=>{


    return new Promise( resolve=>{
        let ref =   defaultStorage.ref("responses-files");
       let task =  ref.child(file.name).put(file);
       task.on('state_changed', function(snapshot){
        console.log("snap",snapshot);
      }, function(error) {
        console.log("upload error",error.message);
      }, function() {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        task.snapshot.ref.getDownloadURL().then(function(downloadURL) {
            resolve(downloadURL);
          console.log('File available at', downloadURL);
        });
      });

        
    } );



}