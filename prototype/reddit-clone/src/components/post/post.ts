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
export class PostComponent implements OnInit {
  score: number;
  datePosted: string;
  userLoggedIn: boolean;
  disableInput: boolean;
  @Input() post: Post;
  @Input() subreddit: Subreddit;
  constructor(private authService: AuthService, private databaseService: DatabaseService, public navCtrl: NavController, ) {
    this.userLoggedIn = this.authService.isLoggedIn(); // Check if user is logged in    
    this.disableInput = false; // For temporary disable input on upvotes/downvotes
  }

  calculateDatePosted() {
    let currentTime = new Date();
    let difference = currentTime.getTime() - this.post.timestamp;

    let yearsDifference = Math.floor(difference / 1000 / 60 / 60 / 24 / 365);
    difference -= yearsDifference * 1000 * 60 * 60 * 24 * 365;

    let daysDifference = Math.floor(difference / 1000 / 60 / 60 / 24);
    difference -= daysDifference * 1000 * 60 * 60 * 24

    let hoursDifference = Math.floor(difference / 1000 / 60 / 60);
    difference -= hoursDifference * 1000 * 60 * 60

    let minutesDifference = Math.floor(difference / 1000 / 60);
    difference -= minutesDifference * 1000 * 60

    let secondsDifference = Math.floor(difference / 1000);

    if (yearsDifference > 1) {
      this.datePosted = yearsDifference + ' years ago';
    }
    else if (yearsDifference == 1) {
      this.datePosted = '1 year ago';
    }
    else if (daysDifference > 1) {
      this.datePosted = daysDifference + ' days ago';
    }
    else if (daysDifference == 1) {
      this.datePosted = '1 day ago';
    }
    else if (hoursDifference > 1 && hoursDifference < 24) {
      this.datePosted = hoursDifference + ' hours ago';
    }
    else if (hoursDifference === 1) {
      this.datePosted = '1 hour ago';
    }
    else if (minutesDifference < 60 && minutesDifference >= 1) {
      this.datePosted = minutesDifference + ' minutes ago';
    }
    else {
      this.datePosted = secondsDifference.toString();
    }
  }

  ngOnInit() {
    this.score = this.post.score;
    this.calculateDatePosted();
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
