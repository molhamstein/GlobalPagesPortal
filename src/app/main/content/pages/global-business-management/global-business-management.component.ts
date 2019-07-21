import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { fuseAnimations } from '../../../../core/animations';
import swal from 'sweetalert2';
import { VolumesService } from '../../../../core/services/volumes.service.';
import { GlobalBusinessService } from '../../../../core/services/global-business.service';
import { Subject } from 'rxjs/Subject';
import { debounceTime, distinctUntilChanged, tap, startWith, switchMap } from 'rxjs/operators';

@Component({
    selector: 'global-business-management',
    templateUrl: './global-business-management.component.html',
    styleUrls: ['./global-business-management.component.scss'],
    animations: fuseAnimations,
})
export class GlobalBusinessManagementComponent implements AfterViewInit {


    displayedColumns = ['order', 'nameAr', 'nameEn', 'status', 'description', 'icons'];
    dataSource = new MatTableDataSource<GlobalBusiness>([]);

    filterControl = new FormControl('');
    refreshSubject = new Subject();

    count = 0;
    @ViewChild(MatSort) sort;
    @ViewChild(MatPaginator) paginator;


    ngAfterViewInit() {


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

                return this.gbusServ.getGlobalBusiness(skip, limit, filter);
            })
        ).subscribe(response => {
            let { data, count } = response;
            this.count = count;
            this.dataSource.data = data;
        });

    }

    constructor(private gbusServ: GlobalBusinessService) {

    }


    async deleteGlobalBusiness(bus, id) {
        await this.gbusServ.deleteGlobalBusiness(id).toPromise();
        this.refreshSubject.next();
    }

    deleteModal(bus, id) {
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
                this.deleteGlobalBusiness(bus, id);
                swal(
                    'Deleted!',
                    'Your file has been deleted.',
                    'success'
                )
            }
        })
    }

   
}


export interface GlobalBusiness {
    order: number;
    nameAr: string;
    nameEn: string;
    status: string;
    description: string
}
