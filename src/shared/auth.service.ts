import { Injectable } from "@angular/core";
import * as firebase from 'firebase';
import { Events } from "ionic-angular";

@Injectable()
export class AuthService {
    private username: string;
    private uid: string;    
    private email: string;    
    private password: string;
    private loggedIn: boolean;
    private created: string;
    private photoURL: string;

    constructor(private events: Events) {
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

    updateAuthState() {
        return new Promise((resolve, reject) => {
            firebase.auth().onAuthStateChanged((user) => {
                if (user) {
                    // User is signed in.
                    console.log(user.photoURL);
                    this.setPhoto("https://www.stockvault.net/data/2009/10/05/110974/thumb16.jpg");
                    this.loggedIn = true;
                    this.uid = user.uid;
                    this.email = user.email;
                    this.events.publish('user:loggedin&set');
                    this.setUsername().then(() => {
                        return resolve();
                    });
                } else {
                    // No user is signed in
                    return reject();                    
                }
            });
        }).catch(err => console.log(err));
    }

    /**
     * Set username
     */
    setUsername() {
        return new Promise((resolve, reject) => {
            var database = firebase.database();
            database.ref('users/' + this.uid).once('value').then((snapshot) => {
                this.username = (snapshot.val() && snapshot.val().username);
            }).then(() => {
                resolve();
            });
        }).catch(err => console.log(err));
    }

    /**
     * Get username
     */
    getUsername() {
        return this.username;
    }

    /**
     * Get creation time
     */
    getMemberSince(){
        this.created = firebase.auth().currentUser.metadata.creationTime;
        return this.created;
    }

    /**
     * Set profile photo
     */
    setPhoto(photo){
        var user = firebase.auth().currentUser;
        user.updateProfile({
            displayName: user.displayName,
            photoURL: photo
        }).then(function(){
            console.log("update successful")
        }).catch(function(error){
            console.log("error")
        });
    }

    /**
     * Get profile photo
     */
    getPhoto(){
        var user = firebase.auth().currentUser;
        this.photoURL = user.photoURL;
        return user.photoURL;
    }

    /**
     * Get UID
     */
    getUID() {
        return this.uid;
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
     * get the user's password
     */
    getPswd() {
        return this.password;
    }

    /**
     * set the user's password
     * @param password the users password
     */
    setPswd(pswd: string) {
        this.password = pswd;
    }
    
    isLoggedIn() {
        return this.loggedIn;
    }

    /**
     * logout the user
     */
    logout() {
        return new Promise((resolve, reject) => {
            firebase.auth().signOut().then(() => {
                this.username = "";
                this.email = "";
                this.uid = "";
                this.loggedIn = false;
                this.password = "";
                return resolve();
            }).catch(err => {
                console.error(err);
                return reject();
            })
        });
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