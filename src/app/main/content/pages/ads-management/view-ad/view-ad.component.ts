import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fuseAnimations } from '../../../../../core/animations';
import { usersService } from '../../../../../core/services/users.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '../../../../../../../node_modules/@angular/common';
import { AdsService } from '../../../../../core/services/ads.service';

@Component({
    selector: 'view-ad',
    templateUrl: './view-ad.component.html',
    styleUrls: ['./view-ad.component.scss'],
    animations: fuseAnimations
})
export class ViewAdComponent implements OnInit {
    form: FormGroup;
    formErrors: any;
    id: any;
    Adinfo: any = {};
    imgs: any = [];
    url: any;

    constructor(private formBuilder: FormBuilder, private adServ: AdsService,
        private loc: Location, private activatedRoute: ActivatedRoute) {

    }

    ngOnInit() {

        this.activatedRoute.params.subscribe((params: any) => {
            this.id = params.id;

            setTimeout(() => {


                this.adServ.getAdById(this.id).subscribe(res => {
                    this.Adinfo = res;
                    var temp = new Date(this.Adinfo.creationDate);
                    this.Adinfo.creationDate = temp.toLocaleDateString('en-US');
                    for (let index = 0; index < this.Adinfo.media.length; index++) {
                        this.imgs.push('http://' + this.Adinfo.media[index].url);
                    }

                    if (this.Adinfo.creationDate == undefined) {
                        this.Adinfo.creationDate = "";
                    }
                    if (this.Adinfo.viewsCount == undefined) {
                        this.Adinfo.viewsCount = "";
                    }
                    if (this.Adinfo.location == undefined) {
                        this.Adinfo["location"] = {}; 
                        this.Adinfo.location.nameEn = "";
                    }
                    if (this.Adinfo.owner == undefined) {
                        this.Adinfo["owner"] = {};
                        this.Adinfo.owner.username = "";
                    }
                })

            });
        });


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
            viewsCount: [],
            creationDate: []
        };

        this.form = this.formBuilder.group({
            title: ['', Validators.required],
            description: ['', Validators.required],
            status: ['', Validators.required],
            isFeatured: [''],
            category: ['', [Validators.required]],
            subCategory: ['', Validators.required],
            city: ['', Validators.required],
            location: ['', Validators.required],
            owner: ['', Validators.required],
            viewsCount: ['', Validators.required],
            creationDate: ['', Validators.required],
        });

        this.form.valueChanges.subscribe(() => {
            this.onFormValuesChanged();
        });

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


    back() {
        this.loc.back();
    }


}
