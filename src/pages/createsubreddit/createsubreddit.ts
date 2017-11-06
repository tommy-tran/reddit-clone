import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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
    private databaseService: DatabaseService) {
      let theme = this.navParams.data.theme;
      this.itemColor = theme == 'dark-theme' ? '#090f2f' : '#fff';
      this.textColor = theme == 'dark-theme' ? '#fff' : '#000';
  }

  closeModal() {
    this.navCtrl.pop();
  }

  submitSubreddit(form: NgForm) {
    let title = form.value.titleInput.toLowerCase(); // No white space, only lower case
    let text = form.value.textInput;
    let username = this.authService.getUsername();
    let user_uid = this.authService.getUID();

    if (title && text && (title.indexOf(' ') < 0)){
      this.databaseService.checkValidSubreddit(title).then((valid) => {
        if (valid) {
          this.databaseService.newSubreddit(title, text, username, user_uid);
          this.closeModal();
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


