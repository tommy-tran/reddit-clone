import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController, LoadingController, ViewController, Events } from 'ionic-angular';
import { Storage } from "@ionic/storage";

import { AuthService } from '../../shared/auth.service';
import { DatabaseService } from '../../shared/database.service';
import { DataSharingService } from '../../shared/data-sharing.service';
import { NgForm } from '@angular/forms';
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
    private alertCtrl: AlertController,
    private authService: AuthService,
    private dataSharing: DataSharingService,
    private databaseService: DatabaseService,
    public events: Events,
    private loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public navParams: NavParams,
    platform: Platform,
    private storage: Storage,
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

  closeModal() {
    this.viewController.dismiss();
  }

  showUserInfo() {
    console.log("Username: " + this.username);
    console.log("UID: " + this.uid);
    console.log("Email: " + this.email);
    console.log("Karma: " + this.karma);
    console.log("Member Since: " + this.memberSince);
  }

}
