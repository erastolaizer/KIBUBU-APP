import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DepositPage } from '../deposit/deposit';
import { WithdrawPage } from '../withdraw/withdraw';

/**
 * Generated class for the WelcomePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  deposit(){
    this.navCtrl.push(DepositPage);
  }
  withdraw(){
    this.navCtrl.push(WithdrawPage);
  }
}
