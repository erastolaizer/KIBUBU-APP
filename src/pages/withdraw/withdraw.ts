import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController,NavParams} from 'ionic-angular';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Http,Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'page-withdraw',
  templateUrl: 'withdraw.html',
})
export class WithdrawPage {
  public withdraw : FormGroup;
  public loading: any= [];
  public id :any = [];
  public malengo :any = [];
  public expire :any = [];
  public period :any = [];
  public err :any = [];
 public canDraw :boolean = false ;

  constructor(public store:Storage, public http : Http,public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder, public loadingCtrl: LoadingController, private toastCtrl: ToastController) {
    this.withdraw = this.formBuilder.group({
    lengo_name: ['', Validators.required],
    phone_number: ['', Validators.compose([Validators.required,Validators.pattern('[0-9]*')])],
    service_provider: ['', Validators.required],
    password: ['', Validators.required],

  });
  }

  ionViewWillEnter(){

    this.store.get('user').then((val) => {
      this.id = val.data.user.id ;

      let     headers  : any      = new Headers({ 'X-Requested-With': 'XMLHttpRequest'}),
              options  : any      = new RequestOptions({ headers: headers }),
              url      : any       = 'http://kibubu.dreamgeeks.tech/public/api/lengo/' + this.id;

              this.http.get(url,options).map(res =>res.json())
              .subscribe(
               data =>  {
                if(data == []){
              this.sendNotification("Please Create Lengo first");
                } else{
                   this.malengo = data.malengo;
                }
               },

             error => {
               this.sendNotification("Something went wrong!!");
             });
    });
  }
  withdrawForm()
      {
         let
             lengo_name        : string    = this.withdraw.controls["lengo_name"].value,
             service_provider  : string    = this.withdraw.controls["service_provider"].value,
             phone_number      : string    = this.withdraw.controls["phone_number"].value,
             password          : string    = this.withdraw.controls["password"].value;

             this.showLoader();
               let     headers  : any      = new Headers({ 'X-Requested-With': 'XMLHttpRequest'}),
                       options  : any      = new RequestOptions({ headers: headers }),
                       url      : any      = 'http://kibubu.dreamgeeks.tech/public/api/withdraw',
                       user_id  : any      =  this.id ,
                       body    : any        = {lengo_name:lengo_name, service_provider:service_provider,phone_number:phone_number, user_id:user_id, password:password};

                       this.http.post(url,body,options).map(res =>res.json())
                       .subscribe(
                        (data )=>  {
                          this.sendNotification("You are successfully withdraw");
                          console.log(data);
                          this.withdraw.reset();
                        },

                       error => {
                        if(error.status === 0){
                          this.sendNotification("Something went wrong");
                        }
                        if(error.status === 500){
                          this.sendNotification("Internal server error");
                        }
                        if(error.status === 401){
                          this.sendNotification("Wrong KIBUBU Password");
                        }
                        if(error.status === 404){
                          this.sendNotification("Number "  +phone_number + " does not have " + service_provider +" account ");
                        }
                        if(error.status === 400){
                         this.err = error.json();
                         console.log(this.err);
                          this.canDraw = true ;
                          this.expire =this.err.expire.date;
                          this.period = this.err.time ;
                          this.sendNotification("You cant withdraw now");
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
