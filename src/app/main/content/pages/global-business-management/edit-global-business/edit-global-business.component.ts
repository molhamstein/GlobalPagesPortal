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
    days: any[] = [{ value: 0, valueName: "Monday" }, { value: 1, valueName: "Tuesday" }, { value: 2, valueName: "Wednesday" },
    { value: 3, valueName: "Thursday" }, { value: 4, valueName: "Friday" }, { value: 5, valueName: "Saturday" }, { value: 6, valueName: "Sunday" },]
    openingDays: any = [];
    lat = -34.397;
    lng = 150.644;

    displayedColumns = ['order', 'name', 'price', 'description', 'image', 'icons'];
    dataSource = new MatTableDataSource<Products>([]);
    myData: Products[] = [];
    editedProduct: any = {};
    order = 0;
    empty: any = [];
    selectStatus = ['pending', 'activated', 'deactivated'];

    constructor(private formBuilder: FormBuilder, private busServ: GlobalBusinessService,
        private route: Router, private snack: MatSnackBar, private busCatServ: BusinessCategoriesService, private loc: Location,
        private regServ: RegionsService, private userServ: usersService, private activatedRoute: ActivatedRoute) {
    }

    ngOnInit() {

        this.activatedRoute.params.subscribe((params: any) => {
            this.id = params.id;

            this.busServ.getGlobalBusinessById(this.id).subscribe(res => {
                this.editedBusiness = res;
                this.selectedOwner = this.editedBusiness.owner;
                this.lat = this.editedBusiness.locationPoint.lat;
                this.lng = this.editedBusiness.locationPoint.lng;
                for (let index = 0; index < this.editedBusiness.covers.length; index++) {
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
            openingDays: [{}, Validators.required],
            productName: [],
            productPrice: [],
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

        return this.owners.filter(own => own.username.toLowerCase().indexOf(filterValue) === 0);
    }

    markerDragEnd($event) {
        this.lat = $event.coords.lat;
        console.log(this.lat);
        this.lng = $event.coords.lng;
        console.log(this.lng);
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
            if (temp == this.covers[index]) {
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
        if (this.editedProduct.name && this.editedProduct.price && this.editedProduct.description && this.editedProduct.image) {
            this.order++;
            this.editedProduct.order = this.order;
            this.myData.push(this.editedProduct);
            this.dataFormProductsImgs.push(this.prodcutFile);
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
        var isThere :boolean = false;
        for (let index = 0; index < this.owners.length; index++) {
            if(this.selectedOwner.id == this.owners[index].id){
                this.editedBusiness.ownerId = this.selectedOwner.id;
                isThere = true;
                break;
            }
        }
        if(isThere == false) {
            this.snack.open('There is no Owner with this Username', 'Ok', { duration: 2000 });
            return;
        }
        if (this.editedBusiness.openingDaysEnabled == true) {
            this.editedBusiness.openingDays = this.openingDays;
        }
        else { this.editedBusiness.openingDays = [] }
        this.editedBusiness.ownerId = this.owner.id;
        this.editedBusiness.categoryId = this.category.id;
        this.editedBusiness.subCategoryId = this.subCategory.id;
        this.editedBusiness.cityId = this.region.id;
        this.editedBusiness.locationId = this.subRegion.id;
        if (this.logoFile != null) {
            const logoFrmData: FormData = new FormData();
            logoFrmData.append("file", this.logoFile, this.logoFile.name);
            this.busServ.uploadImages(logoFrmData).subscribe(res => {
                this.editedBusiness.logo = res[0].url;
            })
        }

        if (this.dataFormProductsImgs.length != 0) {
            const productFrmData: FormData = new FormData();
            for (var i = 0; i < this.dataFormProductsImgs.length; i++) {
                productFrmData.append("file", this.dataFormProductsImgs[i], this.dataFormProductsImgs[i].name);
            }
            this.busServ.uploadImages(productFrmData).subscribe(res => {
                for (let j = 0; j < res.length; j++) {
                    this.myData[j + this.editedBusiness.products.length].image = res[j].url;
                    delete this.myData[j + this.editedBusiness.products.length].order;
                    this.editedBusiness.products.push(this.myData[j + this.editedBusiness.products.length]);
                }
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
            })
        }
        this.editedBusiness.locationPoint = { lat: this.lat, lng: this.lng };
        setTimeout(() => {
            this.busServ.editGlobalBusiness(this.editedBusiness, this.editedBusiness.id).subscribe(res => {
                this.loc.back();
                /* this.route.navigate(['/pages/global-business-management']); */
                this.snack.open("You Succesfully update this Business", "Done", {
                    duration: 2000,
                })
            },
                err => {
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
    id:number;
}
