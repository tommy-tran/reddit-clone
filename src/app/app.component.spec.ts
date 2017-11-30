import { async, TestBed } from '@angular/core/testing';
import { IonicModule, Platform, IonicErrorHandler } from 'ionic-angular';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { MyApp } from './app.component';
import {
  PlatformMock,
  StatusBarMock,
  SplashScreenMock
} from '../../test-config/mocks-ionic';
import { SettingsProvider } from '../shared/theming.service';
import { StorageService } from '../shared/storage.service';
import { DataSharingService } from '../shared/data-sharing.service';
import { AuthService } from '../shared/auth.service';
import { DatabaseService } from '../shared/database.service';
import { ErrorHandler } from '@angular/core';
import { IonicStorageModule } from '@ionic/storage';

describe('MyApp Component', () => {
  let fixture;
  let component;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MyApp],
      imports: [
        IonicModule.forRoot(MyApp),
        IonicStorageModule.forRoot({
          name: '_redditclonedb',
          driverOrder: ['indexeddb', 'websql', 'sqlite']
        }),
      ],
      providers: [
        { provide: StatusBar, useClass: StatusBarMock },
        { provide: SplashScreen, useClass: SplashScreenMock },
        { provide: Platform, useClass: PlatformMock },
        StatusBar, SettingsProvider,StorageService,
        SplashScreen, DataSharingService, AuthService, DatabaseService,
        { provide: ErrorHandler, useClass: IonicErrorHandler }
      ]
    })
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyApp);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component instanceof MyApp).toBe(true);
  });
});