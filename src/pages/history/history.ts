import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { Http,Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-history',
  templateUrl: 'history.html',
})
export class HistoryPage {
  public id :any = [];
  public history :any = [];

  constructor(public store:Storage, public http : Http,public navCtrl: NavController, public navParams: NavParams, public toastCtrl:ToastController) {
  }

  ionViewWillEnter(){
    this.store.get('user').then((val) => {
      this.id = val.data.user.id ;

      let     headers  : any      = new Headers({ 'X-Requested-With': 'XMLHttpRequest'}),
              options  : any      = new RequestOptions({ headers: headers }),
              url      : any       = 'http://192.168.43.224:8000/api/history/' + this.id;

              this.http.get(url,options).map(res =>res.json())
              .subscribe(
               data =>  {
                   this.history = data.deposits;
               },

             error => {
               this.sendNotification("Something went wrong!!");
             });
    });
  }

  sendNotification(message)  : void
     {
        let notification = this.toastCtrl.create({
            message       : message,
            duration      : 5000
        });
        notification.present();
     }

}
