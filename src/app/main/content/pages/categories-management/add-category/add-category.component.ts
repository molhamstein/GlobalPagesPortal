import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fuseAnimations } from '../../../../../core/animations';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { CategoriesService } from '../../../../../core/services/categories.service';
import { Location } from '@angular/common';

@Component({
    selector: 'add-category',
    templateUrl: './add-category.component.html',
    styleUrls: ['./add-category.component.scss'],
    animations: fuseAnimations,

})
export class AddCategoryComponent implements OnInit {
    form: FormGroup;
    formErrors: any;
    newCat: any = {};
    newSubCat: any = {};
    id: any;
    categories: any = [];
    category: any;
    catFile: File = null;
    subCatFile: File = null;
    loadingIndicator = false;

    constructor(private formBuilder: FormBuilder, private catServ: CategoriesService, private loc: Location,
        private route: Router, private snack: MatSnackBar, private activatedRoute: ActivatedRoute) {

    }

    ngOnInit() {
        this.formErrors = {
            titleEn: {},
            titleAr: {},
        };

        this.activatedRoute.params.subscribe((params: any) => {
            this.id = params.id;
        })

        if (this.id == 'Cat') {
            this.form = this.formBuilder.group({
                titleEn: ['', Validators.required],
                titleAr: ['', Validators.required],
            });

            this.form.valueChanges.subscribe(() => {
                this.onFormValuesChanged();
            });
        }

        if (this.id == 'subCat') {

            this.formErrors = {
                titleEn: {},
                titleAr: {},
                category: {}
            };

            this.catServ.getCategories().subscribe(res => {
                this.categories = res;

            })

            this.form = this.formBuilder.group({
                titleEn: ['', Validators.required],
                titleAr: ['', Validators.required],
                category: ['', Validators.required]
            });
            this.form.valueChanges.subscribe(() => {
                this.onFormValuesChanged();
            });
        }

    }

    onFileChangedCat(event) {
        this.catFile = <File>event.target.files[0]

        var reader = new FileReader();

        reader.onload = (event: ProgressEvent) => {
            this.newCat.icon = (<FileReader>event.target).result;
        }
        reader.readAsDataURL(event.target.files[0]);
        event.target.value = '';
    }

    onFileChangedSubCat(event) {
        this.subCatFile = <File>event.target.files[0]

        var reader = new FileReader();

        reader.onload = (event: ProgressEvent) => {
            this.newSubCat.icon = (<FileReader>event.target).result;
        }
        reader.readAsDataURL(event.target.files[0]);
        event.target.value = '';
    }

    deleteImageCat(event) {
        var temp = event.path[2].attributes[0].ownerElement.firstElementChild.currentSrc;
        if (temp == this.newCat.icon) {
            this.newCat.icon = '';
            this.catFile = null;
        }
    }

    deleteImageSubCat(event) {
        var temp = event.path[2].attributes[0].ownerElement.firstElementChild.currentSrc;
        if (temp == this.newSubCat.icon) {
            this.newSubCat.icon = '';
            this.subCatFile = null;
        }
    }

    saveCat() {
        var dateTemp = new Date();
        this.loadingIndicator = true;
        this.newCat.creationDate = dateTemp.toISOString();
        if (this.catFile != null) {
            const logoFrmData: FormData = new FormData();
            logoFrmData.append("file", this.catFile, this.catFile.name);
            this.catServ.uploadImages(logoFrmData).subscribe(res => {
                this.newCat.icon = res[0].url;

                this.catServ.addCategory(this.newCat).subscribe(res => {
                    this.route.navigate(['/pages/categories-management']);
                    this.snack.open("You Succesfully entered a new Category", "Done", {
                        duration: 2000,
                    })
                    this.loadingIndicator = false;
                },
                    err => {
                        this.loadingIndicator = false;
                        this.snack.open("Please Re-enter the right Category information..", "OK")
                    }
                )
            })
        }
        else {
            this.newCat.icon = "";
            this.catServ.addCategory(this.newCat).subscribe(res => {
                this.route.navigate(['/pages/categories-management']);
                this.snack.open("You Succesfully entered a new Category", "Done", {
                    duration: 2000,
                })
                this.loadingIndicator = false;
            },
                err => {
                    this.loadingIndicator = false;
                    this.snack.open("Please Re-enter the right Category information..", "OK")
                }
            )
        }

    }

    saveSubCat() {
        var dateTemp = new Date();
        this.loadingIndicator = true;
        this.newSubCat.creationDate = dateTemp.toISOString();
        this.newSubCat.parentCategoryId = this.category.id;
        if (this.subCatFile != null) {
            const logoFrmData: FormData = new FormData();
            logoFrmData.append("file", this.subCatFile, this.subCatFile.name);
            this.catServ.uploadImages(logoFrmData).subscribe(res => {
                this.newSubCat.icon = res[0].url;
            })
            this.catServ.addCategory(this.newSubCat).subscribe(res => {
                this.route.navigate(['/pages/categories-management']);
                this.snack.open("You Succesfully entered a new SubCategory", "Done", {
                    duration: 2000,
                })
                this.loadingIndicator = false;
            },
                err => {
                    this.loadingIndicator = false;
                    this.snack.open("Please Re-enter the right SubCategory information..", "OK")
                }
            )
        }
        else {
            this.newSubCat.icon = "";
            this.catServ.addCategory(this.newSubCat).subscribe(res => {
                this.route.navigate(['/pages/categories-management']);
                this.snack.open("You Succesfully entered a new SubCategory", "Done", {
                    duration: 2000,
                })
                this.loadingIndicator = false;
            },
                err => {
                    this.loadingIndicator = false;
                    this.snack.open("Please Re-enter the right SubCategory information..", "OK")
                }
            )
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
