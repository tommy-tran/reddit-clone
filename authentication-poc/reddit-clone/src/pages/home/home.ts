import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthService } from '../../shared/auth.service';
import { DatabaseService } from '../../shared/database.service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  username: string;
  constructor(
    private authService: AuthService,
    private databaseService: DatabaseService,
    public navCtrl: NavController) {
      this.getUserInfo();
    }

  getUserInfo() {
    this.username = this.authService.getUName();
  }

  getThreads() {
    this.databaseService.getSubredditPosts("1").then((subreddits) => {
      console.log(subreddits);
    }).catch(err => console.error(err));
  }
}
