import { Component, OnInit } from '@angular/core';
import { fuseAnimations } from '../../../../core/animations';
import { PushNotificationService } from '../../../../core/services/push-notification.service';
import { FormControl, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { usersService } from '../../../../core/services/users.service';
import { startWith, map } from 'rxjs/operators';
import { MatTableDataSource, MatSnackBar } from '@angular/material';
import { Location } from '@angular/common';


@Component({
    selector: 'push-notification',
    templateUrl: './push-notification.component.html',
    styleUrls: ['./push-notification.component.scss'],
    animations: fuseAnimations,
})

export class PushNotificationComponent implements OnInit {

    myControl = new FormControl();
    filteredOptions: Observable<Users[]>;
    displayedColumns = ['order', 'username', 'email', 'icons'];
    dataSource = new MatTableDataSource<Users>([]);
    myData: Users[] = [];
    users: Users[] = [];
    selectedUser: any = {};
    order = 0;
    loadingIndicator = false;

    types: any[] = ["now", "later", "yesterday"];
    newNotification: any = {};
    
    constructor(private formBuilder: FormBuilder,private notif: PushNotificationService,
         private userServ : usersService, private snack: MatSnackBar,private loc : Location) {
       
    }

    ngOnInit() {
        this.dataSource = new MatTableDataSource(this.myData);

        this.userServ.getAllUsers().subscribe(res => {
            this.users = res;
            for (let index = 0; index < this.users.length; index++) {
                if (this.users[index].username == null || this.users[index].username == ""){
                    this.users.splice(index,1);
                    index--;
                }
            }
            this.filteredOptions = this.myControl.valueChanges
                .pipe(
                    startWith<string | Users>(''),
                    map(value => typeof value === 'string' ? value : value.username),
                    map(username => username ? this._filter(username) : this.users.slice())
                );
        })
    }

    displayFn(user?: Users): string | undefined {
        return user ? user.username : undefined;
    }

    private _filter(username: string): Users[] {
        const filterValue = username.toLowerCase();

        return this.users.filter(user => user.username.toLowerCase().indexOf(filterValue) === 0);
    }

    pushUser() {
        for (let j = 0; j < this.users.length; j++) {
            if (this.selectedUser.username == this.users[j].username) {
                for (let index = 0; index < this.myData.length; index++) {
                    if (this.selectedUser == this.myData[index]) {
                        this.snack.open('This User has been Already Added', 'Ok', { duration: 2000 })
                        return
                    }
                }
                this.order++;
                this.selectedUser.order = this.order;
                this.myData.push(this.selectedUser);
                this.dataSource.data = this.myData;
                this.selectedUser = "";
                return
            }
        }
        this.snack.open('There is no User with this Username', 'Ok', { duration: 2000 })
        return
    }

    deleteUser(user) {
        var i = this.myData.indexOf(user, 0);
        for (let index = i + 1; index < this.myData.length; index++) {
            this.myData[index].order--;
        }
        this.myData.splice(i, 1);
        this.order = this.myData.length;
        this.dataSource.data = this.myData;
    }

    sendNotificaion(){
        this.loadingIndicator = true;
        this.newNotification.recipients = [];
        for (let index = 0; index < this.myData.length; index++) {
            this.newNotification.recipients.push(this.myData[index].id)
        }
        this.notif.addNewNotification(this.newNotification).subscribe((res:any) => {
            this.loc.back();
            this.snack.open("You Succesfully sent new Notification", "Done", {
                duration: 2000,
            })
            this.loadingIndicator = false;
        },
        err => {
            this.loadingIndicator = false;
            this.snack.open("Please Re-enter the right Notification information..", "OK")
        })
    }

    back() {
        this.loc.back();
    }


}

export interface Users {
    order: number;
    username: string;
    email: string;
    id:number;
}



