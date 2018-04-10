import { Component } from '@angular/core';
import { IonicPage,NavController, LoadingController, ToastController,NavParams} from 'ionic-angular';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Http,Headers, RequestOptions } from '@angular/http';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-deposit',
  templateUrl: 'deposit.html',
})
export class DepositPage {

  public deposit : FormGroup;
  public loading: any= [];
  public id :any = [];
  public malengo :any = [];
  public pass :boolean = false ;
  public wakala :any = [];

  constructor(public store:Storage, public http : Http, public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder, public loadingCtrl: LoadingController, private toastCtrl: ToastController) {
    this.deposit = this.formBuilder.group({
    lengo: ['', Validators.required],
    phone_number: ['', Validators.compose([Validators.required,Validators.pattern('[0-9]*')])],
    password: ['', Validators.compose([Validators.required,Validators.pattern('[0-9]*')])],
    service_provider: ['', Validators.required],
    amount: ['', Validators.compose([Validators.required,Validators.pattern('[0-9]*')])],
  });
  }

  ionViewWillEnter(){

    this.store.get('user').then((val) => {
      this.id = val.data.user.id ;

      let     headers  : any      = new Headers({ 'X-Requested-With': ' '}),
              options  : any      = new RequestOptions({ headers: headers }),
              url      : any      = 'http://192.168.43.224:8000/api/lengo/' + this.id;

              this.http.get(url,options).map(res =>res.json())
              .subscribe(
               data =>  {
                if(data == []){
              this.sendNotification("Please Create Lengo first");
                }
                 else {
                   this.malengo = data.malengo;
                }
               },

             error => {
               this.sendNotification("Something went wrong!!");
             });
    });
  }
  onChange(Cvalue){
    this.wakala = Cvalue ;
    this.pass = true ;
  }

  depositForm(){
         let
             lengo              : string    = this.deposit.controls["lengo"].value,
             service_provider   : string    = this.deposit.controls["service_provider"].value,
             phone_number       : string    = this.deposit.controls["phone_number"].value,
             password           : string    = this.deposit.controls["password"].value,
             amount             : string    = this.deposit.controls["amount"].value;

             this.showLoader();
               let     headers  : any      = new Headers({ 'X-Requested-With': 'XMLHttpRequest'}),
                       options  : any      = new RequestOptions({ headers: headers }),
                       url      : any      = 'http://192.168.43.224:8000/api/deposit',
                       user_id  : any      =  this.id ,
                       body     : any      = {lengo:lengo, service_provider:service_provider,phone_number:phone_number, amount:amount,password:password, user_id:user_id};

                       this.http.post(url,body,options).map(res =>res.json())
                       .subscribe(
                        data =>  {
                          this.sendNotification("You are successfully deposit");
                          this.deposit.reset();
                        },

                      error => {
                        if(error.status === 0){
                          this.sendNotification("Something went wrong");
                        }
                        else if(error.status === 500){
                          this.sendNotification("Internal server error");
                        }
                        else if(error.status === 400){
                          this.sendNotification("Your "+ service_provider + " Account does not have enough money");
                        }
                        else if(error.status === 401){
                          this.sendNotification("Wrong "+ service_provider + " password");
                        }
                       else if(error.status === 404){
                          this.sendNotification("Number "+ phone_number + " does not have " + service_provider + " account");
                        }

                      else {
                          this.sendNotification("Server is temporary not responding!!");
                        }

                      });
                         this.loading.dismiss();
           }

  showLoader(){
         this.loading = this.loadingCtrl.create({
             content: 'Please Wait...'
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
