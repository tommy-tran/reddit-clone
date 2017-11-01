import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from "@ionic/storage";

import { MyApp } from './app.component';
import { HomePage, CommentsPage, LoginPage, SubredditPage, CreatePostPage, CreateSubredditPage } from '../shared/pages';
import { PostComponent } from '../components/post/post';
import { DataSharingService } from '../shared/data-sharing.service';
import { AuthService } from '../shared/auth.service';
import { DatabaseService } from '../shared/database.service';
import { SortByPopover } from '../components/sortBy/sortBy';
import { CommentComponent } from '../components/comment/comment';
import { HttpModule } from '@angular/http';
import { deepLinkConfig } from './deeplink.config';
import { HomePageModule } from '../pages/home/home.module';
import { SubredditPageModule } from '../pages/subreddit/subreddit.module';
import { ComponentsModule } from '../components/components.module';
@NgModule({
  declarations: [
    MyApp,
    // HomePage, 
    CommentsPage,
    SortByPopover,
    LoginPage,
    // SubredditPage,
    CreatePostPage,
    CreateSubredditPage,
    // PostComponent,
    // CommentComponent
  ],
  imports: [
    BrowserModule,
    // IonicModule.forRoot(MyApp, {}, deepLinkConfig),
    IonicModule.forRoot(MyApp),
    
    IonicStorageModule.forRoot({
      driverOrder: ['indexeddb', 'websql', 'sqlite']
    }),
    HttpModule,
    HomePageModule,
    SubredditPageModule,
    ComponentsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,    
    CommentsPage,
    LoginPage,
    SubredditPage,
    CreatePostPage,
    CreateSubredditPage,
    SortByPopover
  ],
  providers: [
    StatusBar,
    SplashScreen, DataSharingService, AuthService, DatabaseService,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
