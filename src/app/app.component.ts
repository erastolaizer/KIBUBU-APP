import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { WelcomePage } from '../pages/welcome/welcome';
import { HomePage } from '../pages/home/home';
import { LengoPage } from '../pages/lengo/lengo';
import { DepositPage } from '../pages/deposit/deposit';
import { BalancePage } from '../pages/balance/balance';
import { HistoryPage } from '../pages/history/history';
import { WithdrawPage } from '../pages/withdraw/withdraw';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: WelcomePage },
      { title: 'Create Lengo', component: LengoPage },
      { title: 'Deposit', component: DepositPage },
      { title: 'Withdraw Cash', component: WithdrawPage },
      { title: 'Check Balance', component: BalancePage },
      { title: 'Transaction History', component: HistoryPage }

    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
