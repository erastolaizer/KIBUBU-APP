import { Component } from '@angular/core';
import { IonicPage,NavController, LoadingController, ToastController} from 'ionic-angular';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Http,Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  public register : FormGroup;
  public loading: any= [];

  constructor(public http : Http, private formBuilder: FormBuilder, public navCtrl: NavController, public loadingCtrl: LoadingController, private toastCtrl: ToastController) {
    this.register = this.formBuilder.group({
    name: ['', Validators.required],
    phone_number: ['', Validators.required],
    password: ['', Validators.required],
    repeat_pass: ['', Validators.required],
  });
  }

  regForm()
      {
         let
             name  : string   = this.register.controls["name"].value,
             phone_number    : string    = this.register.controls["phone_number"].value,
             password     : string    = this.register.controls["password"].value,
             repeat_pass     : string    = this.register.controls["repeat_pass"].value;
             this.showLoader();

             if (password === repeat_pass){
               let     headers  : any      = new Headers({ 'X-Requested-With': 'XMLHttpRequest'}),
                       options  : any      = new RequestOptions({ headers: headers }),
                       url      : any       = 'http://kibubu.dreamgeeks.tech/public/api/user',
                       body    : any        = {name:name,phone_number:phone_number,password:password};

                       this.http.post(url,body,options).map(res =>res.json())
                       .subscribe(
                        data =>  {
                          this.sendNotification("You are successfully create your account");
                          this.navCtrl.pop();
                        },

                      error => {
                        if (error.status === 422){
                       this.sendNotification("Phone number already exist!!");
                        }
                        if (error.status === 0){
                       this.sendNotification("Server is temporary not responding!!");
                        }
                        else {
                         this.sendNotification("Server down!!");
                          }
                      //   console.log(error);
                      });
                         this.loading.dismiss();
             }

             else {
               this.sendNotification('Password and Repeat Password do not match') ;
               this.loading.dismiss();
             }
           }

  showLoader(){
         this.loading = this.loadingCtrl.create({
             content: 'Registering...'
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
