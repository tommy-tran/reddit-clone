import { Component } from '@angular/core';
import { NavController, AlertController, ToastController, Events } from 'ionic-angular';
import * as firebase from 'firebase';
import { AuthService } from '../../shared/auth.service';
@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  email: string;
  user: any;
  constructor(public navCtrl: NavController, private events: Events, private alertCtrl: AlertController, private toastCtrl: ToastController, private authService: AuthService) {
    this.email = this.authService.getEmail();
  }
  /** 
   * sign out and emit an event to go back to the login page
   */
  logout() {
    firebase.auth().signOut().then(() => {
      this.events.publish('log out');
    });
  }
  /**
   * display an alert to change the user's password
   */
  changePassword() {
    this.alertCtrl.create({
      title: 'Change Password',
      inputs: [
        {
          placeholder: 'Old Password',
          name: 'oldPswd',
          type: 'password'
        },
        {
          placeholder: 'New Password',
          type: 'password',
          name: 'newPswd'
        },
        {
          placeholder: 'Confirm New Password',
          type: 'password',
          name: 'confirmNewPswd'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Ok',
          handler: data => {
            // Reauthenticate user
            const user = firebase.auth().currentUser;
            const credential = firebase.auth.EmailAuthProvider.credential(user.email,data.oldPswd);
            user.reauthenticateWithCredential(credential).then(() => {
              if (data.newPswd == data.confirmNewPswd) {
                firebase.auth().currentUser.updatePassword(data.newPswd).then(() => {
                  this.toastCtrl.create({
                    message: 'Password updated',
                    position: 'middle',
                    duration: 2000
                  }).present();
                }).catch(err => {
                  //display an alert with the error message
                  this.alertCtrl.create({
                    title: 'Error',
                    subTitle: err.message,
                    buttons: [
                      {
                        text: 'Ok'
                      }
                    ]
                  }).present();
                });
              }
              else {
                this.toastCtrl.create({
                  message: 'Passwords do not match. Please try again.',
                  position: 'middle',
                  duration: 2500
                }).present();
              }
            }).catch(() =>  {
              this.toastCtrl.create({
                message: 'Password input not correct. Please try again.',
                duration: 2500,
                position: 'middle'
              }).present();
            });
          }
        }
      ]
    }).present();
  }
  /**
   * delete the user's account
   */
  deleteAccount() {
    this.alertCtrl.create({
      title: 'Delete account?',
      subTitle: 'Are you sure you want to delete your account?',
      buttons: [
        {
          text: 'No, keep account',
          role: 'cancel'
        },
        {
          text: "Yes, I'm sure",
          handler: () => {
            //sign out then delete account, nav back to login page
            firebase.auth().currentUser.delete().catch(err => console.error(err)).then(() => {
              this.events.publish('log out');
            });
          }
        }
      ]
    }).present();
  }
}
