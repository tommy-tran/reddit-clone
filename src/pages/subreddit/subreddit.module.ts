import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SubredditPage } from './subreddit';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    SubredditPage,
  ],
  imports: [
    IonicPageModule.forChild(SubredditPage),
    ComponentsModule
  ],
})
export class SubredditPageModule {}
