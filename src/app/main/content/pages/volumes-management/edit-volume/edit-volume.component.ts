import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { fuseAnimations } from '../../../../../core/animations';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar, MatTableDataSource } from '@angular/material';
import { AdsService } from '../../../../../core/services/ads.service';
import { VolumesService } from '../../../../../core/services/volumes.service.';
import { Observable } from 'rxjs/Observable';
import { startWith, map } from 'rxjs/operators';
import { Location } from '../../../../../../../node_modules/@angular/common';

@Component({
    selector: 'edit-volume',
    templateUrl: './edit-volume.component.html',
    styleUrls: ['./edit-volume.component.scss'],
    animations: fuseAnimations
})
export class EditVolumeComponent implements OnInit {
    myControl = new FormControl();
    filteredOptions: Observable<Ads[]>;
    displayedColumns = ['order', 'title', 'description', 'status', 'icons'];
    dataSource = new MatTableDataSource<Ads>([]);
    myData: Ads[] = [];
    form: FormGroup;
    formErrors: any;
    id:any;
    editedVolume: any = {};
    ads: Ads[] = [];
    selectedAd: any = {};
    order = 0;
    selectStatus = ['pending', 'activated','deactivated'];
    loadingIndicator = false;

    constructor(private formBuilder: FormBuilder, private adServ: AdsService, private volServ:VolumesService,
        private route: Router, private snack: MatSnackBar, private activatedRoute : ActivatedRoute, private loc : Location) {
    }

    ngOnInit() {

        this.dataSource = new MatTableDataSource(this.myData);
        this.activatedRoute.params.subscribe((params: any) => {
            this.id = params.id;

            this.volServ.getVolumeById(this.id).subscribe(res => {
                this.editedVolume = res;
                for (let index = 0; index < this.editedVolume.posts.length; index++) {
                    this.order++;
                    var temp = this.editedVolume.posts[index];
                    temp.order = this.order;
                    this.myData.push(temp);
                }
                this.dataSource.data = this.myData;
            })

        });

        this.dataSource = new MatTableDataSource(this.myData);

        this.adServ.getAllAds().subscribe(res => {
            this.ads = res;
            this.filteredOptions = this.myControl.valueChanges
                .pipe(
                    startWith<string | Ads>(''),
                    map(value => typeof value === 'string' ? value : value.title),
                    map(title => title ? this._filter(title) : this.ads.slice())
                );
        })


        this.formErrors = {
            titleAr: {},
            titleEn: {},
            status: {},
        };

        this.form = this.formBuilder.group({
            titleAr: ['', Validators.required],
            titleEn: ['', Validators.required],
            status: ['', Validators.required],
            selectedAd: [''],
        });

        this.form.valueChanges.subscribe(() => {
            this.onFormValuesChanged();
        });

    }

    displayFn(ad?: Ads): string | undefined {
        return ad ? ad.title : undefined;
    }

    private _filter(title: string): Ads[] {
        const filterValue = title.toLowerCase();

        return this.ads.filter(ad => ad.title.toLowerCase().indexOf(filterValue) === 0);
    }

    pushAd() {
        for (let j = 0; j < this.ads.length; j++) {
            if (this.selectedAd.title == this.ads[j].title) {
                for (let index = 0; index < this.myData.length; index++) {
                    if (this.selectedAd.title == this.myData[index].title) {
                        this.snack.open('This Ad has been Already Added', 'Ok', { duration: 2000 })
                        return
                    }
                }
                this.order++;
                this.selectedAd.order = this.order;
                this.myData.push(this.selectedAd);
                this.dataSource.data = this.myData;
                this.selectedAd = "";
                return
            }
        }
        this.snack.open('There is no Ad with this Title', 'Ok', { duration: 2000 })
        return
    }

    deleteAd(ad) {
        var i = this.myData.indexOf(ad, 0);
        for (let index = i + 1; index < this.myData.length; index++) {
            this.myData[index].order--;
        }
        this.myData.splice(i, 1);
        this.order = this.myData.length;
        this.dataSource.data = this.myData;
    }


    updateVolume() {
        this.loadingIndicator = true;
        this.editedVolume.postsIds = [];
        for (let index = 0; index < this.myData.length; index++) {
            this.editedVolume.postsIds.push(this.myData[index].id);
        }
        this.volServ.editVolume(this.editedVolume,this.editedVolume.id).subscribe(res => {
            this.loc.back();
            /* this.route.navigate(['/pages/volumes-management']); */
            this.snack.open("You Succesfully updated the Volume", "Done", {
                duration: 2000,
            })
            this.loadingIndicator = false;
        },
            err => {
                this.loadingIndicator = false;
                this.snack.open("Please Re-enter the right Volume information..", "OK")
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

export interface Ads {
    order: number;
    title: string;
    description: string;
    status: string;
    id: string;
}
