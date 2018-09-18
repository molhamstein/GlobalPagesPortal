import { Component, OnInit, ViewChild } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { fuseAnimations } from '../../../../core/animations';
import swal from 'sweetalert2';
import { RegionsService } from '../../../../core/services/regions.service';

@Component({
    selector: 'regions-management',
    templateUrl: './regions-management.component.html',
    styleUrls: ['./regions-management.component.scss'],
    animations: fuseAnimations,
})
export class RegionsManagementComponent implements OnInit {

    options = [{ value: "Cities" }, { value: "Locations" }];
    form: FormGroup;
    choose: any;
    displayedColumns = ['order', 'nameAr', 'nameEn', 'locations', 'icons'];
    displayedColumns1 = ['order', 'nameAr', 'nameEn', 'city', 'icons'];
    dataSource = new MatTableDataSource<Cities>([]);
    dataSource1 = new MatTableDataSource<Locations>([]);
    myData: Cities[] = [];
    myData1: Locations[] = [];
    tempData: any[];
    i: number;
    j: number;

    private paginator: MatPaginator; private sort: MatSort;
    private paginator1: MatPaginator; private sort1: MatSort;
    @ViewChild(MatSort) set matSort(ms: MatSort) { this.sort = ms }
    @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) { this.paginator = mp }
    @ViewChild(MatSort) set matSort1(ms1: MatSort) { this.sort1 = ms1 }
    @ViewChild(MatPaginator) set matPaginator1(mp1: MatPaginator) { this.paginator1 = mp1 }

    constructor(private regServ: RegionsService, private formBuilder: FormBuilder) { }

    ngOnInit() {
        this.getCities();
        this.getLocations();
        this.form = this.formBuilder.group({
            option: ['', Validators.required]
        });
    }

    onSelect() {

        setTimeout(() => {
            if (this.choose == "Cities") {
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
            }
            if (this.choose == "Locations") {
                this.dataSource1.paginator = this.paginator1;
                this.dataSource1.sort = this.sort1;
            }
        });

    }

    getCities() {
        this.regServ.getAllCities().subscribe(res => {
            this.myData = [];
            this.i = 1;
            var temp = res;
            for (let index = 0; index < temp.length; index++) {
                temp[index].order = this.i;
                this.i++;
                this.myData.push(temp[index]);
                this.dataSource._updateChangeSubscription();
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;

            }
            this.dataSource = new MatTableDataSource(this.myData);
        })
    }

    getLocations() {
        this.regServ.getAllLocations().subscribe(res => {
            var temp = res;
            this.myData1 = [];
            this.j = 1;
            for (let index = 0; index < temp.length; index++) {
                this.regServ.getCityById(temp[index].cityId).subscribe(res => {
                    temp[index].city = res;
                    temp[index].order = this.j;
                    this.j++;
                    this.myData1.push(temp[index]);
                    this.dataSource1._updateChangeSubscription();
                    this.dataSource1.paginator = this.paginator1;
                    this.dataSource1.sort = this.sort1;
                })

            }

            this.dataSource1 = new MatTableDataSource(this.myData1);
        })

    }

    deleteCity(city, id) {
        delete city.order;
        if (city.locations.length > 0) {
            for (let index = 0; index < city.locations.length; index++) {
                this.regServ.deleteLocation(city.locations[index].id).subscribe(res => {
                    console.log("location deleted" + index);
                });
            }
        }

        delete city.locations;

        this.regServ.deleteCity(id).subscribe(() => {
            console.log("deleted");
            this.getCities();
            this.getLocations();
        })

    }

    deleteCityModal(city, id) {
        swal({
            title: 'Are you sure?',
            text: "all the citie's locations will be Deleted As Well!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.value) {
                this.deleteCity(city, id);
                swal(
                    'Deleted!',
                    'Your file has been deleted.',
                    'success'
                )
            }
        })
    }

    deleteLocation(location, id) {
        delete location.order;
        this.regServ.deleteLocation(id).subscribe(() => {
            console.log("deleted");
            this.getCities();
            this.getLocations();
        })
    }

    deleteLocationModal(location, id) {
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
                this.deleteLocation(location, id);
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

    applyFilter1(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
        this.dataSource1.filter = filterValue;
    }
}


export interface Cities {
    order: number;
    nameAr: string;
    nameEn: string;
    locations: any;
}

export interface Locations {
    order: number;
    nameAr: string;
    nameEn: string;
    city: any;
}



