import { Component } from '@angular/core';
import { Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { SettingsProvider } from '../shared/theming.service';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = HomePage;
  selectedTheme: String;

  constructor(private events: Events, platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private theming: SettingsProvider) {
    //set up theme, event emitted in theme service
    this.events.subscribe('theme:retrieved', () => {
      this.getTheme();
    });
    platform.ready().then(() => {

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
  /**
   * get the active theme for the app
   */
  getTheme() {
    this.theming.getActiveTheme().subscribe(val => this.selectedTheme = val);
  };
}

