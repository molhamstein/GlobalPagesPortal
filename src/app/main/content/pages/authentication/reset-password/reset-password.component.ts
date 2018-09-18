import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FuseConfigService } from '../../../../../core/services/config.service';
import { fuseAnimations } from '../../../../../core/animations';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { authService } from '../../../../../core/services/auth.service';

@Component({
    selector   : 'reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls  : ['./reset-password.component.scss'],
    animations : fuseAnimations
})
export class ResetPasswordComponent implements OnInit
{
    resetPasswordForm: FormGroup;
    resetPasswordFormErrors: any;
    newPassword:any;
    confirmPassword:any;

    constructor(
        private fuseConfig: FuseConfigService,
        private formBuilder: FormBuilder,
        private authServ: authService,
        private route : Router
    )
    {
        this.fuseConfig.setSettings({
            layout: {
                navigation: 'none',
                toolbar   : 'none',
                footer    : 'none'
            }
        });

        this.resetPasswordFormErrors = {
            password       : {},
            passwordConfirm: {}
        };
    }

    ngOnInit()
    {
        this.resetPasswordForm = this.formBuilder.group({
            password       : ['', Validators.required],
            passwordConfirm: ['', Validators.required]
        });

        this.resetPasswordForm.valueChanges.subscribe(() => {
            this.onResetPasswordFormValuesChanged();
        });
    }

    reset(){
        var token = this.route.url.substr(27);
        this.authServ.resetPassword(this.newPassword,token).subscribe(res => {
            this.route.navigate(['/pages/auth/login']);
        })
    }

    onResetPasswordFormValuesChanged()
    {
        for ( const field in this.resetPasswordFormErrors )
        {
            if ( this.resetPasswordFormErrors.hasOwnProperty(field) )
            {
                continue;
            }

            // Clear previous errors
            this.resetPasswordFormErrors[field] = {};

            // Get the control
            const control = this.resetPasswordForm.get(field);

            if ( control && control.dirty && !control.valid )
            {
                this.resetPasswordFormErrors[field] = control.errors;
            }
        }
    }
}
