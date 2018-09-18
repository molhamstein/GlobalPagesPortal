import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fuseAnimations } from '../../../../../core/animations';
import { usersService } from '../../../../../core/services/users.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Component({
    selector   : 'edit-users',
    templateUrl: './edit-users.component.html',
    styleUrls  : ['./edit-users.component.scss'],
    animations : fuseAnimations
})
export class editUsersComponent implements OnInit
{
    form: FormGroup;
    formErrors: any;
    genders = [{value:"male", viewValue:"Male"}, {value: "female", viewValue:"Female"}];
    editedUser:any ={};
    id:any;

    constructor(private formBuilder: FormBuilder, private userServ: usersService,
         private route : Router, private snack: MatSnackBar, private activatedRoute: ActivatedRoute)
    {
        this.formErrors = {
            username   : {},
            email : {},
            phoneNumber  : {},
            gender   : {},
            birthDate  : {},
            status: {}
        };
    }

    ngOnInit()
    {
        this.activatedRoute.params.subscribe((params: any) => {
            this.id = params.id;

            this.userServ.getUserById(this.id).subscribe(res => {
                this.editedUser = res;
            })

        });

        this.form = this.formBuilder.group({
            username : ['', Validators.required],
            email  : ['', Validators.required],
            phoneNumber   : ['', Validators.required],
            gender  : ['', Validators.required],
            birthDate      : ['', Validators.required],
            status      : ['', Validators.required],
            emailVerified      : ['']
        });

        this.form.valueChanges.subscribe(() => {
            this.onFormValuesChanged();
        });
    }

    updateUser(){
        if(this.editedUser.birthDate instanceof Date) {
            this.editedUser.birthDate = this.editedUser.birthDate.toISOString();
        } 

        this.userServ.editUser(this.editedUser, this.id).subscribe(() => {
            this.route.navigate(['/pages/users-management']);
            this.snack.open("You Succesfully updated this User","Done", {
                duration: 2000,
              })
        },
        err => {
            this.snack.open("Please Re-enter the right user information..","OK")
        }
    )
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
