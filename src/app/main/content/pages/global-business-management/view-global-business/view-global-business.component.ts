import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fuseAnimations } from '../../../../../core/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '../../../../../../../node_modules/@angular/common';
import { AdsService } from '../../../../../core/services/ads.service';
import { VolumesService } from '../../../../../core/services/volumes.service.';
import { MatTableDataSource } from '@angular/material';
import { GlobalBusinessService } from '../../../../../core/services/global-business.service';
import { RegionsService } from '../../../../../core/services/regions.service';
import { CategoriesService } from '../../../../../core/services/categories.service';
import { BusinessCategoriesService } from '../../../../../core/services/business-cat.service';
import swal from 'sweetalert2';

@Component({
    selector: 'view-global-business',
    templateUrl: './view-global-business.component.html',
    styleUrls: ['./view-global-business.component.scss'],
    animations: fuseAnimations
})
export class ViewGlobalBusinessComponent implements OnInit {
    form: FormGroup;
    formErrors: any;
    id: any;
    businessInfo: any = {};
    lat = -34.397;
    lng = 150.644;
    displayedColumns = ['order', 'name', 'price', 'image'];
    dataSource = new MatTableDataSource<Products>([]);
    myData: Products[] = [];
    order = 0;
    openingDays: any = [];
    openingDaysField: string ="";

    constructor(private formBuilder: FormBuilder, private busServ: GlobalBusinessService, private route : Router,
        private loc: Location, private busCatServ: BusinessCategoriesService,
        private regServ: RegionsService, private activatedRoute: ActivatedRoute) {

    }

    ngOnInit() {

        this.activatedRoute.params.subscribe((params: any) => {
            this.id = params.id;
        });

        this.busServ.getGlobalBusinessById(this.id).subscribe(res => {
            this.businessInfo = res;
            for (let i = 0; i < this.businessInfo.covers.length; i++) {
                if(this.businessInfo.covers[i].type == 'video/*') {
                    this.businessInfo.covers[i].url = this.businessInfo.covers[i].thumbnail;
                }
            }
            
           /*  this.businessInfo.logo = "http://104.217.253.15:3000/images/" + this.businessInfo.logo;
            for (let index = 0; index < this.businessInfo.products.length; index++) {
                this.businessInfo.products[index].image = "http://104.217.253.15:3000/images/" + this.businessInfo.products[index].image;
            }
            for (let index = 0; index < this.businessInfo.covers.length; index++) {
                this.businessInfo.covers[index].url = "http://104.217.253.15:3000/images/" + this.businessInfo.covers[index].url;
            } */
            this.lng = this.businessInfo.locationPoint.lng;
            this.lat = this.businessInfo.locationPoint.lat;

            this.busCatServ.getBusinessById(this.businessInfo.categoryId).subscribe(res => {
                this.businessInfo.category = res;
            })
            this.busCatServ.getBusinessById(this.businessInfo.subCategoryId).subscribe(res => {
                this.businessInfo.subCategory = res;
            })
            this.regServ.getCityById(this.businessInfo.cityId).subscribe(res => {
                this.businessInfo.city = res;
            })
            this.regServ.getLocationById(this.businessInfo.locationId).subscribe(res => {
                this.businessInfo.location = res;
            })
            for (let index = 0; index < this.businessInfo.products.length; index++) {
                this.order++;
                var atemp = this.businessInfo.products[index];
                atemp.order = this.order;
                this.myData.push(atemp);
            }
            this.dataSource.data = this.myData;
            if (this.businessInfo.openingDaysEnabled == true) {
                for (let index = 0; index < this.businessInfo.openingDays.length; index++) {
                    switch (this.businessInfo.openingDays[index]) {
                        case 0:
                            this.openingDays.push('Monday');
                            this.openingDaysField = this.openingDaysField +'Monday,';
                            break;
                        case 1:
                            this.openingDays.push('Tuesday')
                            this.openingDaysField= this.openingDaysField +'Tuesday,';
                            break;
                        case 2:
                            this.openingDays.push('Wednesday');
                            this.openingDaysField= this.openingDaysField +'Wednesday,';
                            break;
                        case 3:
                            this.openingDays.push('Thursday');
                            this.openingDaysField= this.openingDaysField +'Thursday,';
                            break;
                        case 4:
                            this.openingDays.push('Friday');
                            this.openingDaysField= this.openingDaysField +'Friday,';
                            break;
                        case 5:
                            this.openingDays.push('Saturday');
                            this.openingDaysField= this.openingDaysField +'Saturday,';
                            break;
                        case 6:
                            this.openingDays.push('Sunday');
                            this.openingDaysField= this.openingDaysField +'Sunday,';
                            break;
                        default:
                            break;
                    }
                }
            }
        })
        this.dataSource = new MatTableDataSource(this.myData);

        

        this.formErrors = {
            nameAr: {},
            nameEn: {},
            nameUnique: {},
            description: {},
            status: {},
            openingDaysEnabled: {},
            category: [],
            subCategory: [],
            city: [],
            location: [],
            owner: [],
            openingDays: [],
        };

        this.form = this.formBuilder.group({
            nameAr: ['', Validators.required],
            nameEn: ['', Validators.required],
            nameUnique: ['', Validators.required],
            phoneNumber1: [''],
            phoneNumber2: [''],
            fax: [''],
            description: ['', Validators.required],
            status: ['', Validators.required],
            openingDaysEnabled: [''],
            category: ['', Validators.required],
            subCategory: [{}, Validators.required],
            city: [{}, Validators.required],
            location: ['', Validators.required],
            owner: [{}, Validators.required],
            openingDays: [{}, Validators.required],
        });

        this.form.valueChanges.subscribe(() => {
            this.onFormValuesChanged();
        });

    }

    deleteBusiness() {

        this.businessInfo.status = "deactivated";
        this.busServ.deleteGlobalBusiness( this.businessInfo.id).subscribe(() => {
            
            this.route.navigate(['/pages/global-business-management']);
        })
    }

    deleteModal() {
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
                this.deleteBusiness();
                swal(
                    'Deleted!',
                    'Your file has been deleted.',
                    'success'
                )
            }
        })
    }

    onFormValuesChanged() {
        for (const field in this.formErrors) {
            if (!this.formErrors.hasOwnProperty(field)) {
                continue;
            }

            // Clear previous errors
            this.formErrors[field] = {};

            // Get the control
            const control = this.form.get(field);

            if (control && control.dirty && !control.valid) {
                this.formErrors[field] = control.errors;
            }
        }
    }

    back() {
        this.loc.back();
    }

}

export interface Products {
    order: number;
    name: string;
    price: number;
    image: any;
}