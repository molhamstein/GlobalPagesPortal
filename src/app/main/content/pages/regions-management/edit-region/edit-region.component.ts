import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fuseAnimations } from '../../../../../core/animations';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { RegionsService } from '../../../../../core/services/regions.service';
import { Location } from '@angular/common';

@Component({
    selector: 'edit-region',
    templateUrl: './edit-region.component.html',
    styleUrls: ['./edit-region.component.scss'],
    animations: fuseAnimations
})
export class EditRegionComponent implements OnInit {
    form: FormGroup;
    formErrors: any;
    editedReg: any = {};
    id: any;
    city: any;
    cities: any = [];
    isParent = false;
    isChild = false;
    cityExists: any;
    locExists: any;

    constructor(private formBuilder: FormBuilder, private regServ: RegionsService, private loc : Location,
        private route: Router, private snack: MatSnackBar, private activatedRoute: ActivatedRoute) {

    }

    ngOnInit() {
        this.activatedRoute.params.subscribe((params: any) => {
            this.id = params.id;
        });

        this.regServ.cityExist(this.id).subscribe(res => {
            this.cityExists = res.exists;

            if (this.cityExists) {
                this.regServ.getCityById(this.id).subscribe(res => {
                    this.editedReg = res;
                    this.isParent = true;
                    this.formErrors = {
                        nameEn: {},
                        nameAr: {},
                    };

                    this.form = this.formBuilder.group({
                        nameEn: ['', Validators.required],
                        nameAr: ['', Validators.required],
                    });

                    this.form.valueChanges.subscribe(() => {
                        this.onFormValuesChanged();
                    });
                })
            }

            else {
                this.regServ.locationExist(this.id).subscribe(res => {
                    this.locExists = res.exists;
                    if (this.locExists == false) {
                        this.route.navigate(['/pages/regions-management']);
                        this.snack.open("No City or Location with this Id", "Close", {
                            duration: 2000,
                        })
                    }
                })

                this.regServ.getLocationById(this.id).subscribe(res => {
                    this.editedReg = res;

                    this.isChild = true;

                    /* this.businessServ.getBusinessById(this.editedBusiness.parentCategoryId).subscribe(res => {
                        this.category = res;
                    }) */

                    this.regServ.getAllCities().subscribe(res => {
                        this.cities = res;
                    })

                    this.formErrors = {
                        nameEn: {},
                        nameAr: {},
                        city: {}
                    };

                    this.form = this.formBuilder.group({
                        nameEn: ['', Validators.required],
                        nameAr: ['', Validators.required],
                        city: ['', Validators.required]
                    });

                    this.form.valueChanges.subscribe(() => {
                        this.onFormValuesChanged();
                    });
                })

            }
        })
    }

    updateCity() {
        this.regServ.editCity(this.editedReg, this.id).subscribe(() => {
            this.route.navigate(['/pages/regions-management']);
            this.snack.open("You Succesfully updated this City", "Done", {
                duration: 2000,
            })
        },
            err => {
                this.snack.open("Please Re-enter the right City information..", "OK")
            }
        )
    }

    updateLocation() {
        this.editedReg.cityId = this.city.id;
        this.regServ.editLocation(this.editedReg, this.id).subscribe(() => {
            this.route.navigate(['/pages/regions-management']);
            this.snack.open("You Succesfully updated this Location", "Done", {
                duration: 2000,
            })
        },
            err => {
                this.snack.open("Please Re-enter the right Location information..", "OK")
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
