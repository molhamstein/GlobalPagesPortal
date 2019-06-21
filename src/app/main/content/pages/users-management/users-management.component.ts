import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';


import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { fuseAnimations } from '../../../../core/animations';
import { usersService } from '../../../../core/services/users.service';
/* import 'sweetalert2/src/sweetalert2.scss' */
import swal from 'sweetalert2';

@Component({
    selector: 'users-management',
    templateUrl: './users-management.component.html',
    styleUrls: ['./users-management.component.scss'], /* ,'../../../../../../node_modules/sweetalert2/dist/sweetalert2.css' */
    animations: fuseAnimations,
})
export class UsersManagementComponent implements OnInit {


    displayedColumns = ['order', 'username', 'email', 'gender', 'phoneNumber', 'role' , 'icons' ];
    dataSource = new MatTableDataSource<Users>([]);
    myData: Users[] = [];
    myData1: any;
    count: any;
    skip = 0;
    pagOrder = 0;
    pagIndex = 0;
    tempLength = 0;
    fValue:any="";

    private paginator: MatPaginator; private sort: MatSort;
    @ViewChild(MatSort) set matSort(ms: MatSort) { this.sort = ms }
    @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) { this.paginator = mp }

    /* setDataSourceAttributes() { 
        this.dataSource.paginator = this.paginator; 
        this.dataSource.sort = this.sort;
        this.usersServ.getUsersCount().subscribe(res => {
            this.count = res.count;
            
        })
    } */

    /*  @ViewChild(MatPaginator) paginator: MatPaginator;
     @ViewChild(MatSort) sort: MatSort; */

    constructor(private usersServ: usersService) {
        // Create 100 users
        /*  const users: UserData[] = [];
         for ( let i = 1; i <= 100; i++ )
         {
             users.push(createNewUser(i));
         } */


        // Assign the data to the data source for the table to render
        /* this.dataSource = new MatTableDataSource(users); */
    }

    /**
     * Set the paginator and sort after the view init since this component will
     * be able to query its view for the initialized paginator and sort.
     */
    ngOnInit() {
        setTimeout(() => {
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.pagIndex = this.dataSource.paginator.pageIndex;
            this.usersServ.getUsersCount().subscribe(res => {
                this.count = res.count;

            })
        })

        this.getUsers();

        /*   if (this.paginator != undefined || this.sort != undefined) {
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
          }
          else {
              setTimeout(() => {
                  this.dataSource.paginator = this.paginator;
                  this.dataSource.sort = this.sort;
              }, 2000)
          } */

    }


    onPaginateChange(event) {
        if(this.fValue != "") {
            return;
        }
        if (event.pageIndex > this.pagIndex) {
            this.skip = this.skip + 5;
            this.usersServ.getUsers(this.skip).subscribe(res => {
                this.myData = res;
                for (let index = 0; index < this.myData.length; index++) {
                    this.myData[index].order = this.pagOrder + 1;
                    this.pagOrder = this.myData[index].order;
                }
                this.tempLength = this.myData.length;
                this.dataSource.data = this.myData;

            })
            this.pagIndex = event.pageIndex;
        }
        else if (event.pageIndex < this.pagIndex) {
            this.skip = this.skip - 5;
            this.pagOrder = this.pagOrder - (this.tempLength + 5);
            this.usersServ.getUsers(this.skip).subscribe(res => {
                this.myData = res;
                for (let index = 0; index < this.myData.length; index++) {
                    this.myData[index].order = this.pagOrder + 1;
                    this.pagOrder = this.myData[index].order;
                }
                this.tempLength = this.myData.length;
                this.dataSource.data = this.myData;

            })
            this.pagIndex = event.pageIndex;
        }

    }

    onFilter(filterValue) {
        if (filterValue == "") {
            this.skip = 0;
            this.ngOnInit();
            
 /*            this.usersServ.getUsersCount().subscribe(res => {
                this.count = res.count;
            })
            
            this.usersServ.getUsers(this.skip).subscribe(res => {
                this.myData = res;

                for (let index = 0; index < this.myData.length; index++) {
                    this.myData[index].order = index + 1;
                    this.pagOrder = this.myData[index].order;
                }
            })
            this.dataSource.data = this.myData;
            this.dataSource.paginator.length = this.count; */
            
        }
        else {
            this.usersServ.filterUser(filterValue).subscribe(res => {
                for (let index = 0; index < res.length; index++) {
                    res[index].order = index + 1;
                }
                this.count = res.length;
                this.paginator.length = this.count;
                this.dataSource.paginator = this.paginator;
                this.dataSource.data = res;
            })
        }

    }

    getUsers() {
        this.usersServ.getUsers(this.skip).subscribe(res => {
            this.myData = res;

            for (let index = 0; index < this.myData.length; index++) {
                this.myData[index].order = index + 1;
                this.pagOrder = this.myData[index].order;
            }
            this.tempLength = this.myData.length;
            this.dataSource = new MatTableDataSource(this.myData);
        })

    }

    deleteUser(user, id) {
        delete user.order;
        user.status = "deactivated";
        user.emailVerified = true;
        this.usersServ.deleteUser(user, id).subscribe(() => {
            console.log("deactivated");
            this.pagOrder = this.pagOrder - this.tempLength;
            this.usersServ.getUsers(this.skip).subscribe(res => {
                this.myData = res;
                for (let index = 0; index < this.myData.length; index++) {
                    this.myData[index].order = this.pagOrder + 1;
                    this.pagOrder = this.myData[index].order;
                }
                this.tempLength = this.myData.length;
                this.dataSource.data = this.myData;

            })
            /* this.getUsers(); */
        })
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

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
        this.dataSource.filter = filterValue;
    }
}

/** Builds and returns a new User. */
/* function createNewUser(id: number): UserData
{
    const name =
              NAMES[Math.round(Math.random() * (NAMES.length - 1))] + ' ' +
              NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) + '.';

    return {
        id      : id.toString(),
        name    : name,
        progress: Math.round(Math.random() * 100).toString(),
        color   : COLORS[Math.round(Math.random() * (COLORS.length - 1))]
    };
} */

/** Constants used to fill up our data base. */
/* const COLORS = [
    'maroon', 'red', 'orange', 'yellow', 'olive', 'green', 'purple',
    'fuchsia', 'lime', 'teal', 'aqua', 'blue', 'navy', 'black', 'gray'
];
const NAMES = [
    'Maia', 'Asher', 'Olivia', 'Atticus', 'Amelia', 'Jack',
    'Charlotte', 'Theodore', 'Isla', 'Oliver', 'Isabella', 'Jasper',
    'Cora', 'Levi', 'Violet', 'Arthur', 'Mia', 'Thomas', 'Elizabeth'
]; */

export interface Users {
    order: number;
    username: string;
    email: string;
    phoneNumber: string;
    gender: string
}


