import { Component } from '@angular/core';
import { IonicPage,NavController, LoadingController, ToastController,NavParams} from 'ionic-angular';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Http,Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { RegisterPage } from '../register/register';
import { Storage } from '@ionic/storage';
import { WelcomePage } from '../welcome/welcome';
import { ForgetpassPage } from '../forgetpass/forgetpass';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  public login : FormGroup;
  public loading: any= [];

  constructor(public store:Storage, public http : Http,public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder, public loadingCtrl: LoadingController, private toastCtrl: ToastController) {
    this.login = this.formBuilder.group({
    phone_number: ['', Validators.required],
    password: ['', Validators.required],
  });
  }

  ionViewWillEnter(){

    this.store.get('user').then((val) => {
    this.login.patchValue({
      phone_number: val.data.user.phone_number,
      password    : val.password
    });
  }, error=> {
    console.log('no stored values');
  });
  }

  logForm()
      {
         let
             phone_number    : string    = this.login.controls["phone_number"].value,
             password     : string    = this.login.controls["password"].value;

             this.showLoader();
               let     headers  : any      = new Headers({ 'X-Requested-With': 'XMLHttpRequest'}),
                       options  : any      = new RequestOptions({ headers: headers }),
                       url      : any       = 'http://192.168.43.224:8000/api/user/login',
                       body    : any        = {phone_number:phone_number,password:password};

                       this.http.post(url,body,options).map(res =>res.json())
                       .subscribe(
                        data =>  {
                          let userdata = {data:data,password:password};
                          this.store.set('user',userdata);
                          this.sendNotification("You are successfully login");
                          this.navCtrl.setRoot(WelcomePage);
                        },

                      error => {
                        if (error.status === 401){
                       this.sendNotification("Wrong Phone Number or Password");
                        }
                        if(error.status === 500){
                       this.sendNotification("Internal Server error!!");
                        }
                        if(error.status === 0){
                       this.sendNotification("Server is temporary not responding!!");
                        }

                      });
                         this.loading.dismiss();

           }

register(){
  this.navCtrl.push(RegisterPage);
}
forgetPass(){
  this.navCtrl.push(ForgetpassPage);
}
showLoader(){
       this.loading = this.loadingCtrl.create({
           content: 'Login in...'
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
