import { Component } from '@angular/core';
import { IonicPage,NavController, LoadingController, ToastController,NavParams} from 'ionic-angular';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Http,Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'page-lengo',
  templateUrl: 'lengo.html',
})
export class LengoPage {

  public lengo : FormGroup;
  public loading: any= [];
  public id :any = [];
  constructor(public store:Storage, public http : Http,public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder, public loadingCtrl: LoadingController, private toastCtrl: ToastController) {
    this.lengo = this.formBuilder.group({
    lengo_name: ['', Validators.required],
    time: ['', Validators.required],
  });
  }
  ionViewWillEnter(){

    this.store.get('user').then((val) => {
      this.id = val.data.user.id ;
    });
  }

  lengoForm()
      {
         let
             lengo_name    : string    = this.lengo.controls["lengo_name"].value,
             time          : string    = this.lengo.controls["time"].value;

             this.showLoader();
               let     headers  : any      = new Headers({ 'X-Requested-With': 'XMLHttpRequest'}),
                       options  : any      = new RequestOptions({ headers: headers }),
                       url      : any      = 'http://192.168.43.224:8000/api/lengo',
                       user_id       : any      =  this.id ,
                       body    : any        = {lengo_name:lengo_name, time:time, user_id:user_id};
               console.log(user_id);
                       this.http.post(url,body,options).map(res =>res.json())
                       .subscribe(
                        data =>  {
                          this.sendNotification("You are successfully create lengo");
                        },

                      error => {
                        if (error.status === 401){
                       this.sendNotification("You are not authorized");
                        }
                        if (error.status === 400){
                       this.sendNotification("Lengo already created");
                        }
                        else if(error.status === 0){
                       this.sendNotification("Please check your internet connections!!");
                        }
                        this.sendNotification("Something went wrong");

                      });
                         this.loading.dismiss();

           }


showLoader(){
       this.loading = this.loadingCtrl.create({
           content: 'Please wait...'
       });

       this.loading.present();
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
