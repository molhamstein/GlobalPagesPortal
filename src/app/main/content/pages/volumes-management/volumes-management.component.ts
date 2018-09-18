import { Component, OnInit, ViewChild } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { fuseAnimations } from '../../../../core/animations';
import swal from 'sweetalert2';
import { BusinessCategoriesService } from '../../../../core/services/business-cat.service';
import { AdsService } from '../../../../core/services/ads.service';
import { VolumesService } from '../../../../core/services/volumes.service.';

@Component({
    selector: 'volumes-management',
    templateUrl: './volumes-management.component.html',
    styleUrls: ['./volumes-management.component.scss'],
    animations: fuseAnimations,
})
export class VolumesManagementComponent implements OnInit {

    displayedColumns = ['order', 'titleAr', 'titleEn', 'status', 'posts', 'icons'];
    dataSource = new MatTableDataSource<Volumes>([]);
    myData: Volumes[] = [];
    count: any;
    skip = 0;
    pagOrder = 0;
    pagIndex = 0;
    tempLength = 0;
    fValue: any = "";

    private paginator: MatPaginator; private sort: MatSort;
    @ViewChild(MatSort) set matSort(ms: MatSort) { this.sort = ms }
    @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) { this.paginator = mp }

    constructor(private volServ: VolumesService) {

    }

    ngOnInit() {
        setTimeout(() => {
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.pagIndex = this.dataSource.paginator.pageIndex;
            this.volServ.getVolumesCount().subscribe(res => {
                this.count = res.count;

            })
        })

        this.getVolumes();

    }


    onPaginateChange(event) {
        if (this.fValue != "") {
            return;
        }
        if (event.pageIndex > this.pagIndex) {
            this.skip = this.skip + 5;
            this.volServ.getVolumes(this.skip).subscribe(res => {
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
            this.volServ.getVolumes(this.skip).subscribe(res => {
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
        }
        else {
            this.volServ.filterVolume(filterValue).subscribe(res => {
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

    getVolumes() {
        this.volServ.getVolumes(this.skip).subscribe(res => {
            this.myData = res;

            for (let index = 0; index < this.myData.length; index++) {
                this.myData[index].order = index + 1;
                this.pagOrder = this.myData[index].order;
            }
            this.tempLength = this.myData.length;
            this.dataSource = new MatTableDataSource(this.myData);
        })

    }

    deleteVolume(vol, id) {
        delete vol.order;
        delete vol.posts
        vol.status = "deactivated";
        this.volServ.deleteVolume(vol, id).subscribe(() => {
            console.log("deactivated");
            this.pagOrder = this.pagOrder - this.tempLength;
            this.volServ.getVolumes(this.skip).subscribe(res => {
                this.myData = res;
                for (let index = 0; index < this.myData.length; index++) {
                    this.myData[index].order = this.pagOrder + 1;
                    this.pagOrder = this.myData[index].order;
                }
                this.tempLength = this.myData.length;
                this.dataSource.data = this.myData;

            })
        })
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

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
        this.dataSource.filter = filterValue;
    }
}


export interface Volumes {
    order: number;
    titleAr: string;
    titleEn: string;
    status: string;
    posts: any[]
}
