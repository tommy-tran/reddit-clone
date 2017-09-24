import { Component } from '@angular/core';

import { Events, NavController } from 'ionic-angular';
import { HomePage, ContactPage, LoginPage, AboutPage } from "../../shared/pages";
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = ContactPage;
  tab3Root = AboutPage;

  constructor(navCtrl: NavController, private events: Events) {
    this.events.subscribe('log out', () => {
      navCtrl.setRoot(LoginPage);
    });
  }
}
