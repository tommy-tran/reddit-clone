import { Events, ViewController, NavParams } from "ionic-angular";
import { Component } from "@angular/core";

@Component({
    template: `
    <ion-content padding>
      <p>Sort Posts By:</p>
      <div style="width: 100%; border-bottom: 1px solid lightgrey"></div>
      <ion-list>
        <button (click)="selectSortMethod('hot')" ion-item no-lines>
          <ion-icon *ngIf="sortMethod == 'hot'" color="someblue" name="flame"></ion-icon>
          <ion-icon *ngIf="!(sortMethod == 'hot')" color="prettygray" name="flame"></ion-icon>
          Hot
        </button>
        <button (click)="selectSortMethod('new')" ion-item no-lines>
          <ion-icon *ngIf="sortMethod == 'new'" color="someblue" name="star"></ion-icon>
          <ion-icon *ngIf="!(sortMethod == 'new')" color="prettygray" name="star"></ion-icon>
          New
        </button>
        <button (click)="selectSortMethod('top')" ion-item no-lines>
          <ion-icon *ngIf="sortMethod == 'top'" color="someblue" name="podium"></ion-icon>
          <ion-icon *ngIf="!(sortMethod == 'top')" color="prettygray" name="podium"></ion-icon>
          Top
        </button>
      </ion-list>
    </ion-content>
    `
  })
  export class SortByPopover {
    sortMethod: string;
    constructor(private viewCtrl: ViewController, private navParams: NavParams) {
      if (this.navParams.data.sortMethod) {
        this.sortMethod = navParams.data.sortMethod;
      }
      else {
        this.sortMethod = 'hot';
      }
    }
    /**
     * sort posts by a sort method
     * @param sortMethod method to sort by
     */
    selectSortMethod(sortMethod: 'hot' | 'new' | 'top') {
      let icons = { hot: 'flame', new: 'star', top: 'podium' }
      this.sortMethod = sortMethod;
      this.viewCtrl.dismiss({ sortMethod: sortMethod, icon: icons[sortMethod] });
    }
  }
  