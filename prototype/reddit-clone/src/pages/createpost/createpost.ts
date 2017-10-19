import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../shared/auth.service';
import { Subreddit } from '../../models/subreddit.model';
import { DatabaseService } from '../../shared/database.service';
import { NgForm } from '@angular/forms';

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

  submitPost(form: NgForm) {
    let title = form.value.titleInput;
    let url = form.value.urlInput;
    let text = form.value.textInput;
    let username = this.authService.getUsername();
    let user_id = this.authService.getUID();

    if (title) {
      if (this.isLinkPost && this.isURL(url)) {
        let postData = {"title": title, "link": url, "subreddit": this.subreddit, "username": username, "user_id": user_id};
        this.databaseService.createLinkPost(postData).then(() => {
          this.closeModal();
        });
      } else if (!this.isLinkPost && text) {
        let postData = {"title": title, "message": text, "subreddit": this.subreddit, "username": username, "user_id": user_id};        
        this.databaseService.createTextPost(postData).then(() => {
          this.closeModal();
        });
      } else {
        console.log("Invalid fields");
      }   
    }
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
