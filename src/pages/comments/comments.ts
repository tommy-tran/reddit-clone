import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar, Events } from 'ionic-angular';
import { NgForm } from '@angular/forms';

import { AuthService } from '../../shared/auth.service';
import { Comment } from '../../models/comment.model';
import { DatabaseService } from '../../shared/database.service';
import { Post } from '../../models/post.model';
import { SettingsProvider } from '../../shared/theming.service';

@IonicPage({
  name: 'commentpage'
})
@Component({
  selector: 'page-comments',
  templateUrl: 'comments.html',
})
export class CommentsPage implements OnInit {
  post: Post;
  comments: Comment[];
  itemColor: string;
  textColor: string;
  username: string;
  @ViewChild('myInput') myInput: ElementRef;
  @ViewChild(Navbar) navBar: Navbar;
  constructor(private authService: AuthService,
    private databaseService: DatabaseService,
    public events: Events,
    public navCtrl: NavController,
    public navParams: NavParams,
    private theming: SettingsProvider) {
    //theming
    let theme;
    this.theming.getActiveTheme().subscribe(val => {
      theme = val;
      console.log(theme)
      this.itemColor = theme == 'dark-theme' ? '#1a1a1a' : '#fff';
      this.textColor = theme == 'dark-theme' ? '#fff' : '#000';
    });
    this.username = this.authService.getUsername();
    this.post = this.navParams.data.post;
    this.getPostComments();

    this.events.subscribe('update:comments', () => {
      this.getPostComments();
      this.post = this.navParams.data.post;
    });
  }

  ngOnInit() {
    // When the back button is pressed
    this.navBar.backButtonClick = () => {
      this.events.publish('nav');
      this.navCtrl.pop();
    }
  }

  /**
   * for resizing textarea as user types
   */
  resize() {
    this.myInput.nativeElement.style.height = this.myInput.nativeElement.scrollHeight + 'px';
  }
  /**
   * add a comment to a post
   * @param form comment message to be added
   */
  submitComment(form: NgForm) {
    if (form.value.commentInput.trim()) {
      let commentData = {
        creator: this.authService.getUsername(),
        UID: this.authService.getUID(),
        message: form.value.commentInput.trim(),
        score: 0
      }
      this.databaseService.writeComment(commentData, this.post.post_id, this.post.subreddit_id).then((comment: Comment) => {
        this.comments.push(comment);
      });
    }
  }
  /**
   * get all comments for a post
   */
  getPostComments() {
    this.databaseService.getPostComments(this.post.post_id).then((comments) => {
      this.comments = [];
      for (var key in comments) {
        this.comments.push(new Comment(
          comments[key].message,
          comments[key].timestamp,
          comments[key].creator,
          comments[key].UID,
          comments[key].comment_id,
          comments[key].score
        ));
      }
    });
  }

}
