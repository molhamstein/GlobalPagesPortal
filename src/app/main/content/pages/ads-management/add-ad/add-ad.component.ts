import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { fuseAnimations } from '../../../../../core/animations';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { AdsService } from '../../../../../core/services/ads.service';
import { CategoriesService } from '../../../../../core/services/categories.service';
import { RegionsService } from '../../../../../core/services/regions.service';
import { usersService } from '../../../../../core/services/users.service';
import { Location } from '../../../../../../../node_modules/@angular/common';
import { Observable } from 'rxjs/Observable';
import { startWith, map } from 'rxjs/operators';

@Component({
    selector: 'add-ad',
    templateUrl: './add-ad.component.html',
    styleUrls: ['./add-ad.component.scss'],
    animations: fuseAnimations
})
export class AddAdComponent implements OnInit {
    form: FormGroup;
    formErrors: any;
    myControl = new FormControl();
    filteredOptions: Observable<Owners[]>;
    selectedOwner: any = {};
    newAd: any = {};
    categories: any = [];
    category: any = {};
    subCategory: any = {};
    owners: any = [];
    owner: any = {};
    regions: any = [];
    region: any = {};
    subRegion: any = {};
    imgs: any = [];
    selectedFile: File;
    url: any;
    dataFormImgs: any = [];
    selectStatus = ['pending', 'activated', 'deactivated'];

    constructor(private formBuilder: FormBuilder, private adServ: AdsService, private loc: Location,
        private route: Router, private snack: MatSnackBar, private catServ: CategoriesService,
        private regServ: RegionsService, private userServ: usersService) {

        this.newAd.isFeatured = false;
        this.newAd.media = [];
        this.category.subCategories = [];
        this.region.locations = [];
    }

    ngOnInit() {

        this.userServ.getAllUsers().subscribe(res => {
            this.owners = res;
            this.filteredOptions = this.myControl.valueChanges
                .pipe(
                    startWith<string | Owners>(''),
                    map(value => typeof value === 'string' ? value : value.username),
                    map(title => title ? this._filter(title) : this.owners.slice())
                );
        })

        this.catServ.getCategories().subscribe(res => {
            this.categories = res;
        })

        this.regServ.getAllCities().subscribe(res => {
            this.regions = res;
        })

        this.formErrors = {
            title: {},
            description: {},
            status: {},
            isFeatured: {},
            category: [],
            subCategory: [],
            city: [],
            location: [],

        };

        this.form = this.formBuilder.group({
            title: ['', Validators.required],
            description: ['', Validators.required],
            status: ['', Validators.required],
            isFeatured: [''],
            category: [this.categories[0], Validators.required],
            subCategory: [{}, Validators.required],
            city: [{}, Validators.required],
            location: ['', Validators.required],

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

    onFileChanged(event) {
        this.selectedFile = <File>event.target.files[0]

        var reader = new FileReader();

        reader.onload = (event: ProgressEvent) => {
            this.url = (<FileReader>event.target).result;
            this.imgs.push(this.url);
        }
        reader.readAsDataURL(event.target.files[0]);
        event.target.value = '';

        this.dataFormImgs.push(this.selectedFile);
    }

    deleteImage(event) {
        var temp = event.path[2].attributes[0].ownerElement.firstElementChild.currentSrc;
        for (let index = 0; index < this.imgs.length; index++) {
            if (temp == this.imgs[index]) {
                const i: number = this.imgs.indexOf(this.imgs[index]);
                if (i !== -1) {
                    this.imgs.splice(index, 1);
                    this.dataFormImgs.splice(index, 1);
                    return
                }
            }
        }
    }

    saveAd() {
        var dateTemp = new Date();
        this.newAd.creationDate = dateTemp.toISOString();
        this.newAd.viewsCount = 0;
        var isThere :boolean = false;
        for (let index = 0; index < this.owners.length; index++) {
            if(this.selectedOwner.id == this.owners[index].id){
                this.newAd.ownerId = this.selectedOwner.id;
                isThere = true;
                break;
            }
        }
        if(isThere == false) {
            this.snack.open('There is no Owner with this Username', 'Ok', { duration: 2000 });
            return;
        }
        
        this.newAd.categoryId = this.category.id;
        this.newAd.subCategoryId = this.subCategory.id;
        this.newAd.cityId = this.region.id;
        this.newAd.locationId = this.subRegion.id;

        if (this.dataFormImgs.length != 0) {
            const frmData: FormData = new FormData();
            for (var i = 0; i < this.dataFormImgs.length; i++) {
                frmData.append("file", this.dataFormImgs[i], this.dataFormImgs[i].name);
            }
            this.adServ.uploadImages(frmData).subscribe(res => {
                for (let j = 0; j < res.length; j++) {
                    var tempobj: any = {};
                    tempobj.url = res[j].url;
                    tempobj.thumbnail = res[j].url;
                    tempobj.type = 'image';
                    this.newAd.media.push(tempobj);
                }
            })
        }
        setTimeout(() => {

            this.adServ.addNewAd(this.newAd).subscribe(res => {
                this.loc.back();
                /* this.route.navigate(['/pages/ads-management']); */
                this.snack.open("You Succesfully entered a new Advertisement", "Done", {
                    duration: 2000,
                })
            },
                err => {
                    this.snack.open("Please Re-enter the right Advertisement information..", "OK")
                }
            )
        },2000);

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

export interface Owners {
    username: string;
    email: string;
    status: string;
    gender: string;
    id:number;
}
