import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage, SearchPage, SubredditPage, HomePage, TabsPage, LoginPage } from '../shared/pages';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { DataSharingService } from '../shared/data-sharing.service';
import { AuthService } from '../shared/auth.service';
import { DatabaseService } from '../shared/database.service';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    SearchPage,
    HomePage,
    TabsPage,
    LoginPage,
    SubredditPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    SearchPage,
    HomePage,
    TabsPage,
    LoginPage,
    SubredditPage
  ],
  providers: [
    StatusBar,
    SplashScreen, DataSharingService, AuthService, DatabaseService,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
