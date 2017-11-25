import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ViewController, Events } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

import { AuthService } from '../../shared/auth.service';
import { DatabaseService } from '../../shared/database.service';
import { SettingsProvider } from '../../shared/theming.service';
import { NgForm } from '@angular/forms/src/directives/ng_form';


@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  isLoggedIn: boolean;
  username: string;
  email: string;
  karma: string;
  uid: string;
  memberSince: string;
  photo: string;
  selectedTheme: String;
  changePhoto: boolean;


  constructor(
    private alertCtrl: AlertController,
    private authService: AuthService,
    private databaseService: DatabaseService,
    public events: Events,
    public navCtrl: NavController,
    public navParams: NavParams,
    platform: Platform,
    private theming: SettingsProvider,
    public viewController: ViewController) {
    this.theming.getActiveTheme().subscribe(val => this.selectedTheme = val);

    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      this.changePhoto = false;
      this.username = this.authService.getUsername();
      this.email = this.authService.getEmail();
      this.uid = this.authService.getUID();
      this.memberSince = this.authService.getMemberSince();
      this.photo = this.authService.getPhoto();
      this.databaseService.getKarma(this.uid).then(karma => {
        this.karma = karma;
      });
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }
  /**
   * close the profile modal
   */
  closeModal() {
    this.viewController.dismiss();
  }
  /**
   * show user info on console
   */
  showUserInfo() {
    console.log("Username: " + this.username);
    console.log("UID: " + this.uid);
    console.log("Email: " + this.email);
    console.log("Karma: " + this.karma);
    console.log("Member Since: " + this.memberSince);
  }

  setPhoto(form: NgForm){
      if (this.isURL(form.value.photoURL)){
        this.photo = form.value.photoURL;
        this.authService.setPhoto(this.photo);
        this.changePhoto = false;
      } else{
        let alert = this.alertCtrl.create({
          title: "Please enter a valid link",
          buttons: ['Dismiss']
        });
        alert.present();
      }
      
  }

  getPhotoURL(){
    this.photo = this.authService.getPhoto();
  }

  showPhotoLink(){
    this.changePhoto = true;
  }
  isURL(str : string) {
    if (str.includes('.')) {
      var pattern = new RegExp('^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$');
      return pattern.test(str);
    } else {
      return false;
    }
  }

}
