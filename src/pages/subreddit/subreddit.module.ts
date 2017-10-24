import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SubredditPage } from './subreddit';

@NgModule({
  declarations: [
    SubredditPage,
  ],
  imports: [
    IonicPageModule.forChild(SubredditPage),
  ],
})
export class SubredditPageModule {}
