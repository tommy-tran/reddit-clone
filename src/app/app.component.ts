import { Component } from '@angular/core';
import { Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { SettingsProvider } from '../shared/theming.service';
import { StorageService } from "../shared/storage.service";
import { DataSharingService } from '../shared/data-sharing.service';
import { DatabaseService } from '../shared/database.service';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  isMobile: boolean;
  rootPage: any = HomePage;
  selectedTheme: String;

  constructor(private events: Events, 
    private dataSharing: DataSharingService,
    private databaseService: DatabaseService,
    platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public storageService: StorageService, private theming: SettingsProvider) {
    //set up theme, event emitted in theme service
    this.events.subscribe('theme:retrieved', () => {
      this.getTheme();
    });
    platform.ready().then(() => {
      //this.dataSharing.setScreenX(platform.width());
      this.isMobile = platform.is('mobile');
      this.dataSharing.setIsMobile(this.isMobile);
      this.events.publish('platform:ready');
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      //initialize subscribed subreddits
      this.storageService.getSubscribedSubreddits().then(subscribedSubreddits => {
        this.storageService.setInitSubreddits(subscribedSubreddits);
      });

    });
  }
  /**
   * get the active theme for the app
   */
  getTheme() {
    this.theming.getActiveTheme().subscribe(val => this.selectedTheme = val);
  };
}

