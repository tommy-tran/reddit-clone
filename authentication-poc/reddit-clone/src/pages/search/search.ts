import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatabaseService } from '../../shared/database.service';
import { Subreddit } from '../../models/subreddit.model';
import { SubredditPage } from '../subreddit/subreddit';

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {
  subreddits: Subreddit[];
  subredditDisplay: Subreddit[];
  constructor(
    private databaseService: DatabaseService,
    public navCtrl: NavController,
    public navParams: NavParams) {
    this.databaseService.getSubreddits().then(subreddits => {
      this.subreddits = subreddits;
      this.subredditDisplay = [];
    });
  }
  /**
   * reinitialize the search results on keyup
   */
  initializeSearch() {
    this.subredditDisplay = [];
  }
  /**
   * filter the list of subreddits and display those that match the user's input
   * @param event keyup event fired by the user's input
   */
  onInput(event) {
    this.initializeSearch();
    let val = event.target.value;
    if (val && val.trim() != '') {
      this.subredditDisplay = this.subreddits.filter((subreddit) => {
        return subreddit.name.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1;
      });
    }
    console.log(this.subredditDisplay);
  }

  onCancel(event) {

  }
  /**
   * navigate to a subreddit's page
   * @param subreddit the subreddit to nav to
   */
  goToSubreddit(subreddit: Subreddit) {
    this.navCtrl.push(SubredditPage, {subreddit: subreddit});
  }

}
