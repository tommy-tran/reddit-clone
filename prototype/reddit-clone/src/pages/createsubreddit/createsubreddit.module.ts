import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateSubredditPage } from './createsubreddit';

@NgModule({
  declarations: [
    CreateSubredditPage,
  ],
  imports: [
    IonicPageModule.forChild(CreateSubredditPage),
  ],
})
export class CreateSubredditPageModule {}
