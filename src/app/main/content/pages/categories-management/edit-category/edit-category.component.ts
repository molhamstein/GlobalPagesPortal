import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fuseAnimations } from '../../../../../core/animations';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { CategoriesService } from '../../../../../core/services/categories.service';

@Component({
    selector: 'edit-category',
    templateUrl: './edit-category.component.html',
    styleUrls: ['./edit-category.component.scss'],
    animations: fuseAnimations
})
export class EditCategoryComponent implements OnInit {
    form: FormGroup;
    formErrors: any;
    editedCat: any = {};
    id: any;
    category: any;
    categories: any = [];
    isParent = false;
    isChild = false;

    constructor(private formBuilder: FormBuilder, private catServ: CategoriesService,
        private route: Router, private snack: MatSnackBar, private activatedRoute: ActivatedRoute) {

    }

    ngOnInit() {
        this.activatedRoute.params.subscribe((params: any) => {
            this.id = params.id;
        });

        this.catServ.getCategoryById(this.id).subscribe(res => {
            this.editedCat = res;


            if (!this.editedCat.parentCategoryId) {
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

            if (this.editedCat.parentCategoryId) {
                this.isChild = true;

                /* this.businessServ.getBusinessById(this.editedBusiness.parentCategoryId).subscribe(res => {
                    this.category = res;
                }) */

                this.catServ.getCategories().subscribe(res => {
                    this.categories = res;
                })

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

    updateCategory() {

        if (this.editedCat.parentCategoryId) {
            this.editedCat.parentCategoryId = this.category.id;
        }

        this.catServ.editCategory(this.editedCat, this.id).subscribe(() => {
            this.route.navigate(['/pages/categories-management']);
            this.snack.open("You Succesfully updated this Category", "Done", {
                duration: 2000,
            })
        },
            err => {
                this.snack.open("Please Re-enter the right Category information..", "OK")
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
