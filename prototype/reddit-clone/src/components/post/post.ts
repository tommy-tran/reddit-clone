import { Component, Input } from '@angular/core';
import { Post } from '../../models/post.model';
import { DatabaseService } from '../../shared/database.service';
import { NavController, NavParams } from 'ionic-angular';
import { SubredditPage } from "../../shared/pages";
import { Subreddit } from '../../models/subreddit.model';

@Component({
  selector: 'post',
  templateUrl: 'post.html'
})
export class PostComponent {
  @Input() post: Post;
  @Input() subreddit: Subreddit;
  constructor(private databaseService: DatabaseService, public navCtrl: NavController,) {
  }

  goToSubreddit() {
    this.databaseService.getSubreddit(this.post.subreddit_id).then((subreddit) => {
      this.navCtrl.push(SubredditPage, subreddit);
    });
  }
}
