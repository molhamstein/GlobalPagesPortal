import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { fuseAnimations } from '../../../../../core/animations';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { RegionsService } from '../../../../../core/services/regions.service';
import { AdsService } from '../../../../../core/services/ads.service';
import { CategoriesService } from '../../../../../core/services/categories.service';
import { usersService } from '../../../../../core/services/users.service';
import { Location } from '../../../../../../../node_modules/@angular/common';
import { Observable } from 'rxjs/Observable';
import { startWith, map } from 'rxjs/operators';

@Component({
    selector: 'edit-ad',
    templateUrl: './edit-ad.component.html',
    styleUrls: ['./edit-ad.component.scss'],
    animations: fuseAnimations
})
export class EditAdComponent implements OnInit {
    form: FormGroup;
    formErrors: any;
    id: any;
    myControl = new FormControl();
    filteredOptions: Observable<Owners[]>;
    selectedOwner: any = {};
    editedAd: any = {};
    categories: any = [];
    category: any = {};
    subCategory: any = {};
    subCategories:any = [];
    subRegions:any = [];
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
    loadingIndicator = false;

    constructor(private formBuilder: FormBuilder, private adServ: AdsService, private loc: Location,
        private route: Router, private snack: MatSnackBar, private catServ: CategoriesService,
        private regServ: RegionsService, private userServ: usersService, private activatedRoute: ActivatedRoute) {

        this.category.subCategories = [];
        this.region.locations = [];
    }

    ngOnInit() {

        this.activatedRoute.params.subscribe((params: any) => {
            this.id = params.id;

            this.adServ.getAdById(this.id).subscribe(res => {
                this.editedAd = res;
                this.selectedOwner = this.editedAd.owner;
                if (this.editedAd.media) {
                    for (let index = 0; index < this.editedAd.media.length; index++) {
                        if(this.editedAd.media[index].type == 'video/*') {
                            this.imgs.push(this.editedAd.media[index].thumbnail);
                        }
                        else {
                            this.imgs.push(this.editedAd.media[index].url);
                        }
                    }
                }
                else { this.editedAd.media = [] }
            })
        });

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
            for (let index = 0; index < this.categories.length; index++) {
                if (this.categories[index].id == this.editedAd.categoryId) {
                    this.category = this.categories[index];
                    for (let j = 0; j < this.categories[index].subCategories.length; j++) {
                        this.subCategories.push(this.categories[index].subCategories[j]);
                        if (this.categories[index].subCategories[j].id == this.editedAd.subCategoryId) {
                            this.subCategory = this.categories[index].subCategories[j];
                        }
                    }
                    break;
                }
            }
        })

        this.regServ.getAllCities().subscribe(res => {
            this.regions = res;
            for (let index = 0; index < this.regions.length; index++) {
                if (this.regions[index].id == this.editedAd.cityId) {
                    this.region = this.regions[index];
                    for (let i = 0; i < this.regions[index].locations.length; i++) {
                        this.subRegions.push(this.regions[index].locations[i]);
                        if (this.regions[index].locations[i].id == this.editedAd.locationId) {
                            this.subRegion = this.regions[index].locations[i];
                        }
                    }
                    break;
                }
            }
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
            category: ['', [Validators.required]],
            subCategory: [this.categories[0], Validators.required],
            city: [this.regions[0], Validators.required],
            location: [this.regions[0], Validators.required],
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

    updateAd() {
        var isThere :boolean = false;
        this.loadingIndicator = true;
        for (let index = 0; index < this.owners.length; index++) {
            if(this.selectedOwner.id == this.owners[index].id){
                this.editedAd.ownerId = this.selectedOwner.id;
                isThere = true;
                break;
            }
        }
        if(isThere == false) {
            this.loadingIndicator = false;
            this.snack.open('There is no Owner with this Username', 'Ok', { duration: 2000 });
            return;
        }
        this.editedAd.categoryId = this.category.id;
        this.editedAd.subCategoryId = this.subCategory.id;
        this.editedAd.cityId = this.region.id;
        this.editedAd.locationId = this.subRegion.id;
        delete this.editedAd.category;
        delete this.editedAd.subCategory;
        delete this.editedAd.city;
        delete this.editedAd.location;
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
                    this.editedAd.media.push(tempobj);
                }
                this.adServ.editAd(this.editedAd, this.editedAd.id).subscribe(res => {
                    this.loc.back();
                    /* this.route.navigate(['/pages/ads-management']); */
                    this.snack.open("You Succesfully updated an Advertisement", "Done", {
                        duration: 2000,
                    })
                    this.loadingIndicator = false;
                },
                    err => {
                        this.loadingIndicator = false;
                        this.snack.open("Please Re-enter the right Advertisement information..", "OK")
                    }
                )
            })
        }
        else {
            this.adServ.editAd(this.editedAd, this.editedAd.id).subscribe(res => {
                this.loc.back();
                /* this.route.navigate(['/pages/ads-management']); */
                this.snack.open("You Succesfully updated an Advertisement", "Done", {
                    duration: 2000,
                })
                this.loadingIndicator = false;
            },
                err => {
                    this.loadingIndicator = false;
                    this.snack.open("Please Re-enter the right Advertisement information..", "OK")
                }
            )
        }
    }

    /* eventSelection(event) {
        console.log(event)
    } */

    deleteImage(event) {
        var temp = event.path[2].attributes[0].ownerElement.firstElementChild.currentSrc;
        for (let index = 0; index < this.imgs.length; index++) {
            if (temp == this.imgs[index]) {
                const i: number = this.imgs.indexOf(this.imgs[index]);
                if (i !== -1) {
                    if (temp.startsWith('http')) {
                        this.imgs.splice(index, 1);
                        this.editedAd.media.splice(index, 1);
                        return
                    }
                    this.imgs.splice(index, 1);
                    this.dataFormImgs.splice(index - this.editedAd.media.length, 1);
                    return
                }
            }
        }
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
