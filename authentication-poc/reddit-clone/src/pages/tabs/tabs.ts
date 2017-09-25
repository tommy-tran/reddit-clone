import { Component } from '@angular/core';

import { Events, NavController } from 'ionic-angular';
import { HomePage, SearchPage, LoginPage, AboutPage } from "../../shared/pages";
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = SearchPage;
  tab3Root = AboutPage;

  constructor(navCtrl: NavController, private events: Events) {
    this.events.subscribe('log out', () => {
      navCtrl.setRoot(LoginPage);
    });
  }
}
