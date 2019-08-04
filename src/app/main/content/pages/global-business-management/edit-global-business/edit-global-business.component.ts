import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { fuseAnimations } from '../../../../../core/animations';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar, MatTableDataSource } from '@angular/material';
import { GlobalBusinessService } from '../../../../../core/services/global-business.service';
import { CategoriesService } from '../../../../../core/services/categories.service';
import { usersService } from '../../../../../core/services/users.service';
import { RegionsService } from '../../../../../core/services/regions.service';
import { BusinessCategoriesService } from '../../../../../core/services/business-cat.service';
import { Location } from '../../../../../../../node_modules/@angular/common';
import { Observable } from 'rxjs/Observable';
import { startWith, map } from 'rxjs/operators';
import { isString } from 'util';

@Component({
    selector: 'edit-global-business',
    templateUrl: './edit-global-business.component.html',
    styleUrls: ['./edit-global-business.component.scss'],
    animations: fuseAnimations
})
export class EditGlobalBusinessComponent implements OnInit {
    id: any;
    form: FormGroup;
    formErrors: any;
    editedBusiness: any = {};
    prodcutFile: File = null;
    logoFile: File = null;
    coverFile: File = null;
    url: any;
    url1: any;
    covers: any = [];
    dataFormProductsImgs: any = [];
    dataFormCoversImgs: any = [];
    days: any[] = [{ value: 2, valueName: "Monday" },
    { value: 3, valueName: "Tuesday" },
    { value: 4, valueName: "Wednesday" },
    { value: 5, valueName: "Thursday" },
    { value: 6, valueName: "Friday" },
    { value: 7, valueName: "Saturday" },
    { value: 1, valueName: "Sunday" },]
    openingDays: any = [];
    lat = -34.397;
    lng = 150.644;
    reorderable = true;

    displayedColumns = ['order', 'name', 'price', 'description', 'image', 'icons'];
    dataSource = new MatTableDataSource<Products>([]);
    myData: Products[] = [];
    editedProduct: any = {};
    order = 0;
    selectStatus = ['pending', 'activated', 'deactivated'];

    loadingIndicator = false;

    constructor(private formBuilder: FormBuilder, private busServ: GlobalBusinessService,
        private route: Router, private snack: MatSnackBar, private busCatServ: BusinessCategoriesService, private loc: Location,
        private regServ: RegionsService, private userServ: usersService, private activatedRoute: ActivatedRoute) {
    }

