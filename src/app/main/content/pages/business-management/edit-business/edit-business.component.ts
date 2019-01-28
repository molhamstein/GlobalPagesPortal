import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fuseAnimations } from '../../../../../core/animations';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { BusinessCategoriesService } from '../../../../../core/services/business-cat.service';
import { Location } from '@angular/common';

@Component({
    selector: 'edit-business',
    templateUrl: './edit-business.component.html',
    styleUrls: ['./edit-business.component.scss'],
    animations: fuseAnimations
})
export class EditBusinessComponent implements OnInit {
    form: FormGroup;
    formErrors: any;
    editedBusiness: any = {};
    id: any;
    category: any;
    categories: any = [];
    isParent = false;
    isChild = false;
    loadingIndicator = false;

    constructor(private formBuilder: FormBuilder, private businessServ: BusinessCategoriesService, private loc : Location,
        private route: Router, private snack: MatSnackBar, private activatedRoute: ActivatedRoute) {

    }

    ngOnInit() {
        this.activatedRoute.params.subscribe((params: any) => {
            this.id = params.id;
        });

        this.businessServ.getBusinessById(this.id).subscribe(res => {
            this.editedBusiness = res;


            if (!this.editedBusiness.parentCategoryId) {
                this.isParent = true;
                this.formErrors = {
                    titleEn: {},
                    titleAr: {},
                };

                this.form = this.formBuilder.group({
                    titleEn: ['', Validators.required],
                    titleAr: ['', Validators.required],
                });

                this.form.valueChanges.subscribe(() => {
                    this.onFormValuesChanged();
                });
            }

            if (this.editedBusiness.parentCategoryId) {
                this.isChild = true;

                this.businessServ.getBusinessCategories().subscribe(res => {
                    this.categories = res;
                })

                /*  this.businessServ.getBusinessById(this.editedBusiness.parentCategoryId).subscribe(res => {
                     this.category = res;
                 }) */

                this.formErrors = {
                    titleEn: {},
                    titleAr: {},
                    category: {}
                };

                this.form = this.formBuilder.group({
                    titleEn: ['', Validators.required],
                    titleAr: ['', Validators.required],
                    category: ['', Validators.required]
                });

                this.form.valueChanges.subscribe(() => {
                    this.onFormValuesChanged();
                });
            }
        })

    }

    updateBusiness() {

        if (this.editedBusiness.parentCategoryId) {
            this.editedBusiness.parentCategoryId = this.category.id;
        }
        this.loadingIndicator = true;
        this.businessServ.editBusiness(this.editedBusiness, this.id).subscribe(() => {
            this.route.navigate(['/pages/business-management']);
            this.snack.open("You Succesfully updated this Business", "Done", {
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
