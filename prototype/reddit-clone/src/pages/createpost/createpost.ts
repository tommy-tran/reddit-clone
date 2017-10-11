import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../shared/auth.service';
import { Subreddit } from '../../models/subreddit.model';
import { DatabaseService } from '../../shared/database.service';

@IonicPage()
@Component({
  selector: 'page-createpost',
  templateUrl: 'createpost.html',
})
export class CreatePostPage {
  isLinkPost: boolean;
  subreddit: Subreddit;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private authService: AuthService, 
    private databaseService: DatabaseService) {
    this.isLinkPost = true;
    this.subreddit = navParams.data.subreddit;
  }

  linkPost() {
    this.isLinkPost = true;
  }

  textPost() {
    this.isLinkPost = false;
  }

  closeModal() {
    this.navCtrl.pop();
  }
}