    ngOnInit() {
        let props = ["category", "subCategory", "city", "location", "owner"];

        this.activatedRoute.params.subscribe((params: any) => {
            this.id = params.id;

            this.busServ.getGlobalBusinessById(this.id).subscribe(res => {
                this.editedBusiness = res;
                this.lat = this.editedBusiness.locationPoint.lat;
                this.lng = this.editedBusiness.locationPoint.lng;

                for (let field of props) {
                    this.form.controls[field].setValue(res[field]);
                }

                for (let index = 0; index < this.editedBusiness.openingDays.length; index++) {
                    for (let i = 0; i < this.days.length; i++) {
                        if (this.editedBusiness.openingDays[index] == this.days[i].value) {
                            this.days[i].checked = true;
                            this.openingDays.push(this.days[i]);
                        }
                    }
                }
                for (let index = 0; index < this.editedBusiness.covers.length; index++) {
                    if (this.editedBusiness.covers[index].type == 'video/*') {
                        this.editedBusiness.covers[index].url = this.editedBusiness.covers[index].thumbnail;
                    }
                    this.covers[index] = this.editedBusiness.covers[index];
                }
                for (let index = 0; index < this.editedBusiness.products.length; index++) {
                    this.order++;
                    var temp = this.editedBusiness.products[index];
                    temp.order = this.order;
                    this.myData.push(temp);
                }
                this.dataSource.data = this.myData;


            })

        });

        this.dataSource = new MatTableDataSource(this.myData);



        this.formErrors = {
            nameAr: {},
            nameEn: {},
            nameUnique: {},
            description: {},
            status: {},
            openingDaysEnabled: {},

            category: {},
            subCategory: {},
            city: {},
            location: {},
            owner: {},
            vip: {}

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
            vip: [false, Validators.required],
            category: [null, Validators.required],
            subCategory: [null, Validators.required],
            city: [null, Validators.required],
            location: [null, Validators.required],
            owner: [null, Validators.required],


            productName: '',
            productPrice: '',
            productDescription: '',
        });
        this.form.valueChanges.subscribe(() => {
            this.onFormValuesChanged();
        });

    }


    markerDragEnd($event) {
        this.lat = $event.coords.lat;
        
        this.lng = $event.coords.lng;
        
    }

    markerPosition(event) {
        this.lat = event.coords.lat;
        
        this.lng = event.coords.lng;
        
    }

    pushDay(day) {
        for (let index = 0; index < this.openingDays.length; index++) {
            if (day.valueName == this.openingDays[index].valueName) {
                var i = this.openingDays.indexOf(this.openingDays[index], 0);
                this.openingDays.splice(i, 1);
                return
            }
        }
        this.openingDays.push(day);
    }

    checked(event, day) {
        if (event.checked == true) {
            this.openingDays.push(day);
        }
        else {
            for (let index = 0; index < this.openingDays.length; index++) {
                if (this.openingDays[index].value == day.value) {
                    this.openingDays.splice(this.openingDays.indexOf(this.openingDays[index], 0), 1);
                }
            }
        }
    }

    onFileChangedLogo(event) {
        this.logoFile = <File>event.target.files[0]

        var reader = new FileReader();

        reader.onload = (event: ProgressEvent) => {
            this.editedBusiness.logo = (<FileReader>event.target).result;
        }
        reader.readAsDataURL(event.target.files[0]);
        event.target.value = '';
    }

    onFileChangedProducts(event) {
        this.prodcutFile = <File>event.target.files[0]

        var reader = new FileReader();

        reader.onload = (event: ProgressEvent) => {
            this.url = (<FileReader>event.target).result;
            this.editedProduct.image = this.url;
        }
        reader.readAsDataURL(event.target.files[0]);
        event.target.value = '';

    }

    onFileChangedCovers(event) {
        this.coverFile = <File>event.target.files[0]
        var reader = new FileReader();

        reader.onload = (event1: ProgressEvent) => {
            this.url1 = (<FileReader>event1.target).result;
            var u = { url: this.url1 };
            this.covers.push(u);
        }
        reader.readAsDataURL(event.target.files[0]);
        event.target.value = '';
        this.dataFormCoversImgs.push(this.coverFile);

    }

    deleteImageLogo(event) {
        var temp = event.path[2].attributes[0].ownerElement.firstElementChild.currentSrc;
        if (temp == this.editedBusiness.logo) {
            this.editedBusiness.logo = '';
            this.logoFile = null;
        }
    }

    deleteImageProduct(event) {
        var temp = event.path[2].attributes[0].ownerElement.firstElementChild.currentSrc;
        if (temp == this.editedProduct.image) {
            this.editedProduct.image = '';
            this.prodcutFile = null;
        }
    }

    deleteImageCover(event) {
        var temp = event.path[2].attributes[0].ownerElement.firstElementChild.currentSrc;
        for (let index = 0; index < this.covers.length; index++) {
            if (temp == this.covers[index].url) {
                const i: number = this.covers.indexOf(this.covers[index]);
                if (i !== -1) {
                    if (temp.startsWith('http')) {
                        this.covers.splice(index, 1);
                        this.editedBusiness.covers.splice(index, 1);
                        return
                    }
                    this.covers.splice(index, 1);
                    this.dataFormCoversImgs.splice(index - this.editedBusiness.covers.length, 1);
                    return
                }
            }
        }
    }

    pushProduct() {
        if (this.editedProduct.name && this.editedProduct.price && this.editedProduct.description) {
            this.order++;
            this.editedProduct.order = this.order;
            if (!this.editedProduct.image) {
                this.editedProduct.image = "";
            }
            else {
                this.dataFormProductsImgs.push(this.prodcutFile);
            }
            this.myData.push(this.editedProduct);
            this.dataSource.data = this.myData;
            this.editedProduct = {};
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
        if (this.myData[i].image.startsWith('http')) {
            this.myData.splice(i, 1);
            this.editedBusiness.products.splice(i, 1);
        }
        else {
            this.myData.splice(i, 1);
            this.dataFormProductsImgs.splice(i - this.editedBusiness.products.length, 1);
        }
        this.order = this.myData.length;
        this.dataSource.data = this.myData;
    }



    updateBusiness() {


        if (this.editedBusiness.openingDaysEnabled == true) {
            var tempDays = [];
            for (let index = 0; index < this.openingDays.length; index++) {
                tempDays.push(this.openingDays[index].value);
            }
            this.editedBusiness.openingDays = tempDays;
        }
        else { this.editedBusiness.openingDays = [] }

        this.editedBusiness.categoryId = this.form.get('category').value.id;
        this.editedBusiness.subCategoryId = this.form.get('subCategory').value.id;
        this.editedBusiness.cityId = this.form.get('city').value.id;
        this.editedBusiness.locationId = this.form.get('location').value.id;
        this.editedBusiness.ownerId = this.form.get('owner').value.id;

        delete this.editedBusiness.category;
        delete this.editedBusiness.subCategory;
        delete this.editedBusiness.owner;
        this.editedBusiness.locationPoint = { lat: this.lat, lng: this.lng };
        if (this.logoFile != null) {
            const logoFrmData: FormData = new FormData();
            logoFrmData.append("file", this.logoFile, this.logoFile.name);
            this.busServ.uploadImages(logoFrmData).subscribe(res => {
                this.editedBusiness.logo = res[0].url;
            })
        }

        if (this.dataFormCoversImgs.length != 0) {
            const coverFrmData: FormData = new FormData();
            for (var i = 0; i < this.dataFormCoversImgs.length; i++) {
                coverFrmData.append("file", this.dataFormCoversImgs[i], this.dataFormCoversImgs[i].name);
            }
            this.busServ.uploadImages(coverFrmData).subscribe(res => {
                for (let j = 0; j < res.length; j++) {
                    var tempobj: any = {};
                    tempobj.url = res[j].url;
                    tempobj.thumbnail = res[j].url;
                    tempobj.type = 'image';
                    this.editedBusiness.covers.push(tempobj);
                }
                if (this.dataFormProductsImgs.length != 0) {
                    const productFrmData: FormData = new FormData();
                    for (var i = 0; i < this.dataFormProductsImgs.length; i++) {
                        productFrmData.append("file", this.dataFormProductsImgs[i], this.dataFormProductsImgs[i].name);
                    }
                    this.busServ.uploadImages(productFrmData).subscribe(res => {
                        var tempData = [];
                        const length = this.editedBusiness.products.length;
                        for (let z = 0; z < this.myData.length - length; z++) {
                            if (this.myData[z + length].image != "") {
                                tempData.push(this.myData[z + length]);
                            }
                            else {
                                delete this.myData[this.editedBusiness.products.length].order;
                                this.editedBusiness.products.push(this.myData[z + length]);
                            }
                        }
                        for (let j = 0; j < res.length; j++) {
                            tempData[j].image = res[j].url;
                            delete tempData[j].order;
                            this.editedBusiness.products.push(tempData[j]);
                        }
                        this.updateAPI();
                    })
                }
                else {
                    this.updateAPI();
                }
            })
        }

        else if (this.dataFormProductsImgs.length != 0) {
            const productFrmData: FormData = new FormData();
            for (var i = 0; i < this.dataFormProductsImgs.length; i++) {
                productFrmData.append("file", this.dataFormProductsImgs[i], this.dataFormProductsImgs[i].name);
            }
            this.busServ.uploadImages(productFrmData).subscribe(res => {
                var tempData = [];
                const length = this.editedBusiness.products.length;
                for (let z = 0; z < this.myData.length - length; z++) {
                    if (this.myData[z + length].image != "") {
                        tempData.push(this.myData[z + length]);
                    }
                    else {
                        delete this.myData[this.editedBusiness.products.length].order;
                        this.editedBusiness.products.push(this.myData[z + length]);
                    }
                }
                for (let j = 0; j < res.length; j++) {
                    tempData[j].image = res[j].url;
                    delete tempData[j].order;
                    this.editedBusiness.products.push(tempData[j]);
                }
                this.updateAPI();
            })
        }

        if (this.dataFormCoversImgs.length == 0 && this.dataFormProductsImgs.length == 0) {
            this.updateAPI();
        }

        /*  setTimeout(() => {
             this.busServ.editGlobalBusiness(this.editedBusiness, this.editedBusiness.id).subscribe(res => {
                 this.loc.back();
                 this.route.navigate(['/pages/global-business-management']);
                 this.snack.open("You Succesfully update this Business", "Done", {
                     duration: 2000,
                 })
             },
                 err => {
                     this.snack.open("Please Re-enter the right Business information..", "OK")
                 }
             )
         }, 2000); */

    }

    updateAPI() {
        setTimeout(() => {
            this.busServ.editGlobalBusiness(this.editedBusiness, this.editedBusiness.id).subscribe(res => {
                this.loc.back();
                /* this.route.navigate(['/pages/global-business-management']); */
                this.snack.open("You Succesfully update this Business", "Done", {
                    duration: 2000,
                })
                this.loadingIndicator = false;
            },
                err => {
                    this.loadingIndicator = false;
                    this.snack.open("Please Re-enter the right Business information..", "OK")
                }
            )
        }, 2000);
    }

    back() {
        this.loc.back();
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
    description: string;
    image: any;
}

export interface Owners {
    username: string;
    email: string;
    status: string;
    gender: string;
    id: number;
}
