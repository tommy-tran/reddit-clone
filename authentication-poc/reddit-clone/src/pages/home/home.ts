import { Component } from '@angular/core';
import { NavController, AlertController, Events } from 'ionic-angular';
import { AuthService } from '../../shared/auth.service';
import { LoginPage, AboutPage } from '../../shared/pages';
import * as firebase from 'firebase';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  username: string;
  constructor(public navCtrl: NavController, private events: Events, private authService: AuthService) {
    this.username = authService.getUName();
  }
}
