import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from "@ionic/storage";

import { MyApp } from './app.component';
import { HomePage, LoginPage, SubredditPage, CreatePostPage, CreateSubredditPage } from '../shared/pages';
import { PostComponent } from '../components/post/post';
import { DataSharingService } from '../shared/data-sharing.service';
import { AuthService } from '../shared/auth.service';
import { DatabaseService } from '../shared/database.service';
import { SortByPopover } from '../components/sortBy/sortBy';
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    SortByPopover,
    LoginPage,
    SubredditPage,
    CreatePostPage,
    CreateSubredditPage,
    PostComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot({
      driverOrder: ['indexeddb', 'websql', 'sqlite']
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
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
