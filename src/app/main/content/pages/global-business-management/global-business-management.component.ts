import { Component, OnInit, ViewChild } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { fuseAnimations } from '../../../../core/animations';
import swal from 'sweetalert2';
import { VolumesService } from '../../../../core/services/volumes.service.';
import { GlobalBusinessService } from '../../../../core/services/global-business.service';

@Component({
    selector: 'global-business-management',
    templateUrl: './global-business-management.component.html',
    styleUrls: ['./global-business-management.component.scss'],
    animations: fuseAnimations,
})
export class GlobalBusinessManagementComponent implements OnInit {

    displayedColumns = ['order', 'nameAr', 'nameEn', 'status', 'description', 'icons'];
    dataSource = new MatTableDataSource<GlobalBusiness>([]);
    myData: GlobalBusiness[] = [];
    count: any;
    skip = 0;
    pagOrder = 0;
    pagIndex = 0;
    tempLength = 0;
    fValue: any = "";

    private paginator: MatPaginator; private sort: MatSort;
    @ViewChild(MatSort) set matSort(ms: MatSort) { this.sort = ms }
    @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) { this.paginator = mp }

    constructor(private gbusServ: GlobalBusinessService) {

    }

    ngOnInit() {
        setTimeout(() => {
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.pagIndex = this.dataSource.paginator.pageIndex;
            this.gbusServ.getGlobalBusinessCount().subscribe(res => {
                this.count = res.count;

            })
        })

        this.getGlobalBusiness();

    }


    onPaginateChange(event) {
        if (this.fValue != "") {
            return;
        }
        if (event.pageIndex > this.pagIndex) {
            this.skip = this.skip + 5;
            this.gbusServ.getGlobalBusiness(this.skip).subscribe(res => {
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
            this.gbusServ.getGlobalBusiness(this.skip).subscribe(res => {
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
            this.gbusServ.filterGlobalBusiness(filterValue).subscribe(res => {
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

    getGlobalBusiness() {
        this.gbusServ.getGlobalBusiness(this.skip).subscribe(res => {
            this.myData = res;

            for (let index = 0; index < this.myData.length; index++) {
                this.myData[index].order = index + 1;
                this.pagOrder = this.myData[index].order;
            }
            this.tempLength = this.myData.length;
            this.dataSource = new MatTableDataSource(this.myData);
        })

    }

    deleteGlobalBusiness(bus, id) {
        delete bus.order;
        console.log(id);

        this.gbusServ.deleteGlobalBusiness(id).subscribe(() => {
            this.pagOrder = this.pagOrder - this.tempLength;
            this.gbusServ.getGlobalBusiness(this.skip).subscribe(res => {
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

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
        this.dataSource.filter = filterValue;
    }
}


export interface GlobalBusiness {
    order: number;
    nameAr: string;
    nameEn: string;
    status: string;
    description: string
}
