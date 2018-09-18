import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fuseAnimations } from '../../../../../core/animations';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { RegionsService } from '../../../../../core/services/regions.service';

@Component({
    selector   : 'add-region',
    templateUrl: './add-region.component.html',
    styleUrls  : ['./add-region.component.scss'],
    animations : fuseAnimations
})
export class AddRegionComponent implements OnInit
{
    form: FormGroup;
    formErrors: any;
    newCity:any ={};
    newLocation: any = {};
    id:any;
    cities:any = [];
    city:any;

    constructor(private formBuilder: FormBuilder, private regServ: RegionsService, private route : Router, private snack: MatSnackBar, private activatedRoute: ActivatedRoute)
    {
        
    }

    ngOnInit()
    {
        
        this.activatedRoute.params.subscribe((params: any) => {
            this.id = params.id;
        })

        if (this.id == 'City') {

            this.formErrors = {
                nameEn   : {},
                nameAr   : {},
            };
    
            this.form = this.formBuilder.group({
                nameEn : ['', Validators.required],
                nameAr : ['', Validators.required],
            });
    
            this.form.valueChanges.subscribe(() => {
                this.onFormValuesChanged();
            });   
        }

        if (this.id == 'Location') {

            this.formErrors = {
                nameEn   : {},
                nameAr   : {},
                city : {}
            };

            this.regServ.getAllCities().subscribe(res => {
                this.cities = res;

            })

            this.form = this.formBuilder.group({
                nameEn : ['', Validators.required],
                nameAr : ['', Validators.required],
                city: ['', Validators.required]
            });
            this.form.valueChanges.subscribe(() => {
                this.onFormValuesChanged();
            });   
        }
        
    }

    saveCity(){

        this.regServ.addCity(this.newCity).subscribe(res => {
            this.route.navigate(['/pages/regions-management']);
            this.snack.open("You Succesfully entered a new City","Done", {
                duration: 2000,
              })
        },
        err => {
            this.snack.open("Please Re-enter the right City information..","OK")
        }
    )
    }

    saveLocation(){
        this.newLocation.cityId = this.city.id;
        this.regServ.addLocation( this.newLocation).subscribe(res => {
            this.route.navigate(['/pages/regions-management']);
            this.snack.open("You Succesfully entered a new Location","Done", {
                duration: 2000,
              })
        },
        err => {
            this.snack.open("Please Re-enter the right Location information..","OK")
        }
    )
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
