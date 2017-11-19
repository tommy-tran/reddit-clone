import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ViewController, Events } from 'ionic-angular';

import { AuthService } from '../../shared/auth.service';
import { DatabaseService } from '../../shared/database.service';
import { SettingsProvider } from '../../shared/theming.service';


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

  selectedTheme: String;


  constructor(
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
      this.username = this.authService.getUsername();
      this.email = this.authService.getEmail();
      this.uid = this.authService.getUID();
      this.memberSince = this.authService.getMemberSince();
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

}
