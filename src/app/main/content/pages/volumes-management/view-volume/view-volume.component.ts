import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fuseAnimations } from '../../../../../core/animations';
import { ActivatedRoute } from '@angular/router';
import { Location } from '../../../../../../../node_modules/@angular/common';
import { AdsService } from '../../../../../core/services/ads.service';
import { VolumesService } from '../../../../../core/services/volumes.service.';
import { MatTableDataSource } from '@angular/material';

@Component({
    selector: 'view-volume',
    templateUrl: './view-volume.component.html',
    styleUrls: ['./view-volume.component.scss'],
    animations: fuseAnimations
})
export class ViewVolumeComponent implements OnInit {
    displayedColumns = ['order', 'title', 'description', 'status'];
    dataSource = new MatTableDataSource<Ads>([]);
    myData: Ads[] = [];
    form: FormGroup;
    formErrors: any;
    id: any;
    volumeInfo: any = {};
    order = 0;

    constructor(private formBuilder: FormBuilder, private adServ: AdsService,
        private volServ:VolumesService, private loc: Location, private activatedRoute: ActivatedRoute) {

    }

    ngOnInit() {

        this.activatedRoute.params.subscribe((params: any) => {
            this.id = params.id;
        });

        this.volServ.getVolumeById(this.id).subscribe(res => {
            this.volumeInfo = res;
            var temp = new Date(this.volumeInfo.creationDate);
            this.volumeInfo.creationDate = temp.toLocaleDateString('en-US');
            for (let index = 0; index < this.volumeInfo.posts.length; index++) {
                this.order++;
                var atemp = this.volumeInfo.posts[index];
                atemp.order = this.order;
                this.myData.push(atemp);
            }
            this.dataSource.data = this.myData;
        })
        this.dataSource = new MatTableDataSource(this.myData);

        this.formErrors = {
            titleAr: {},
            titleEn: {},
            status: {},
            creationDate: {},
        };

        this.form = this.formBuilder.group({
            titleAr: ['', Validators.required],
            titleEn: ['', Validators.required],
            status: ['', Validators.required],
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

export interface Ads {
    order: number;
    title: string;
    description: string;
    status: string;
    id: string;
}
