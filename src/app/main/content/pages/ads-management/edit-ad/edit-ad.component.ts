import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fuseAnimations } from '../../../../../core/animations';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { RegionsService } from '../../../../../core/services/regions.service';
import { AdsService } from '../../../../../core/services/ads.service';
import { CategoriesService } from '../../../../../core/services/categories.service';
import { usersService } from '../../../../../core/services/users.service';

@Component({
    selector: 'edit-ad',
    templateUrl: './edit-ad.component.html',
    styleUrls: ['./edit-ad.component.scss'],
    animations: fuseAnimations
})
export class EditAdComponent implements OnInit {
    form: FormGroup;
    formErrors: any;
    id:any;
    editedAd: any = {};
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

    constructor(private formBuilder: FormBuilder, private adServ: AdsService,
        private route: Router, private snack: MatSnackBar, private catServ: CategoriesService,
        private regServ: RegionsService, private userServ: usersService, private activatedRoute : ActivatedRoute) {

        this.category.subCategories = [];
        this.region.locations = [];
    }

    ngOnInit() {

        this.activatedRoute.params.subscribe((params: any) => {
            this.id = params.id;

            this.adServ.getAdById(this.id).subscribe(res => {
                this.editedAd = res;
                for (let index = 0; index < this.editedAd.media.length; index++) {
                    this.imgs.push('http://' + this.editedAd.media[index].url);
                }
            })

            

        });

        this.userServ.getAllUsers().subscribe(res => {
            this.owners = res;
        })

        this.catServ.getAllCategories().subscribe(res => {
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
            owner: [],
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
            owner: [this.owners[0], Validators.required],
        });

        this.form.valueChanges.subscribe(() => {
            this.onFormValuesChanged();
        });

    }

    onFileChanged(event) {
        this.selectedFile = <File>event.target.files[0]

        var reader = new FileReader();

        reader.onload = (event: ProgressEvent) => {
            this.url = (<FileReader>event.target).result;
            this.imgs.push(this.url);
        }
        reader.readAsDataURL(event.target.files[0]);

        this.dataFormImgs.push(this.selectedFile);

        debugger
    }

    onupload() {
        const frmData = new FormData();

        for (var i = 0; i < this.dataFormImgs.length; i++) {
            frmData.append("fileUpload", this.dataFormImgs[i], this.dataFormImgs[i].name);
            debugger
        }
        /* this.adServ.uploadImages(frmData).subscribe(events => {
            console.log(events)

        }) */
    }

    updateAd() {
        this.editedAd.ownerId = this.owner.id;
        this.editedAd.categoryId = this.category.id;
        this.editedAd.subCategoryId = this.subCategory.id;
        this.editedAd.cityId = this.region.id;
        this.editedAd.locationId = this.subRegion.id;
        /* this.editedAd.media = []; */
        if(!this.editedAd.media) {
            this.editedAd.media = [];
        }

        this.adServ.editAd(this.editedAd, this.editedAd.id).subscribe(res => {
            this.route.navigate(['/pages/ads-management']);
            this.snack.open("You Succesfully updated an Advertisement", "Done", {
                duration: 2000,
            })
        },
            err => {
                this.snack.open("Please Re-enter the right Advertisement information..", "OK")
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
