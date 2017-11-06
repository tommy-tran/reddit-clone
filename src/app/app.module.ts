import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from "@ionic/storage";

import { MyApp } from './app.component';
import { AuthService } from '../shared/auth.service';
import { ComponentsModule } from '../components/components.module';
import { DatabaseService } from '../shared/database.service';
import { DataSharingService } from '../shared/data-sharing.service';
import { HomePage, CommentsPage, LoginPage, SubredditPage, CreatePostPage, CreateSubredditPage, ProfilePage} from '../shared/pages';
import { HomePageModule } from '../pages/home/home.module';
import { HttpModule } from '@angular/http';
import { SettingsProvider } from '../shared/theming.service';
import { SortByPopover } from '../components/sortBy/sortBy';
import { StorageService } from "../shared/storage.service";
import { SubredditPageModule } from '../pages/subreddit/subreddit.module';

@NgModule({
  declarations: [
    MyApp,
    CommentsPage,
    SortByPopover,
    LoginPage,
    CreatePostPage,
    CreateSubredditPage,
    ProfilePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {locationStrategy: 'path'}, {
      links: [
        { component: HomePage, name: 'home', segment: '' },
        { component: SubredditPage, name: 'subreddit', segment: 'r/:name', defaultHistory: ['home'] },
        { component: ProfilePage, name: 'profile', segment: 'u/:username', defaultHistory: ['home'] },
      ]}),
    IonicStorageModule.forRoot({
      name: '_redditclonedb',
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
    ProfilePage,
    SortByPopover
  ],
  providers: [
    StatusBar, SettingsProvider,StorageService,
    SplashScreen, DataSharingService, AuthService, DatabaseService,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
