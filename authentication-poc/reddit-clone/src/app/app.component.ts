import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from "../shared/pages";
import { DataSharingService } from "../shared/data-sharing.service";


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = HomePage;

  constructor(platform: Platform, private dataSharing: DataSharingService, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      console.log(window.screen.height, window.screen.width);
      //setting screen height and width for web app to be mobile friendly
      this.dataSharing.setScreenX(window.screen.width);
      this.dataSharing.setScreenY(window.screen.height);
      let isMobile = platform.is('mobile');
      this.dataSharing.setIsMobile(isMobile);
    });
  }
}
