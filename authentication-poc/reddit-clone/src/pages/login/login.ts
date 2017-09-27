import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController, LoadingController, ViewController } from 'ionic-angular';
import { DataSharingService } from '../../shared/data-sharing.service';
import { NgForm } from '@angular/forms';
import { TabsPage } from '../../shared/pages';
import { AuthService } from '../../shared/auth.service';
import * as firebase from 'firebase';
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  needsVerification: boolean;
  showPasswordsErr: boolean;
  showIncompleteFormErr: boolean;
  screenX: number;
  screenY: number;
  isMobile: boolean;
  userHasAccount: boolean;
  constructor(
    private alertCtrl: AlertController,
    private authService: AuthService,
    private dataSharing: DataSharingService,
    private loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewController: ViewController,
    platform: Platform) {
    this.screenX = this.dataSharing.getScreenX();
    this.screenY = this.dataSharing.getScreenY();
    this.isMobile = this.dataSharing.getIsMobile();
    this.screenX = window.screen.width;
    this.screenY = window.screen.height;
    this.isMobile = platform.is('mobile');
    this.userHasAccount = this.navParams.get('userHasAccount');
  }
  /**
   * get form data and log user in
   * @param form form with user's login info
   */
  loginUser(form: NgForm) {
    if (form.value.emailInput && form.value.password) {
      this.signInUser(form.value.emailInput, form.value.password);
    }
  }
  /**
   * logout the user
   */
  logout() {
    firebase.auth().signOut().catch(err => {
      console.error(err);
    });
  }
  /**
   * attempt to sign in after verification email is sent
   */
  attemptSignIn() {
    let email = this.authService.getEmail();
    let pswd = this.authService.getPswd();
    firebase.auth().signInWithEmailAndPassword(email, pswd).then(() => {
      let isVerified = firebase.auth().currentUser.emailVerified;
      firebase.auth().signOut().catch((err) => console.error(err));
      if (isVerified) {
        this.signInUser(email, pswd);
      }
      else {
        this.alertCtrl.create({ title: 'Email not verified', subTitle: 'Please check your email and verify your account', buttons: [{ text: 'Ok' }] }).present();
      }
    }).catch(err => console.error(err));
  }
  /**
   * 
   * @param form form with user's sign up information
   */
  signUpUser(form: NgForm) {
    let email = form.value.emailInput;
    let password = form.value.password;
    let confirmPassword = form.value.confirmPassword;
    if (email && password && confirmPassword) {
      if (password == confirmPassword) {
        this.showPasswordsErr = false;
        this.showIncompleteFormErr = false;
        //user passwd is ok, form is complete, so sign up user, then log them in (catch any errors and log them)
        firebase.auth().createUserWithEmailAndPassword(email, password).then(() => {
          this.needsVerification = true;
          this.authService.setEmail(email);
          this.authService.setPswd(password);
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
    let loading = this.loadingCtrl.create({
      content: 'Loading...',
      enableBackdropDismiss: false
    });
    loading.present();
    firebase.auth().signInWithEmailAndPassword(email, password).then(() => {
      //'username' is just everything before the @ in the user's email
      this.authService.setUName(email.substring(0, email.indexOf('@')));
      this.authService.setEmail(email);
      this.authService.setPswd(password);
      this.navCtrl.setRoot(TabsPage);
      this.needsVerification = false;
      loading.dismiss();
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
  }
  /**
   * switch between login and sign up forms
   */
  switchForms() {
    this.userHasAccount = !this.userHasAccount;
  }

  closeModal() {
    this.viewController.dismiss();
  }
}
