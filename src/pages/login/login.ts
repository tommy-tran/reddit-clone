import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController, LoadingController, ViewController, Events } from 'ionic-angular';
import { Storage } from "@ionic/storage";

import { DataSharingService } from '../../shared/data-sharing.service';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../shared/auth.service';

import * as firebase from 'firebase';
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  isLoggedIn: boolean;
  isMobile: boolean;
  itemColor: string;
  needsVerification: boolean;
  screenX: number;
  screenY: number;
  showIncompleteFormErr: boolean;
  showPasswordsErr: boolean;
  textColor: string;
  userHasAccount: boolean;
  usernameText: string;
  validUsername: boolean;
  resetEmail: boolean;

  constructor(
    private alertCtrl: AlertController,
    private authService: AuthService,
    private dataSharing: DataSharingService,
    private loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
    public viewController: ViewController,
    public events: Events,
    platform: Platform) {
    // Initialize
    this.usernameText = "";
    let theme = this.navParams.data.theme;
    this.itemColor = theme == 'dark-theme' ? '#1a1a1a' : '#fff';
    this.textColor = theme == 'dark-theme' ? '#fff' : '#000';
    this.screenX = this.dataSharing.getScreenX();
    this.screenY = this.dataSharing.getScreenY();
    this.isMobile = this.dataSharing.getIsMobile();
    this.screenX = window.screen.width;
    this.screenY = window.screen.height;
    this.isMobile = platform.is('mobile');
    this.resetEmail = false;
    //does the user have an account?
    this.storage.get('userHasAccount').then((val: boolean) => {
      this.userHasAccount = val;
    });
    this.validUsername = false;
  }

  /**
   * Checking username availibility
   */
  checkUsername(username: string) {
    // Check if username is letters and numbers
    if (!(/^\w+$/i.test(username)) || username.length < 3 || username.length > 16) {
      this.validUsername = false;
    } else {
      username = username.toLowerCase();
      var database = firebase.database();
      database.ref('userlist/' + username).on('value', (snapshot) => {
        if (snapshot.val()) {
          this.validUsername = false;
        } else {
          this.validUsername = true;
        }
      });
    }
  }

  /**
   * resetPassword
   * @param(form: NgForm)
   */
  resetPassword(form: NgForm) {
    if (form.value.emailInput) {
      firebase.auth().sendPasswordResetEmail(form.value.emailInput).then(() => {
        let alert = this.alertCtrl.create({
          subTitle: 'reset password email sent to ' + form.value.emailInput,
          message: 'Please note that it may take time for the email to reach your inbox',
          buttons: ['Ok']
        });
        alert.present();
        console.log("email address reset password sent")
        this.resetEmail = false;
      }).catch(err => {
        console.error(err);
        let alert = this.alertCtrl.create({
          title: err.message,
          subTitle: "Please try again",
          buttons: ['Ok']
        });
        alert.present();
      });
    }
  }

  /**
   * get form data and log user in
   * @param form form with user's login info
   */
  loginUser(form: NgForm) {
    if (form.value.emailInput && form.value.password) {
      this.attemptSignIn(form.value.emailInput, form.value.password);
    }
  }
  /**
   * attempt to sign in after verification email is sent
   */
  attemptSignIn(email?: string, pswd?: string) {
    if (!email && !pswd) {
      email = this.authService.getEmail();
      pswd = this.authService.getPswd();
    }
    firebase.auth().signInWithEmailAndPassword(email, pswd).then(() => {
      let isVerified = firebase.auth().currentUser.emailVerified;
      firebase.auth().signOut().catch((err) => console.error(err));
      if (isVerified) {
        this.signInUser(email, pswd);
      }
      else {
        this.alertCtrl.create({
          title: 'Email not verified',
          subTitle: 'Please check your email and verify your account',
          buttons: [{ text: 'Ok' }]
        }).present();
      }
    }).catch(err => console.error(err));
  }
  /**
   * 
   * @param form form with user's sign up information
   */
  signUpUser(form: NgForm) {
    let username = this.usernameText;
    let email = form.value.emailInput;
    let password = form.value.password;
    let confirmPassword = form.value.confirmPassword;
    if (email && password && confirmPassword) {
      if (password == confirmPassword) {
        this.showPasswordsErr = false;
        this.showIncompleteFormErr = false;
        //user password is ok, form is complete, so sign up user, then log them in (catch any errors and log them)
        firebase.auth().createUserWithEmailAndPassword(email, password).then(() => {
          this.needsVerification = true;
          this.authService.setEmail(email);
          this.authService.setPswd(password);

          let uid = firebase.auth().currentUser.uid;

          // Add user to user collection
          firebase.database().ref('users/' + uid).set({
            email: email,
            karma: 0,
            username: username,
          });

          // Add user to userlist (to handle looking for duplicate users)
          firebase.database().ref('userlist/').update({
            [username]: uid
          });

          //send an email to verify the user's email address
          firebase.auth().currentUser.sendEmailVerification().then(() => {
            this.alertCtrl.create({
              title: 'Email sent to ' + email,
              subTitle: 'Click the link in the email to verify your account',
              buttons: [{
                text: 'Ok',
                role: 'cancel'
              }]
            }).present();
          }).catch(err => console.error(err));
        }).catch((err) => {
          //error w/ account creation
          console.error(err);
          this.alertCtrl.create({
            title: err.message,
            subTitle: 'Please try again',
            buttons: [
              {
                text: 'OK'
              }
            ]
          }).present();
        }).then(() => {
          this.storage.set('userHasAccount', true);
        });
      }
      else {
        this.showPasswordsErr = true;
      }
    }
    else {
      this.showIncompleteFormErr = true;
    }
  }
  /**
   * 
   * @param email user's email
   * @param password user's password
   */
  signInUser(email: string, password: string) {
    //SSO, permanently signed in until explicit sign out
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(() => {

      let loading = this.loadingCtrl.create({
        content: 'Loading...',
        enableBackdropDismiss: false
      });
      loading.present();
      firebase.auth().signInWithEmailAndPassword(email, password).then(() => {
        // TODO: Replace setEmail and setPswd with setUserInfo()
        this.authService.setEmail(email);
        this.authService.setPswd(password);
        this.needsVerification = false;
        loading.dismiss();
      }).then(() => {
        this.storage.set('userHasAccount', true);
        this.storage.set('isLoggedIn', true).then(() => {
          this.isLoggedIn = true;
          this.viewController.dismiss(this.isLoggedIn);
          this.events.publish('update:posts');
          this.events.publish('update:comments');
        });
      }).catch(err => {
        loading.dismiss();
        console.log(err);
        this.alertCtrl.create({
          title: err.message,
          subTitle: 'Please try again',
          buttons: [
            {
              text: 'OK'
            }
          ]
        }).present();
      });
    }).catch(err => console.error(err));
  }
  /**
   * switch between login and sign up forms
   */
  switchForms() {
    this.userHasAccount = !this.userHasAccount;
  }

  /**
   * switch from normal login to reset email login
   */
  switchToResetEmail() {
    this.resetEmail = !this.resetEmail;
  }
  /**
   * close current view
   */
  closeModal() {
    this.viewController.dismiss(this.isLoggedIn);
  }
}
