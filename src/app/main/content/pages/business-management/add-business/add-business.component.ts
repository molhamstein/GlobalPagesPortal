import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fuseAnimations } from '../../../../../core/animations';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { BusinessCategoriesService } from '../../../../../core/services/business-cat.service';
import { Location } from '@angular/common';

@Component({
    selector   : 'add-business',
    templateUrl: './add-business.component.html',
    styleUrls  : ['./add-business.component.scss'],
    animations : fuseAnimations
})
export class AddBusinessComponent implements OnInit
{
    form: FormGroup;
    formErrors: any;
    newCat:any ={};
    newSubCat: any = {};
    id:any;
    categories:any = [];
    category:any;

    constructor(private formBuilder: FormBuilder, private businessServ: BusinessCategoriesService, private loc: Location,
        private route : Router, private snack: MatSnackBar, private activatedRoute: ActivatedRoute)
    {
        
    }

    ngOnInit()
    {
        this.formErrors = {
            titleEn   : {},
            titleAr   : {},
        };

        this.activatedRoute.params.subscribe((params: any) => {
            this.id = params.id;
        })

        if (this.id == 'Cat') {
            this.form = this.formBuilder.group({
                titleEn : ['', Validators.required],
                titleAr : ['', Validators.required],
            });
    
            this.form.valueChanges.subscribe(() => {
                this.onFormValuesChanged();
            });   
        }

        if (this.id == 'subCat') {

            this.formErrors = {
                titleEn   : {},
                titleAr   : {},
                category : {}
            };

            this.businessServ.getBusinessCategories().subscribe(res => {
                    this.categories = res;
            })

            this.form = this.formBuilder.group({
                titleEn : ['', Validators.required],
                titleAr : ['', Validators.required],
                category: ['', Validators.required]
            });
            this.form.valueChanges.subscribe(() => {
                this.onFormValuesChanged();
            });   
        }
        
    }

    saveCat(){
        var dateTemp = new Date();
        this.newCat.creationDate = dateTemp.toISOString();
        this.businessServ.addBusiness(this.newCat).subscribe(res => {
            this.route.navigate(['/pages/business-management']);
            this.snack.open("You Succesfully entered a new Business Category","Done", {
                duration: 2000,
              })
        },
        err => {
            this.snack.open("Please Re-enter the right Business Category information..","OK")
        }
    )
    }

    saveSubCat(){
        var dateTemp = new Date();
        this.newSubCat.creationDate = dateTemp.toISOString();
        this.newSubCat.parentCategoryId = this.category.id;
        this.businessServ.addBusiness(this.newSubCat).subscribe(res => {
            this.route.navigate(['/pages/business-management']);
            this.snack.open("You Succesfully entered a new Business SubCategory","Done", {
                duration: 2000,
              })
        },
        err => {
            this.snack.open("Please Re-enter the right Business SubCategory information..","OK")
        }
    )
    }

    back() {
        this.loc.back();
    }

    onFormValuesChanged()
    {
        for ( const field in this.formErrors )
        {
            if ( !this.formErrors.hasOwnProperty(field) )
            {
                continue;
            }

            // Clear previous errors
            this.formErrors[field] = {};

            // Get the control
            const control = this.form.get(field);

            if ( control && control.dirty && !control.valid )
            {
                this.formErrors[field] = control.errors;
            }
        }
    }
}
