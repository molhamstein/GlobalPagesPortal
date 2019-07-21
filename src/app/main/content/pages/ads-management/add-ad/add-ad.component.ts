import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { fuseAnimations } from '../../../../../core/animations';
import { MatSnackBar, MatAutocomplete } from '@angular/material';
import { AdsService } from '../../../../../core/services/ads.service';
import { Location } from '../../../../../../../node_modules/@angular/common';

@Component({
    selector: 'add-ad',
    templateUrl: './add-ad.component.html',
    styleUrls: ['./add-ad.component.scss'],
    animations: fuseAnimations
})
export class AddAdComponent implements OnInit {
    form: FormGroup;
    formErrors: any;
    newAd: any = {};
    imgs: any = [];
    selectedFile: File;
    url: any;
    dataFormImgs: any = [];
    selectStatus = ['pending', 'activated', 'deactivated'];
    loadingIndicator = false;

    constructor(private formBuilder: FormBuilder, private adServ: AdsService, private location: Location,private snack: MatSnackBar ) {

        this.newAd.isFeatured = false;
        this.newAd.media = [];

    }

    ngOnInit() {


        this.formErrors = {
            title: {},
            description: {},
            status: {},
            isFeatured: {},
            category: {},
            subCategory: {},
            city: {},
            location: {},
            owner: {} 

        };

        this.form = this.formBuilder.group({
            title: ['', Validators.required],
            description: ['', Validators.required],
            status: ['', Validators.required],
            isFeatured: [''],
            category: [null, Validators.required],
            subCategory: [null, Validators.required],
            city: [ null , Validators.required],
            location: [ null , Validators.required],
            owner: [null, Validators.required],


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


        this.loadingIndicator = true;
        // @todd refactor this shit to use Reactive Form only 
        this.newAd.categoryId = this.form.get('category').value.id;
        this.newAd.subCategoryId = this.form.get('subCategory').value.id; 
        this.newAd.cityId = this.form.get('city').value.id;
        this.newAd.locationId = this.form.get('location').value.id;
        this.newAd.ownerId = this.form.get('owner').value.id;


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
                this.adServ.addNewAd(this.newAd).subscribe(res => {
                    this.location.back();
                    /* this.route.navigate(['/pages/ads-management']); */
                    this.snack.open("You Succesfully entered a new Advertisement", "Done", {
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
            this.adServ.addNewAd(this.newAd).subscribe(res => {
                this.location.back();
                /* this.route.navigate(['/pages/ads-management']); */
                this.snack.open("You Succesfully entered a new Advertisement", "Done", {
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

    back() {
        this.location.back();
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
