import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/Rx';
import { Storage } from "@ionic/storage";
import { Events } from 'ionic-angular';
 
@Injectable()
export class SettingsProvider {
 
    private theme: BehaviorSubject<String>;
 
    constructor(private storage: Storage, private events: Events) {
        this.storage.get('app-theme').then(theme => {
            if (theme) {
                this.theme = new BehaviorSubject(theme);
            }
            else {
                this.theme = new BehaviorSubject('light-theme');
            }
            this.events.publish('theme:retrieved');
        });
    }
    /**
     * set a theme for the app
     * @param val name of theme
     */
    setActiveTheme(val) {
        this.theme.next(val);
        this.storage.set('app-theme', val);
    }
    /**
     * return the active theme for the app
     */
    getActiveTheme() {
        return this.theme.asObservable();
    }
}