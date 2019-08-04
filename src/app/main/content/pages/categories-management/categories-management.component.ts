import { Component, OnInit, ViewChild } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { fuseAnimations } from '../../../../core/animations';
import swal from 'sweetalert2';
import { CategoriesService } from '../../../../core/services/categories.service';

@Component({
    selector: 'categories-management',
    templateUrl: './categories-management.component.html',
    styleUrls: ['./categories-management.component.scss'],
    animations: fuseAnimations,
})
export class CategoriesManagementComponent implements OnInit {

    options = [{ value: "Categories" }, { value: "SubCategories" }];
    form: FormGroup;
    choose: any;
    displayedColumns = ['order', 'titleAr', 'titleEn', 'subCategories', 'icons'];
    displayedColumns1 = ['order', 'titleAr', 'titleEn', 'parentCategory', 'icons'];
    dataSource = new MatTableDataSource<Categories>([]);
    dataSource1 = new MatTableDataSource<subCategories>([]);
    myData: Categories[] = [];
    myData1: subCategories[] = [];
    tempData: any[];
    i: number;
    j: number;

    private paginator: MatPaginator; private sort: MatSort;
    private paginator1: MatPaginator; private sort1: MatSort;
    @ViewChild(MatSort) set matSort(ms: MatSort) { this.sort = ms }
    @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) { this.paginator = mp }
    @ViewChild(MatSort) set matSort1(ms1: MatSort) { this.sort1 = ms1 }
    @ViewChild(MatPaginator) set matPaginator1(mp1: MatPaginator) { this.paginator1 = mp1 }

    constructor(private catServ: CategoriesService, private formBuilder: FormBuilder) { }

    ngOnInit() {
        this.getCategories();
        this.getSubCategories();
        this.form = this.formBuilder.group({
            option: ['', Validators.required]
        });
    }

    onSelect() {

        setTimeout(() => {
            if (this.choose == "Categories") {
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
            }
            if (this.choose == "SubCategories") {
                this.dataSource1.paginator = this.paginator1;
                this.dataSource1.sort = this.sort1;
            }
        });

    }

    getCategories() {
        this.catServ.getCategories().subscribe(res => {
            this.myData = [];
            this.i = 1;
            for (let index = 0; index < res.length; index++) {
                res[index].order = this.i;
                this.i++;
                this.myData.push(res[index]);
                this.dataSource._updateChangeSubscription();
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;

            }
            this.dataSource = new MatTableDataSource(this.myData);
        })
    }

    getSubCategories() {
        this.catServ.getSubCategories().subscribe(res => {
            this.myData1 = [];
            this.j = 1;
            var temp = res;
            for (let index = 0; index < temp.length; index++) {
                this.catServ.getCategoryById(temp[index].parentCategoryId).subscribe(res => {
                    temp[index].parentCategory = res;
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

    deleteCategory(cat, id) {
        
        this.catServ.deleteCategory(id).subscribe(() => {
            
            this.getCategories();
            this.getSubCategories();
        })

    }

    deleteCategoryModal(cat, id) {
        swal({
            title: 'Are you sure?',
            text: "all the SubCategories will be Deleted As Well!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.value) {
                this.deleteCategory(cat, id);
                swal(
                    'Deleted!',
                    'Your file has been deleted.',
                    'success'
                )
            }
        })
    }

    deleteSubCategory(cat, id) {
        delete cat.order;
        this.catServ.deleteCategory(id).subscribe(() => {
            
            this.getCategories();
            this.getSubCategories();
        })
    }

    deleteSubCategoryModal(cat, id) {
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
                this.deleteSubCategory(cat, id);
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


export interface Categories {
    order: number;
    titleAr: string;
    titleEn: string;
    subCategories: any;
}

export interface subCategories {
    order: number;
    titleAr: string;
    titleEn: string;
    parentCategory: any;
}



