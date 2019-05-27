import { Component, OnInit, ViewChild } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { fuseAnimations } from '../../../../core/animations';
import swal from 'sweetalert2';
import { BusinessCategoriesService } from '../../../../core/services/business-cat.service';
import { AdsService } from '../../../../core/services/ads.service';

@Component({
    selector: 'ads-management',
    templateUrl: './ads-management.component.html',
    styleUrls: ['./ads-management.component.scss'],
    animations: fuseAnimations,
})
export class AdsManagementComponent implements OnInit {

    displayedColumns = ['order', 'title', 'description', 'status', 'thumbnail', 'icons'];
    dataSource = new MatTableDataSource<Ads>([]);
    myData: Ads[] = [];
    count: any;
    skip = 0;
    pagOrder = 0;
    pagIndex = 0;
    tempLength = 0;
    fValue: any = "";

    private paginator: MatPaginator; private sort: MatSort;
    @ViewChild(MatSort) set matSort(ms: MatSort) { this.sort = ms }
    @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) { this.paginator = mp }

    constructor(private adServ: AdsService) {

    }

    ngOnInit() {
        setTimeout(() => {
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.pagIndex = this.dataSource.paginator.pageIndex;
            this.adServ.getAdsCount().subscribe(res => {
                this.count = res.count;

            })
        })

        this.getAds();

    }


    onPaginateChange(event) {
        debugger
        if (this.fValue != "") {
            return;
        }
        if (event.pageIndex > this.pagIndex) {
            this.skip = this.skip + 5;
            this.adServ.getAds(this.skip).subscribe(res => {
                this.myData = res;
                for (let index = 0; index < this.myData.length; index++) {
                    this.myData[index].order = this.pagOrder + 1;
                    if (res[index].media.length != 0) {
                        this.myData[index].thumbnail = res[index].media[0].url;
                        if (this.myData[index].thumbnail == undefined) {
                            this.myData[index].thumbnail = "";
                        }
                    }
                    else {
                        this.myData[index].thumbnail = "";
                    }
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
            this.adServ.getAds(this.skip).subscribe(res => {
                this.myData = res;
                for (let index = 0; index < this.myData.length; index++) {
                    this.myData[index].order = this.pagOrder + 1;
                    if (res[index].media.length != 0) {
                        this.myData[index].thumbnail = res[index].media[0].url;
                        if (this.myData[index].thumbnail == undefined) {
                            this.myData[index].thumbnail = "";
                        }
                    }
                    else {
                        this.myData[index].thumbnail = "";
                    }
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
            this.adServ.filterAd(filterValue).subscribe(res => {
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

    getAds() {
        this.adServ.getAds(this.skip).subscribe(res => {
            this.myData = res;

            for (let index = 0; index < this.myData.length; index++) {
                this.myData[index].order = index + 1;
                if (res[index].media.length != 0) {
                    if (res[index].media[0].type != 'video/*') {
                        this.myData[index].thumbnail = res[index].media[0].url;
                        if (this.myData[index].thumbnail == undefined) {
                            this.myData[index].thumbnail = "";
                        }
                    }
                }
                else {
                    this.myData[index].thumbnail = "";
                }

                this.pagOrder = this.myData[index].order;
            }
            this.dataSource = new MatTableDataSource(this.myData);
        })

    }

    deleteAd(ad, id) {
        delete ad.order;
        delete ad.owner;
        delete ad.category;
        delete ad.subCategory;
        delete ad.city;
        delete ad.location;
        delete ad.thumbnail;
        // ad.status = "deactivated";
        this.adServ.deleteAd(id).subscribe(() => {
            console.log("deactivated");
            this.pagOrder = this.pagOrder - this.tempLength;
            this.adServ.getAds(this.skip).subscribe(res => {
                this.myData = res;
                for (let index = 0; index < this.myData.length; index++) {
                    this.myData[index].order = this.pagOrder + 1;
                    if (res[index].media.length != 0) {
                        this.myData[index].thumbnail = res[index].media[0].url;
                        if (this.myData[index].thumbnail == undefined) {
                            this.myData[index].thumbnail = "";
                        }
                    }
                    else {
                        this.myData[index].thumbnail = "";
                    }
                    this.pagOrder = this.myData[index].order;
                }
                this.tempLength = this.myData.length;
                this.dataSource.data = this.myData;

            })
        })
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

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
        this.dataSource.filter = filterValue;
    }
}


export interface Ads {
    order: number;
    title: string;
    description: string;
    status: string;
    thumbnail: string
}
