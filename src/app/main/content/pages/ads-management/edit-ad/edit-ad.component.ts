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
    editedAd: any = {};
    imgs: any = [];
    selectedFile: File;
    url: any;
    dataFormImgs: any = [];
    selectStatus = ['pending', 'activated', 'deactivated'];
    loadingIndicator = false;

    constructor(private formBuilder: FormBuilder, private adServ: AdsService, private loc: Location,
        private snack: MatSnackBar, private activatedRoute: ActivatedRoute) {

    }

    ngOnInit() {

        let props = ["title" , "title" , "description", "status", "isFeatured", "category", "subCategory", "city" , "location" , "owner"] ; 
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
            city: [null, Validators.required],
            location: [null, Validators.required],
            owner: [null, Validators.required],


        });

        this.form.valueChanges.subscribe(() => {
            this.onFormValuesChanged();
        });


        this.activatedRoute.params.subscribe((params: any) => {
            this.id = params.id;

            this.adServ.getAdById(this.id).subscribe(res => {
                this.editedAd = res;

                for (let field of props) {
                        this.form.controls[field].setValue(res[field]); 
                }
                if (this.editedAd.media) {
                    for (let index = 0; index < this.editedAd.media.length; index++) {
                        if (this.editedAd.media[index].type == 'video/*') {
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
        this.loadingIndicator = true;



        this.editedAd.categoryId = this.form.get('category').value.id;
        this.editedAd.subCategoryId = this.form.get('subCategory').value.id;
        this.editedAd.cityId = this.form.get('city').value.id;
        this.editedAd.locationId = this.form.get('location').value.id;
        this.editedAd.ownerId = this.form.get('owner').value.id;

        delete this.editedAd.category;
        delete this.editedAd.subCategory;
        delete this.editedAd.city;
        delete this.editedAd.location;
        delete this.editedAd.owner;

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
