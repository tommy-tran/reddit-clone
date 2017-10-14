import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../shared/auth.service';
import { DatabaseService } from '../../shared/database.service';
import { NgForm } from '@angular/forms';
/**
 * Generated class for the CreatesubredditPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-createsubreddit',
  templateUrl: 'createsubreddit.html',
})
export class CreateSubredditPage {

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private authService: AuthService, 
    private databaseService: DatabaseService) {

  }

  closeModal() {
    this.navCtrl.pop();
  }

  submitSubreddit(form: NgForm) {
    let title = form.value.titleInput;
    let text = form.value.textInput;
    let username = this.authService.getUsername();
    let user_uid = this.authService.getUID();

    if (title) {
      if (title && text){
        this.databaseService.newSubreddit(title, text, username, user_uid);
        this.closeModal();        
      }
      } else { 
        console.log("Invalid fields");
      }   
    }
  }


