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
  itemColor: string;
  subreddit: Subreddit;
  textColor: string;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private authService: AuthService, 
    private databaseService: DatabaseService) {
    this.isLinkPost = true;
    this.subreddit = navParams.data.subreddit;
    //theme
    let theme = this.navParams.data.theme;
    this.itemColor = theme == 'dark-theme' ? '#1a1a1a' : '#fff';
    this.textColor = theme == 'dark-theme' ? '#fff' : '#000';
  }
  /**
   * determine if new post has link
   */
  linkPost() {
    this.isLinkPost = true;
  }
  /**
   * determine if new post has text
   */
  textPost() {
    this.isLinkPost = false;
  }
  /**
   * close the new post modal
   */
  closeModal() {
    this.navCtrl.pop();
  }
  /**
   * send the new post to the database
   * @param form new post form
   */
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
  /**
   * determine if a url is valid
   * @param str url to be checked
   */
  isURL(str : string) {
    if (str.includes('.')) {
      var pattern = new RegExp('^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$');
      return pattern.test(str);
    } else {
      return false;
    }
  }
}
