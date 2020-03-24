/* 글로벌 state, props 하고 싶을 때 ㄱㄱ */
import App from 'next/app'

import firebase from '../config/firebase'

function whatsyourchoice_App({ Component, pageProps, user}) {
    return <Component {...pageProps} user={user} />
}
  
//   Only uncomment this method if you have blocking data requirements for
//   every single page in your application. This disables the ability to
//   perform automatic static optimization, causing every page in your app to
//   be server-side rendered.
  
  whatsyourchoice_App.getInitialProps = async (appContext) => {
    // calls page's `getInitialProps` and fills `appProps.pageProps`
    const appProps = await App.getInitialProps(appContext);
  
    firebase.auth().signInAnonymously().catch((error) => {
        // Handle Errors here.
        let errorCode = error.code;
        let errorMessage = error.message;
        console.log(errorCode, errorMessage);
        
        // ...
      });
    let getUser = await new Promise ((resolve, reject) => {
        let userData = {};

        return firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                // User is signed in.
                userData = {
                    uuid: user.uid,
                    isAnonymous: user.isAnonymous,
                };

                resolve(userData);
    
                // ...
            } else {
                // User is signed out.
                console.log(`로그아웃`);
                reject({});
                // ...
            }
            // ...
        });
    })

    return {
        ...appProps,
        user: getUser,
    };
}
  
  export default whatsyourchoice_App