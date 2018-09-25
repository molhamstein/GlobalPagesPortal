import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fuseAnimations } from '../../../../../core/animations';
import { usersService } from '../../../../../core/services/users.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '../../../../../../../node_modules/@angular/common';
import swal from 'sweetalert2';

@Component({
    selector: 'view-users',
    templateUrl: './view-users.component.html',
    styleUrls: ['./view-users.component.scss'],
    animations: fuseAnimations
})
export class viewUsersComponent implements OnInit {
    form: FormGroup;
    formErrors: any;
    selectedUser: any = {};
    id: any;
    previousRoute: string;


    constructor(private formBuilder: FormBuilder, private userServ: usersService, private route: Router,
        private loc: Location, private activatedRoute: ActivatedRoute) {

    }

    ngOnInit() {

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
            username: [''],
            password: [''],
            email: [''],
            phoneNumber: [''],
            gender: [''],
            birthDate: [''],
            status: [''],
            emailVerified: ['']
        });
    }

    back() {
        this.loc.back();
      
    }

    deleteUser() {

        this.selectedUser.status = "deactivated";
        this.userServ.deleteUser(this.selectedUser, this.selectedUser.id).subscribe(() => {
            console.log("deactivated");
            this.route.navigate(['/pages/users-management']);
        })
    }

    deleteModal() {
        swal({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.value) {
                this.deleteUser();
                swal(
                    'Deleted!',
                    'Your file has been deleted.',
                    'success'
                )
            }
        })
    }

}
