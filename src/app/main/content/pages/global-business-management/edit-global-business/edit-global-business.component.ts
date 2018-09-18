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

@Component({
    selector: 'edit-global-business',
    templateUrl: './edit-global-business.component.html',
    styleUrls: ['./edit-global-business.component.scss'],
    animations: fuseAnimations
})
export class EditGlobalBusinessComponent implements OnInit {
    id:any;
    form: FormGroup;
    formErrors: any;
    editedBusiness: any = {};
    categories: any = [];
    category: any = {};
    subCategory: any = {};
    owners: any = [];
    owner: any = {};
    regions: any = [];
    region: any = {};
    subRegion: any = {};
    prodcutFile: File;
    logoFile: File;
    coverFile: File;
    url: any;
    covers: any = [];
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
    editedProduct: any = {};
    order = 0;
    empty: any = [];

    constructor(private formBuilder: FormBuilder, private busServ: GlobalBusinessService,
        private route: Router, private snack: MatSnackBar, private busCatServ: BusinessCategoriesService,
        private regServ: RegionsService, private userServ: usersService, private activatedRoute:ActivatedRoute) {
    }

    ngOnInit() {

        this.activatedRoute.params.subscribe((params: any) => {
            this.id = params.id;

            this.busServ.getGlobalBusinessById(this.id).subscribe(res => {
                this.editedBusiness = res;
                this.editedBusiness.logo = "http://104.217.253.15:3000/images/" + this.editedBusiness.logo;
                for (let index = 0; index < this.editedBusiness.products.length; index++) {
                    this.editedBusiness.products[index].image = "http://104.217.253.15:3000/images/" + this.editedBusiness.products[index].image;                     
                }
                for (let index = 0; index < this.editedBusiness.covers.length; index++) {
                    this.editedBusiness.covers[index].url = "http://104.217.253.15:3000/images/" + this.editedBusiness.covers[index].url; 
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
        })

        this.busCatServ.getBusinessCategories().subscribe(res => {
            this.categories = res;
            debugger
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
    }

    onFileChangedProducts(event) {
        this.prodcutFile = <File>event.target.files[0]

        var reader = new FileReader();

        reader.onload = (event: ProgressEvent) => {
            this.url = (<FileReader>event.target).result;
            this.editedProduct.image = this.url;
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
        if (this.editedProduct.name && this.editedProduct.price && this.editedProduct.image) {
            this.order++;
            this.editedProduct.order = this.order;
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
        this.myData.splice(i, 1);
        this.order = this.myData.length;
        this.dataSource.data = this.myData;
    }

    updateBusiness() {
        if (this.editedBusiness.openingDaysEnabled == true) {
            this.editedBusiness.openingDays = this.openingDays;
        }
        else { this.editedBusiness.openingDays = [] }
        this.editedBusiness.ownerId = this.owner.id;
        this.editedBusiness.categoryId = this.category.id;
        this.editedBusiness.subCategoryId = this.subCategory.id;
        this.editedBusiness.cityId = this.region.id;
        this.editedBusiness.locationId = this.subRegion.id;
        this.editedBusiness.logo = "";
        this.editedBusiness.covers = [];
        this.editedBusiness.products = [];
        this.editedBusiness.locationPoint = { lat: 0, lng: 0 };

        this.busServ.editGlobalBusiness(this.editedBusiness, this.editedBusiness.id).subscribe(res => {
            this.route.navigate(['/pages/global-business-management']);
            this.snack.open("You Succesfully update this Business", "Done", {
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
