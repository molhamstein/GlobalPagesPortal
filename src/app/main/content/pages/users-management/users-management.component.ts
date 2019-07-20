import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';


import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { fuseAnimations } from '../../../../core/animations';
import { usersService } from '../../../../core/services/users.service';
/* import 'sweetalert2/src/sweetalert2.scss' */
import swal from 'sweetalert2';
import { authService } from '../../../../core/services/auth.service';
import { startWith, switchMap, debounce, debounceTime, distinctUntilChanged, merge, tap } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';


@Component({
    selector: 'users-management',
    templateUrl: './users-management.component.html',
    styleUrls: ['./users-management.component.scss'], /* ,'../../../../../../node_modules/sweetalert2/dist/sweetalert2.css' */
    animations: fuseAnimations,
})
export class UsersManagementComponent implements AfterViewInit {
    count = 0;

    refreshSubject = new Subject();
    async ngAfterViewInit() {

        let filterInputSubject = this.filterControl.valueChanges.pipe(debounceTime(300), distinctUntilChanged(), tap(() => {
            this.paginator.pageIndex = 0;
        }));
       
        this.paginator.page.merge(filterInputSubject, this.refreshSubject).pipe(
            startWith({}),
            switchMap(() => {
                let limit = this.paginator.pageSize;
                let pageIndex = this.paginator.pageIndex;
                let skip = pageIndex * limit;
                let filter = this.filterControl.value;

                return this.usersServ.getUsers(skip, limit, filter);
            })
        ).subscribe(response => {
            let { data, count } = response;
            this.count = count;
            this.dataSource.data = data;
        });


    }


    displayedColumns = ['username', 'email', 'gender', 'phoneNumber', 'role', 'icons'];
    dataSource: MatTableDataSource<Users[]> = new MatTableDataSource([]);

    filterControl = new FormControl('');

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(private usersServ: usersService, private authservice: authService) { }


    async deleteUser(user, id) {
        delete user.order;
        user.status = "deactivated";
        user.emailVerified = true;
        await this.usersServ.deleteUser(user, id).toPromise();
        this.refreshSubject.next();
    }

    deleteModal(user, id) {
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
                this.deleteUser(user, id);
                swal(
                    'Deleted!',
                    'Your file has been deleted.',
                    'success'
                )
            }
        })
    }


    get canEdit(): boolean {
        return this.authservice.hasAnyPrivilege(['crud-users', 'edit-user']);
    }

    get canAdd(): boolean {
        return this.authservice.hasAnyPrivilege(['crud-users', 'add-user']);
    }

    get canDelete(): boolean {
        return this.authservice.hasAnyPrivilege(['crud-users', 'delete-user']);
    }
}

export interface Users {
    order: number;
    username: string;
    email: string;
    phoneNumber: string;
    gender: string
}


