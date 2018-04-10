import { Component } from '@angular/core';
import { IonicPage,NavController,NavParams, LoadingController, ToastController} from 'ionic-angular';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Http,Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-forgetpass',
  templateUrl: 'forgetpass.html',
})
export class ForgetpassPage {
  public forgetp : FormGroup;
  public loading: any= [];

  constructor(public http : Http, private formBuilder: FormBuilder, public navCtrl: NavController, public loadingCtrl: LoadingController, private toastCtrl: ToastController) {
    this.forgetp = this.formBuilder.group({
    name: ['', Validators.required],
    phone_number: ['', Validators.required],
    password: ['', Validators.required],
    repeat_pass: ['', Validators.required],
  });
  }

  forgetpass()
      {
         let
             name  : string   = this.forgetp.controls["name"].value,
             phone_number    : string    = this.forgetp.controls["phone_number"].value,
             password     : string    = this.forgetp.controls["password"].value,
             repeat_pass     : string    = this.forgetp.controls["repeat_pass"].value;
             this.showLoader();

             if (password === repeat_pass){
               let     headers  : any      = new Headers({ 'X-Requested-With': 'XMLHttpRequest'}),
                       options  : any      = new RequestOptions({ headers: headers }),
                       url      : any       = 'http://192.168.43.224:8000/api/user/forgetPass',
                       body    : any        = {name:name,phone_number:phone_number,password:password};

                       this.http.post(url,body,options).map(res =>res.json())
                       .subscribe(
                        data =>  {
                            this.sendNotification("You are successfully renew your password");
                            this.navCtrl.pop();
                        },

                      error => {
                      if (error.status === 0){
                       this.sendNotification("Please check your internet connections!!");
                        }
                      else if (error.status === 402) {
                          this.sendNotification("Full name Invalid, please register");
                        }
                        else if (error.status === 401) {
                          this.sendNotification("Invalid phone_number, please enter details correctly");
                        }
                        else {
                         this.sendNotification("Server is temporary not responding!!");
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
             content: 'Waiting...'
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
