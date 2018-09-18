import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { fuseAnimations } from '../../../../../core/animations';
import { Router } from '@angular/router';
import { MatSnackBar, MatTableDataSource } from '@angular/material';
import { CategoriesService } from '../../../../../core/services/categories.service';
import { usersService } from '../../../../../core/services/users.service';
import { RegionsService } from '../../../../../core/services/regions.service';
import { GlobalBusinessService } from '../../../../../core/services/global-business.service';
import { google } from '@agm/core/services/google-maps-types';
import { BusinessCategoriesService } from '../../../../../core/services/business-cat.service';


@Component({
    selector: 'add-global-business',
    templateUrl: './add-global-business.component.html',
    styleUrls: ['./add-global-business.component.scss'],
    animations: fuseAnimations
})
export class AddGlobalBusinessComponent implements OnInit {
    form: FormGroup;
    formErrors: any;
    newBusiness: any = {};
    categories: any = [];
    category: any = {};
    subCategory: any = {};
    owners: any = [];
    owner: any = {};
    regions: any = [];
    region: any = {};
    subRegion: any = {};
    prodcutFile: File;
    logoFile:File;
    coverFile:File;
    url: any;
    covers:any = [];
    dataFormProductsImgs: any = [];
    dataFormCoversImgs: any = [];
    days: any[] = [{ value: 0, valueName: "Monday" }, { value: 1, valueName: "Tuesday" }, { value: 2, valueName: "Wednesday" },
    { value: 3, valueName: "Thursday" }, { value: 4, valueName: "Friday" }, { value: 5, valueName: "Saturday" }, { value: 6, valueName: "Sunday" },]
    openingDays: any = [];
    lat = -34.397;
    lng = 150.644;

    displayedColumns = ['order', 'name', 'price', 'image', 'icons'];
    dataSource = new MatTableDataSource<Products>([]);
    myData: Products[] = [];
    newProduct: any = {};
    order = 0;
    empty: any =[];

    constructor(private formBuilder: FormBuilder, private busServ: GlobalBusinessService,
        private route: Router, private snack: MatSnackBar, private busCatServ: BusinessCategoriesService,
        private regServ: RegionsService, private userServ: usersService) {

        this.newBusiness.openingDaysEnabled = false;
        this.category.subCategories = [];
        this.region.locations = [];

        /* var myLatlng = new google.maps.LatLng(-25.363882, 131.044922);
        var mapOptions = {
            zoom: 4,
            center: myLatlng
        }
        var map = new google. maps.Map(document.getElementById("map"), mapOptions);

        var marker = new google.maps.Marker({
            position: myLatlng,
            map: map,
            draggable: true,
            title: "Drag me!"
        }); */
    }

    ngOnInit() {

        this.dataSource = new MatTableDataSource(this.myData);
        this.userServ.getAllUsers().subscribe(res => {
            this.owners = res;
        })

        this.busCatServ.getBusinessCategories().subscribe(res => {
            this.categories = res;
        })

        this.regServ.getAllCities().subscribe(res => {
            this.regions = res;
        })

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
            category: [this.categories[0], Validators.required],
            subCategory: [{}, Validators.required],
            city: [{}, Validators.required],
            location: ['', Validators.required],
            owner: [{}, Validators.required],
            openingDays: [{}, Validators.required],
            productName: [],
            productPrice: []
        });

        this.form.valueChanges.subscribe(() => {
            this.onFormValuesChanged();
        });

    }

    pushDay(day) {
        for (let index = 0; index < this.openingDays.length; index++) {
            if(day.valueName == this.openingDays[index].valueName) {
                var i = this.openingDays.indexOf(this.openingDays[index], 0);
                this.openingDays.splice(i, 1);
                return
            }
        }
        this.openingDays.push(day);
    }

    onFileChangedLogo(event) {
        this.logoFile = <File>event.target.files[0]

        var reader = new FileReader();

        reader.onload = (event: ProgressEvent) => {
            this.newBusiness.logo = (<FileReader>event.target).result;
        }
        reader.readAsDataURL(event.target.files[0]);
    }

    onFileChangedProducts(event) {
        this.prodcutFile = <File>event.target.files[0]

        var reader = new FileReader();

        reader.onload = (event: ProgressEvent) => {
            this.url = (<FileReader>event.target).result;
            this.newProduct.image = this.url;
        }
        reader.readAsDataURL(event.target.files[0]);

        this.dataFormProductsImgs.push(this.prodcutFile);

    }

    onFileChangedCovers(event) {
        this.coverFile = <File>event.target.files[0]

        var reader = new FileReader();

        reader.onload = (event: ProgressEvent) => {
            this.url = (<FileReader>event.target).result;
            this.covers.push(this.url);
        }
        reader.readAsDataURL(event.target.files[0]);

        this.dataFormCoversImgs.push(this.coverFile);

    }

   /*  onupload() {
        const frmData = new FormData();

        for (var i = 0; i < this.dataFormImgs.length; i++) {
            frmData.append("fileUpload", this.dataFormImgs[i], this.dataFormImgs[i].name);
            debugger
        }
                frmData.append("fileUpload", this.selectedFile);
        this.adServ.uploadImages(frmData).subscribe(res => {
            res;
           debugger
        })
    } */

    dd(event) {
        console.log(event);
    }

    pushProduct() {
        if (this.newProduct.name && this.newProduct.price && this.newProduct.image) {
            this.order++;
            this.newProduct.order = this.order;
            this.myData.push(this.newProduct);
            this.dataSource.data = this.myData;
            this.newProduct = {};
        }
        else {
            this.snack.open('Please Enter all the Product Information', 'Ok', { duration: 2000 })
            return
        }
    }

    deleteProduct(prod) {
        var i = this.myData.indexOf(prod, 0);
        for (let index = i + 1; index < this.myData.length; index++) {
            this.myData[index].order--;
        }
        this.myData.splice(i, 1);
        this.order = this.myData.length;
        this.dataSource.data = this.myData;
    }

    saveBusiness() {
        if (this.newBusiness.openingDaysEnabled == true) {
            this.newBusiness.openingDays = this.openingDays;
        }
        else { this.newBusiness.openingDays = [] }
        this.newBusiness.ownerId = this.owner.id;
        this.newBusiness.categoryId = this.category.id;
        this.newBusiness.subCategoryId = this.subCategory.id;
        this.newBusiness.cityId = this.region.id;
        this.newBusiness.locationId = this.subRegion.id;
        this.newBusiness.logo ="";
        this.newBusiness.covers = [];
        this.newBusiness.products = [];
        this.newBusiness.locationPoint = {lat:0, lng:0};
        debugger
        /*         if(!this.newAd.media) {
                    this.newAd.media = [];
                } */

        this.busServ.addNewGlobalBusiness(this.newBusiness).subscribe(res => {
            this.route.navigate(['/pages/global-business-management']);
            this.snack.open("You Succesfully entered a new Business", "Done", {
                duration: 2000,
            })
        },
            err => {
                this.snack.open("Please Re-enter the right Business information..", "OK")
            }
        )
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
}

export interface Products {
    order: number;
    name: string;
    price: number;
    image: any;
}
