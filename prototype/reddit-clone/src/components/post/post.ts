import { Component, Input, OnInit } from '@angular/core';
import { Post } from '../../models/post.model';
import { DatabaseService } from '../../shared/database.service';
import { AuthService } from '../../shared/auth.service';
import { NavController, NavParams } from 'ionic-angular';
import { SubredditPage } from "../../shared/pages";
import { Subreddit } from '../../models/subreddit.model';

@Component({
  selector: 'post',
  templateUrl: 'post.html'
})
export class PostComponent implements OnInit{
  score : number;
  userLoggedIn: boolean;
  disableInput : boolean;
  @Input() post: Post;
  @Input() subreddit: Subreddit;
  constructor(private authService: AuthService, private databaseService: DatabaseService, public navCtrl: NavController,) {
    this.userLoggedIn = this.authService.isLoggedIn(); // Check if user is logged in    
    this.disableInput = false; // For temporary disable input on upvotes/downvotes
  }

  ngOnInit() {
    this.score = this.post.score;
    console.log(this.post.link);
  }

  goToSubreddit() {
    this.databaseService.getSubreddit(this.post.subreddit_id).then((subreddit) => {
      this.navCtrl.push(SubredditPage, subreddit);
    });
  }

  goToLink() {
    if (this.post.link) {
      window.open(this.post.link);
    } else {
      console.log("TODO: post page");
    }
    
  }

  upvote() {
    this.disableInput = true;
    let user = this.authService.getUsername();
    this.databaseService.upvotePost(user, this.post).then((points) => {
      this.score = this.score + points;
      this.updatePost();
    });
  }

  downvote() {
    this.disableInput = true;
    let user = this.authService.getUsername();
    this.databaseService.downvotePost(user, this.post).then((points) => {
      this.score = this.score + points;
      this.updatePost();
    });
  }

  updatePost() {
    this.databaseService.getPost(this.post.post_id, this.post.subreddit_id).then((post) => {
      this.post = post;
      this.disableInput = false;
    })
  }
}
