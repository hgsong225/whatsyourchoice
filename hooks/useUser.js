import { useState } from "react";

import firebase from '../config/firebase'

export const useUser = initialValue => {
    const [ user, setUser ] = useState(null);
    const [ isAnonymous, setIsAnonymous] = useState(true);

    firebase.auth().signInAnonymously().catch((error) => {
        // Handle Errors here.
        let errorCode = error.code;
        let errorMessage = error.message;

        // ...
      });
    let getUser = new Promise ((resolve, rejct) => {
        firebase.auth().onAuthStateChanged((user) =>{
            if (user) {
                // User is signed in.
                let isAnonymous = user.isAnonymous;
                let uid = user.uid;
                
                setUser(uid);
                setIsAnonymous(isAnonymous);

                resolve(user);
    
                // ...
            } else {
                // User is signed out.
                console.log(`로그아웃`);
    
                // ...
            }
            // ...
        });
    })

    getUser.then(user => console.log(user));

    return {
        user,
        isAnonymous,
        setUser,
        setIsAnonymous,
    };
};