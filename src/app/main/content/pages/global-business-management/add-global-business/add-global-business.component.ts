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
import { Location } from '../../../../../../../node_modules/@angular/common';
import { Observable } from 'rxjs/Observable';
import { startWith, map } from 'rxjs/operators';


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
    myControl = new FormControl();
    filteredOptions: Observable<Owners[]>;
    selectedOwner: any = {};
    categories: any = [];
    category: any = {};
    subCategory: any = {};
    owners: any = [];
    owner: any = {};
    regions: any = [];
    region: any = {};
    subRegion: any = {};
    prodcutFile: File = null;
    logoFile: File = null;
    coverFile: File = null;
    url: any;
    covers: any = [];
    dataFormProductsImgs: any = [];
    dataFormCoversImgs: any = [];
    reorderable = true;

    days: any[] = [{ value: 2, valueName: "Monday" }, { value: 3, valueName: "Tuesday" }, { value: 4, valueName: "Wednesday" },
    { value: 5, valueName: "Thursday" }, { value: 6, valueName: "Friday" }, { value: 7, valueName: "Saturday" }, { value: 1, valueName: "Sunday" },]
    openingDays: any = [];
    lat = 33.51380000000012;
    lng = 36.27649999999994;

    displayedColumns = ['order', 'name', 'price', 'description', 'image', 'icons'];
    dataSource = new MatTableDataSource<Products>([]);
    myData: Products[] = [];
    newProduct: any = {};
    order = 0;
    selectStatus = ['pending', 'activated', 'deactivated'];

    loadingIndicator = false;

    constructor(private formBuilder: FormBuilder, private busServ: GlobalBusinessService,
        private route: Router, private snack: MatSnackBar, private busCatServ: BusinessCategoriesService,
        private regServ: RegionsService, private userServ: usersService, private loc: Location) {

        this.newBusiness.openingDaysEnabled = false;
        this.newBusiness.openingDays = [];
        this.newBusiness.covers = [];
        this.newBusiness.products = [];
        this.category.subCategories = [];
        this.region.locations = [];
    }

    ngOnInit() {

        this.dataSource = new MatTableDataSource(this.myData);
        this.userServ.getAllUsers().subscribe(res => {
            this.owners = res;
            this.filteredOptions = this.myControl.valueChanges
                .pipe(
                    startWith<string | Owners>(''),
                    map(value => typeof value === 'string' ? value : value.username),
                    map(title => title ? this._filter(title) : this.owners.slice())
                );
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
            productName: '',
            productPrice: '',
            productDescription: '',
        });

        this.form.valueChanges.subscribe(() => {
            this.onFormValuesChanged();
        });

    }

    displayFn(own?: Owners): string | undefined {
        return own ? own.username : undefined;
    }

    private _filter(own: string): Owners[] {
        const filterValue = own.toLowerCase();
        return this.owners.filter(own => {
            if (own.username == undefined) {
                own.username = "";
            }
            own.username.toLowerCase().indexOf(filterValue) === 0

        });
    }

    markerDragEnd($event) {
        this.lat = $event.coords.lat;
        console.log(this.lat);
        this.lng = $event.coords.lng;
        console.log(this.lng);
    }

    markerPosition(event) {
        this.lat = event.coords.lat;
        console.log(this.lat);
        this.lng = event.coords.lng;
        console.log(this.lng);
    }

    checked(event, day) {
        if (event.checked == true) {
            this.openingDays.push(day.value);
        }
        else {
            for (let index = 0; index < this.openingDays.length; index++) {
                if (this.openingDays[index] == day.value) {
                    this.openingDays.splice(this.openingDays.indexOf(this.openingDays[index], 0), 1);
                }
            }
        }
    }

    onFileChangedLogo(event) {
        this.logoFile = <File>event.target.files[0]

        var reader = new FileReader();

        reader.onload = (event: ProgressEvent) => {
            this.newBusiness.logo = (<FileReader>event.target).result;
        }
        reader.readAsDataURL(event.target.files[0]);
        event.target.value = '';
    }

    onFileChangedProducts(event) {
        this.prodcutFile = <File>event.target.files[0]

        var reader = new FileReader();

        reader.onload = (event: ProgressEvent) => {
            this.url = (<FileReader>event.target).result;
            this.newProduct.image = this.url;
        }
        reader.readAsDataURL(event.target.files[0]);
        event.target.value = '';

    }

    onFileChangedCovers(event) {
        this.coverFile = <File>event.target.files[0]

        var reader = new FileReader();

        reader.onload = (event: ProgressEvent) => {
            this.url = (<FileReader>event.target).result;
            this.covers.push(this.url);
        }
        reader.readAsDataURL(event.target.files[0]);
        event.target.value = '';
        this.dataFormCoversImgs.push(this.coverFile);

    }

    deleteImageLogo(event) {
        var temp = event.path[2].attributes[0].ownerElement.firstElementChild.currentSrc;
        if (temp == this.newBusiness.logo) {
            this.newBusiness.logo = '';
            this.logoFile = null;
        }
    }

    deleteImageProduct(event) {
        var temp = event.path[2].attributes[0].ownerElement.firstElementChild.currentSrc;
        if (temp == this.newProduct.image) {
            this.newProduct.image = '';
            this.prodcutFile = null;
        }
    }

    deleteImageCover(event) {
        var temp = event.path[2].attributes[0].ownerElement.firstElementChild.currentSrc;
        for (let index = 0; index < this.covers.length; index++) {
            if (temp == this.covers[index]) {
                const i: number = this.covers.indexOf(this.covers[index]);
                if (i !== -1) {
                    this.covers.splice(index, 1);
                    this.dataFormCoversImgs.splice(index, 1);
                    return
                }
            }
        }
    }

    pushProduct() {
        if (this.newProduct.name && this.newProduct.price && this.newProduct.description) {
            this.order++;
            this.newProduct.order = this.order;
            if (!this.newProduct.image) {
                this.newProduct.image = "";
            }
            else {
                this.dataFormProductsImgs.push(this.prodcutFile);
            }
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
        this.dataFormProductsImgs.splice(i, 1);
        this.order = this.myData.length;
        this.dataSource.data = this.myData;
    }

    saveBusiness() {
        var isThere: boolean = false;
        this.loadingIndicator = true;
        for (let index = 0; index < this.owners.length; index++) {
            if (this.selectedOwner.id == this.owners[index].id) {
                this.newBusiness.ownerId = this.selectedOwner.id;
                isThere = true;
                break;
            }
        }
        if (isThere == false) {
            this.loadingIndicator = false;
            this.snack.open('There is no Owner with this Username', 'Ok', { duration: 2000 });
            return;
        }
        if (this.newBusiness.openingDaysEnabled == true) {
            for (let index = 0; index < this.openingDays.length; index++) {
                this.newBusiness.openingDays.push(this.openingDays[index])
            }
        }
        else { this.newBusiness.openingDays = [] }
        this.newBusiness.categoryId = this.category.id;
        this.newBusiness.subCategoryId = this.subCategory.id;
        this.newBusiness.cityId = this.region.id;
        this.newBusiness.locationId = this.subRegion.id;
        this.newBusiness.locationPoint = { lat: this.lat, lng: this.lng };
        if (this.logoFile != null) {
            const logoFrmData: FormData = new FormData();
            logoFrmData.append("file", this.logoFile, this.logoFile.name);
            this.busServ.uploadImages(logoFrmData).subscribe(res => {
                this.newBusiness.logo = res[0].url;
            })
        }
        else { this.newBusiness.logo = ""; }

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
                    this.newBusiness.covers.push(tempobj);
                }
                if (this.dataFormProductsImgs.length != 0) {
                    const productFrmData: FormData = new FormData();
                    for (var i = 0; i < this.dataFormProductsImgs.length; i++) {
                        productFrmData.append("file", this.dataFormProductsImgs[i], this.dataFormProductsImgs[i].name);
                    }
                    this.busServ.uploadImages(productFrmData).subscribe(res => {
                        var tempdata = [];
                        for (let z = 0; z < this.myData.length; z++) {
                            if (this.myData[z].image != "") {
                                tempdata.push(this.myData[z]);
                            }
                            else {
                                delete this.myData[z].order;
                                this.newBusiness.products.push(this.myData[z]);
                            }
                        }
                        for (let j = 0; j < res.length; j++) {
                            tempdata[j].image = res[j].url;
                            delete tempdata[j].order;
                            this.newBusiness.products.push(tempdata[j]);
                        }
                        this.saveAPI();
                    })
                }
                else {
                    this.saveAPI();
                }
            })
        }

        else if (this.dataFormProductsImgs.length != 0) {
            const productFrmData: FormData = new FormData();
            for (var i = 0; i < this.dataFormProductsImgs.length; i++) {
                productFrmData.append("file", this.dataFormProductsImgs[i], this.dataFormProductsImgs[i].name);
            }
            this.busServ.uploadImages(productFrmData).subscribe(res => {
                var tempdata = [];
                for (let z = 0; z < this.myData.length; z++) {
                    if (this.myData[z].image != "") {
                        tempdata.push(this.myData[z]);
                    }
                    else {
                        delete this.myData[z].order;
                        this.newBusiness.products.push(this.myData[z]);
                    }
                }
                for (let j = 0; j < res.length; j++) {
                    tempdata[j].image = res[j].url;
                    delete tempdata[j].order;
                    this.newBusiness.products.push(tempdata[j]);
                }
                this.saveAPI();
            })
        }

        if (this.dataFormCoversImgs.length == 0 && this.dataFormProductsImgs.length == 0) {
            this.saveAPI();
        }
        /* setTimeout(() => {
            debugger
            this.busServ.addNewGlobalBusiness(this.newBusiness).subscribe(res => {
                this.loc.back();
                this.route.navigate(['/pages/global-business-management']);
                this.snack.open("You Succesfully entered a new Business", "Done", {
                    duration: 2000,
                })
            },
                err => {
                    this.snack.open("Please Re-enter the right Business information..", "OK")
                }
            )
        },2000); */

    }

    saveAPI() {
        this.busServ.addNewGlobalBusiness(this.newBusiness).subscribe(res => {
            this.loc.back();
            /* this.route.navigate(['/pages/global-business-management']); */
            this.snack.open("You Succesfully entered a new Business", "Done", {
                duration: 2000,
            })
            this.loadingIndicator = false;
        },
            err => {
                this.loadingIndicator = false;
                this.snack.open("Please Re-enter the right Business information..", "OK")
            }
        )
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

