import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FuseConfigService } from '../../../../../core/services/config.service';
import { fuseAnimations } from '../../../../../core/animations';
import { authService } from '../../../../../core/services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Component({
    selector   : 'fuse-login',
    templateUrl: './login.component.html',
    styleUrls  : ['./login.component.scss'],
    animations : fuseAnimations
})
export class FuseLoginComponent implements OnInit
{
    loginForm: FormGroup;
    loginFormErrors: any;
    user= {email:"", password:""};
    userDetails:any;

    constructor(
        private fuseConfig: FuseConfigService,
        private formBuilder: FormBuilder,
        private loginServ: authService,
        private route : Router,
        private snack: MatSnackBar
    )
    {
        this.fuseConfig.setSettings({
            layout: {
                navigation: 'none',
                toolbar   : 'none',
                footer    : 'none'
            }
        });

        this.loginFormErrors = {
            email   : {},
            password: {}
        };
    }

    ngOnInit()
    {
        this.loginForm = this.formBuilder.group({
            email   : ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });

        this.loginForm.valueChanges.subscribe(() => {
            this.onLoginFormValuesChanged();
        });

    }

    login(){
        this.loginServ.login(this.user).subscribe(res => {
             this.userDetails = res;
            if(this.userDetails.user.username == "Alan"){
                localStorage.setItem('authtoken', this.userDetails.id);
                localStorage.setItem('userFullName', this.userDetails.user.username);
                /* localStorage.setItem('userPermissions', JSON.stringify(res.userPermissions)); */
                this.route.navigate(['/pages/users-management'])
            }
            else {
                this.snack.open("You have to be an Admin to Login","Close")
               /*  window.location.href = '/pages/auth/login'; */
                /* this.route.navigate(['/pages/auth/login']) */
            }
        },
        err => {
            this.user.email="";
            this.user.password="";
            this.snack.open("You Entered a wrong Email or Password.. Please Re-enter", "Close")
        })
       /*  .catch((e:any) => {
            this.route.navigate(['/pages/auth/login']);
            return Observable.throw(e);
        }) */

    }

    onLoginFormValuesChanged()
    {
        for ( const field in this.loginFormErrors )
        {
            if ( !this.loginFormErrors.hasOwnProperty(field) )
            {
                continue;
            }

            // Clear previous errors
            this.loginFormErrors[field] = {};

            // Get the control
            const control = this.loginForm.get(field);

            if ( control && control.dirty && !control.valid )
            {
                this.loginFormErrors[field] = control.errors;
            }
        }
    }
}
