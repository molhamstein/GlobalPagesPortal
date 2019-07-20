import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { fuseAnimations } from '../../../../core/animations';
import swal from 'sweetalert2';
import { BusinessCategoriesService } from '../../../../core/services/business-cat.service';
import { AdsService } from '../../../../core/services/ads.service';
import { Subject } from 'rxjs/Subject';
import { debounceTime, startWith, switchMap, distinctUntilChanged, tap } from 'rxjs/operators';

@Component({
    selector: 'ads-management',
    templateUrl: './ads-management.component.html',
    styleUrls: ['./ads-management.component.scss'],
    animations: fuseAnimations,
})
export class AdsManagementComponent implements AfterViewInit {


    filterControl = new FormControl('');
    refreshSubject = new Subject();


    displayedColumns = ['title', 'description', 'status', 'thumbnail', 'icons'];
    dataSource = new MatTableDataSource<Ads>([]);
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

                return this.adServ.getAds(skip, limit, filter);
            })
        ).subscribe(response => {
            let { data, count } = response;
            this.count = count;
            this.dataSource.data = data;
        });

    }

    constructor(private adServ: AdsService) {

    }

    ngOnInit() {


    }



    async deleteAd(ad, id) {
        delete ad.order;
        delete ad.owner;
        delete ad.category;
        delete ad.subCategory;
        delete ad.city;
        delete ad.location;
        delete ad.thumbnail;
        // ad.status = "deactivated";
        await this.adServ.deleteAd(id).toPromise();
        this.refreshSubject.next();
    }

    deleteModal(ad, id) {
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
                this.deleteAd(ad, id);
                swal(
                    'Deleted!',
                    'Your file has been deleted.',
                    'success'
                )
            }
        })
    }

}


export interface Ads {
    order: number;
    title: string;
    description: string;
    status: string;
    thumbnail: string
}
