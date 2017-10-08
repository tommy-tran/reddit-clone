import { Injectable } from "@angular/core";
import * as firebase from 'firebase';

@Injectable()
export class AuthService {
    username: string;
    password: string;
    uid: string;
    email: string;
    loggedIn: boolean;

    constructor() {
        this.firebaseSetup();
    }

    /**
     * Initialize firebase
    */
    firebaseSetup() {    
        var config = {
            apiKey: "AIzaSyAreoTdCsTtPbCzatkDT-nelNIbizsj2UI",
            authDomain: "reddit-clone-ced0e.firebaseapp.com",
            databaseURL: "https://reddit-clone-ced0e.firebaseio.com",
            projectId: "reddit-clone-ced0e",
            storageBucket: "reddit-clone-ced0e.appspot.com",
            messagingSenderId: "896550001075"
          };
          firebase.initializeApp(config);
    }

    checkAuthState() {
        console.log(firebase.auth().currentUser);
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                // User is signed in.
                this.loggedIn = true;
                this.uid = user.uid;
                this.email = user.email;
                this.setUsername();
            } else {
                // No user is signed in
            }
        });
    }

    /**
     * Set username
     */
    setUsername() {
            var database = firebase.database();
            database.ref('users/' + this.uid).once('value').then((snapshot) => {
                this.username = (snapshot.val() && snapshot.val().username);
            });
    }
    /**
     * Get the user's email
     */
    getEmail() {
        return this.email;
    }
    /**
     * set the user's email
     * @param email the users email
     */
    setEmail(email: string) {
        this.email = email;
    }
    /**
     * get the user's passwd
     */
    getPswd() {
        return this.password;
    }
    /**
     * set the user's passwd
     * @param password the users password
     */
    setPswd(pswd: string) {
        this.password = pswd;
    }
    /**
     * return an error message from firebases error codes
     * @param code firebase error code
     */
    getErrMsg(code: string) {
        let codes = {
            "auth/app-deleted":"This app has been deleted from Firebase. Please notify the developer.",
            "auth/app-not-authorized":"App not authorized to user Firebase Authentication. Please notify the developer.",
            "auth/argument-error":"Incorrect Arguments.",
            "auth/invalid-api-key":"Invalid API Key. Please notify the developer.",
            "auth/invalid-user-token":"User credentials no longer valid. Please sign in again.",
            "auth/network-request-failed":"Network Error. Please check your internet connection and try again.",
            "auth/operation-not-allowed":"Operation not allowed. Notify developer to configure providers.",
            "auth/requires-recent-login":"Time since last log in did not meet security threshold. Please sign in again.",
            "auth/too-many-requests":"Request blocked due to unusual activity on your device.",
            "auth/unauthorized-domain":"App domain not authorized for OAuth operations. Notify the developer.",
            "auth/user-disabled":"Your account has been disabled",
            "auth/user-token-expired":"Your credentials have expired, or have been deleted.",
            "auth/web-storage-unsupported":"Browser storage not supported or has been declined.",
        }
        return codes[code];
    }
}