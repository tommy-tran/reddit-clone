import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthService } from '../../shared/auth.service';
import * as firebase from 'firebase';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  username: string;
  constructor(public navCtrl: NavController, private authService: AuthService) {
    this.username = authService.getUName();
  }
}
