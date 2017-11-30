import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { AuthService } from '../../shared/auth.service';
import { DatabaseService } from '../../shared/database.service';
import { NgForm } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-createsubreddit',
  templateUrl: 'createsubreddit.html',
})
export class CreateSubredditPage {
  itemColor: string;
  textColor: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private authService: AuthService,
    private databaseService: DatabaseService,
    private viewCtrl: ViewController) {
    let theme = this.navParams.data.theme;
    this.itemColor = theme == 'dark-theme' ? '#1a1a1a' : '#fff';
    this.textColor = theme == 'dark-theme' ? '#fff' : '#000';
  }
  /**
   * close the create subreddit modal
   */
  closeModal(sub_id: string) {
    this.viewCtrl.dismiss(sub_id);
  }
  /**
   * send a new subreddit to the database
   * @param form form with subreddit data
   */
  submitSubreddit(form: NgForm) {
    let title = form.value.titleInput.toLowerCase(); // No white space, only lower case
    let text = form.value.textInput;
    let username = this.authService.getUsername();
    let user_uid = this.authService.getUID();

    if (title && text && (title.indexOf(' ') < 0)) {
      this.databaseService.checkValidSubreddit(title).then((valid) => {
        if (valid) {
          this.databaseService.newSubreddit(title, text, username, user_uid).then(key => {
            this.closeModal(key);
          });
        } else {
          // Show error message
          console.log("Subreddit already exists");
        }
      })
    } else {
      console.log("Invalid fields");
    }
  }

}


