import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { AuthService } from '../../shared/auth.service';
import { DatabaseService } from '../../shared/database.service';
import { DataSharingService } from "../../shared/data-sharing.service";
import { LoginPage } from "../../shared/pages";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  username: string;
  constructor(
    private authService: AuthService,
    private databaseService: DatabaseService,
    private dataSharing: DataSharingService,
    public modalCtrl: ModalController,
    public navCtrl: NavController) {
      this.getUserInfo();
    }

  getUserInfo() {
    this.username = this.authService.getUName();
  }

  openAuth(userHasAccount: boolean) {
    let param = userHasAccount ? { userHasAccount : true } : { userHasAccount : false };
    let authModal = this.modalCtrl.create(LoginPage, param);
    authModal.present();
  }

  getThreads() {
    this.databaseService.getSubredditPosts("1").then((subreddits) => {
      console.log(subreddits);
    }).catch(err => console.error(err));
  }


}
