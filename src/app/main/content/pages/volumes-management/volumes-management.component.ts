import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { fuseAnimations } from '../../../../core/animations';
import swal from 'sweetalert2';
import { BusinessCategoriesService } from '../../../../core/services/business-cat.service';
import { AdsService } from '../../../../core/services/ads.service';
import { VolumesService } from '../../../../core/services/volumes.service.';
import { debounceTime, distinctUntilChanged, startWith, switchMap, tap } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

@Component({
    selector: 'volumes-management',
    templateUrl: './volumes-management.component.html',
    styleUrls: ['./volumes-management.component.scss'],
    animations: fuseAnimations,
})
export class VolumesManagementComponent implements AfterViewInit {


    displayedColumns = ['titleAr', 'titleEn', 'status', 'posts', 'icons'];
    dataSource = new MatTableDataSource<Volumes>([]);
    count = 0;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    filterControl: FormControl = new FormControl('');
    refreshSubject = new Subject();

    ngAfterViewInit(): void {


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

                return this.volServ.getVolumes(skip, limit, filter);
            })
        ).subscribe(response => {
            let { data, count } = response;
            this.count = count;
            this.dataSource.data = data;
        });
    }





    constructor(private volServ: VolumesService) {

    }

    ngOnInit() {

    }
    async deleteVolume(vol, id) {
        delete vol.order;
        delete vol.posts
        vol.status = "deactivated";
        await this.volServ.deleteVolume(id).toPromise();
        this.refreshSubject.next();

    }

    deleteModal(vol, id) {
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
                this.deleteVolume(vol, id);
                swal(
                    'Deleted!',
                    'Your file has been deleted.',
                    'success'
                )
            }
        })
    }

}


export interface Volumes {
    order: number;
    titleAr: string;
    titleEn: string;
    status: string;
    posts: any[]
}
