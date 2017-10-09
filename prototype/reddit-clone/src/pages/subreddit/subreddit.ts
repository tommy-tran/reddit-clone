import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Subreddit } from '../../models/subreddit.model';
import { Post } from '../../models/post.model';
import { DatabaseService } from '../../shared/database.service';

@IonicPage()
@Component({
  selector: 'page-subreddit',
  templateUrl: 'subreddit.html',
})
export class SubredditPage {
  id : string;
  subreddit: Subreddit;
  posts: Post[];
  times: string[];

  constructor(private databaseService: DatabaseService, public navCtrl: NavController, public navParams: NavParams) {
    this.subreddit = this.navParams.data;
    this.id = this.subreddit.subreddit_id;
    this.posts = [];
    this.times = [];
    this.databaseService.getSubredditPosts(this.id).then(posts => {
      this.posts = Object.values(posts);
      
      // https://firebase.google.com/docs/reference/js/firebase.database.ServerValue for working with timestamps
      // let currentDate = new Date();
      // posts.forEach(post => {
      //   let postDate = new Date(post.timestamp);
      //   let timeDiff = this.calculateTimeDifference(postDate, currentDate)
      //   this.times.push(timeDiff);
      // });
    });

  }
  calculateTimeDifference(date1, date2) {
    var difference = date1.getTime() - date2.getTime();

    var daysDifference = Math.floor(difference / 1000 / 60 / 60 / 24);
    difference -= daysDifference * 1000 * 60 * 60 * 24

    var hoursDifference = Math.floor(difference / 1000 / 60 / 60);
    difference -= hoursDifference * 1000 * 60 * 60

    var minutesDifference = Math.floor(difference / 1000 / 60);
    difference -= minutesDifference * 1000 * 60

    var secondsDifference = Math.floor(difference / 1000);

    if (daysDifference >= 1) {
      return daysDifference + ' d'
    }
    else if (hoursDifference >= 1 && hoursDifference < 24) {
      return hoursDifference + ' hr'
    }
    else if (minutesDifference < 60 && minutesDifference >= 1) {
      return minutesDifference + ' m';
    }
    else {
      return secondsDifference + ' s'
    }
  }
}
