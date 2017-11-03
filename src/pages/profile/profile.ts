import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController, LoadingController, ViewController, Events } from 'ionic-angular';
import { Storage } from "@ionic/storage";

import { DataSharingService } from '../../shared/data-sharing.service';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../shared/auth.service';
import { DatabaseService } from '../../shared/database.service';
/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

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


  constructor(
    private alertCtrl: AlertController,
    private authService: AuthService,
    private dataSharing: DataSharingService,
    private databaseService: DatabaseService,
    private loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
    public viewController: ViewController,
    public events: Events,
    platform: Platform) {
      this.isLoggedIn = this.authService.isLoggedIn();
      if (this.isLoggedIn){
        this.username = this.authService.getUsername();
        this.email = this.authService.getEmail();
        this.uid = this.authService.getUID();
        this.memberSince = this.authService.getMemberSince();
        this.databaseService.getKarma(this.uid).then(karma =>{
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
