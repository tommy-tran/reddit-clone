import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from "@ionic/storage";

import { MyApp } from './app.component';
import { HomePage, SortByPopover, LoginPage, SubredditPage } from '../shared/pages';
import { DataSharingService } from '../shared/data-sharing.service';
import { AuthService } from '../shared/auth.service';
import { DatabaseService } from '../shared/database.service';
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    SortByPopover,
    LoginPage,
    SubredditPage
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
    SortByPopover
  ],
  providers: [
    StatusBar,
    SplashScreen, DataSharingService, AuthService, DatabaseService,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
