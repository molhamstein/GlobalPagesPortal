import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../../core/modules/shared.module';
import { AuthGuard } from '../../../../core/services/auth.gard';
import { CommonModule } from '../../../../../../node_modules/@angular/common';
import { BrowserModule } from '../../../../../../node_modules/@angular/platform-browser';
import { AdsService } from '../../../../core/services/ads.service';
import { VolumesManagementComponent } from './volumes-management.component';
import { AddVolumeComponent } from './add-volume/add-volume.component';
import { EditVolumeComponent } from './edit-volume/edit-volume.component';
import { ViewVolumeComponent } from './view-volume/view-volume.component';
import { VolumesService } from '../../../../core/services/volumes.service.';


const routes = [
    {
        path: '',
        component: VolumesManagementComponent,
    },
    {
        path: 'add-volume',
        component: AddVolumeComponent,
    },
    {
        path: 'edit-volume/:id',
        component: EditVolumeComponent,
    },
    {
        path: 'view-volume/:id',
        component: ViewVolumeComponent,
    }
];

@NgModule({
    declarations: [
        VolumesManagementComponent,
        AddVolumeComponent,
        EditVolumeComponent,
        ViewVolumeComponent
    ],
    imports: [
        SharedModule,
        CommonModule,
        RouterModule.forChild(routes),

    ],
    providers: [VolumesService, AdsService]
})

export class VolumesManagementModule {

}
