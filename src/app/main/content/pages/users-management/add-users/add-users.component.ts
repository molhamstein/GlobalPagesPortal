import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fuseAnimations } from '../../../../../core/animations';
import { usersService } from '../../../../../core/services/users.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { Location } from '../../../../../../../node_modules/@angular/common';

@Component({
    selector   : 'add-users',
    templateUrl: './add-users.component.html',
    styleUrls  : ['./add-users.component.scss'],
    animations : fuseAnimations
})
export class addUsersComponent implements OnInit
{
    form: FormGroup;
    formErrors: any;
    genders = [{value:"male", viewValue:"Male"}, {value: "female", viewValue:"Female"}];
    selectStatus = ['pending', 'activated','deactivated'];
    newUser:any ={};

    loadingIndicator = false;

    constructor(private formBuilder: FormBuilder, private userServ: usersService, private route : Router,
         private snack: MatSnackBar, private loc : Location)
    {
        this.formErrors = {
            username   : {},
            password: {},
            email : {},
            phoneNumber  : {},
            gender   : {},
            birthDate  : {},
            status: {}
        };
    }

    ngOnInit()
    {
        this.newUser.emailVerified = true;
        this.form = this.formBuilder.group({
            username : ['', Validators.required],
            password : ['', Validators.required],
            email  : ['', Validators.required],
            phoneNumber   : ['', Validators.required],
            gender  : ['', Validators.required],
            birthDate      : ['', Validators.required],
            status      : ['', Validators.required],
            emailVerified : ['']
        });

        this.form.valueChanges.subscribe(() => {
            this.onFormValuesChanged();
        });
    }

    saveUser(){
        this.loadingIndicator = true;
       /*  this.newUser.status="pending"; */
        this.newUser.imageProfile="";
        var dateTemp = new Date();
        this.newUser.creationDate = dateTemp.toISOString();
        this.newUser.birthDate = this.newUser.birthDate.toISOString();
        this.newUser.realm = "reg";
        /* this.newUser.emailVerified = true; */
        this.newUser.postCategoriesIds = [];
        this.userServ.addUser(this.newUser).subscribe(res => {
            this.loc.back();
            /* this.route.navigate(['/pages/users-management']); */
            this.snack.open("You Succesfully entered a new User","Done", {
                duration: 2000,
              })
              this.loadingIndicator = false;
        },
        err => {
            this.loadingIndicator = false;
            this.snack.open("Please Re-enter the right user information..","OK")
        }
    )
    }

    back() {
        this.loc.back();
    }

    onFormValuesChanged()
    {
        for ( const field in this.formErrors )
        {
            if ( !this.formErrors.hasOwnProperty(field) )
            {
                continue;
            }

            // Clear previous errors
            this.formErrors[field] = {};

            // Get the control
            const control = this.form.get(field);

            if ( control && control.dirty && !control.valid )
            {
                this.formErrors[field] = control.errors;
            }
        }
    }
}
