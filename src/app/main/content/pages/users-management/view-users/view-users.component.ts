import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fuseAnimations } from '../../../../../core/animations';
import { usersService } from '../../../../../core/services/users.service';
import {  ActivatedRoute } from '@angular/router';
import { Location } from '../../../../../../../node_modules/@angular/common';

@Component({
    selector   : 'view-users',
    templateUrl: './view-users.component.html',
    styleUrls  : ['./view-users.component.scss'],
    animations : fuseAnimations
})
export class viewUsersComponent implements OnInit
{
    form: FormGroup;
    formErrors: any;
    selectedUser:any ={};
    id:any;

    constructor(private formBuilder: FormBuilder, private userServ: usersService,
         private loc : Location, private activatedRoute: ActivatedRoute)
    {

    }

    ngOnInit()
    {
        this.activatedRoute.params.subscribe((params: any) => {
            this.id = params.id;
        });
        
        this.userServ.getUserById(this.id).subscribe(res => {
            this.selectedUser = res;
            var temp = new Date(this.selectedUser.birthDate);
            this.selectedUser.birthDate = temp.toLocaleDateString('en-US');
            this.selectedUser.emailVerified = String(this.selectedUser.emailVerified); 
        })

        this.form = this.formBuilder.group({
            username : [''],
            password : [''],
            email  : [''],
            phoneNumber   : [''],
            gender  : [''],
            birthDate      : [''],
            status      : [''],
            emailVerified      : ['']
        });
    }

    back() {
        this.loc.back();
    }


  
}
