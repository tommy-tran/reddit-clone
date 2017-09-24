import { Injectable } from "@angular/core";

@Injectable()
export class AuthService {
    password: string;
    uname: string;
    email: string;
    /**
     * get the user's email
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
     * set the user's username
     * @param userName the user's username
     */
    setUName(userName: string) {
        this.uname = userName;
    }
    /**
     * return the user's username
     */
    getUName() {
        return this.uname;
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