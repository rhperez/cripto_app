import { Component } from '@angular/core';
import { Platform, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage, SettingsPage} from '../pages/index.pages';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  rootPage:any = HomePage;
  public settingsPage = SettingsPage;
  public homePage = HomePage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private menuController: MenuController) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  public openPage(page: any) {
    this.rootPage = page;
    this.menuController.close();
  }
}
